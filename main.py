# main.py
import pickle
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import mysql.connector
import requests
from sklearn.metrics.pairwise import cosine_similarity

# Global variables for model
user_similarity_matrix = None
user_item_matrix_global = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on startup
    global user_similarity_matrix, user_item_matrix_global
    try:
        with open("ubcf_model.pkl", "rb") as f:
            data = pickle.load(f)
            user_similarity_matrix = data.get('user_similarity')
            user_item_matrix_global = data.get('user_item_matrix')
        print("Model loaded successfully from ubcf_model.pkl")
    except Exception as e:
        print(f"Error loading model: {e}")
    yield

app = FastAPI(lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class RegisterUser(BaseModel):
    name: str
    birth_date: str
    password: str

class LoginUser(BaseModel):
    name: str
    password: str

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="", 
        database="faith_tourism_db"
    )

# 0. ตรวจสอบและสร้างตาราง Users
def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                birth_date DATE,
                password VARCHAR(255) NOT NULL
            )
        """)
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error initializing DB: {e}")

init_db()

@app.post("/register")
def register(user: RegisterUser):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE name = %s", (user.name,))
        if cursor.fetchone():
            conn.close()
            return {"status": "error", "message": "ชื่อนี้มีในระบบแล้ว"}
        sql = "INSERT INTO users (name, birth_date, password) VALUES (%s, %s, %s)"
        cursor.execute(sql, (user.name, user.birth_date, user.password))
        conn.commit()
        u_id = cursor.lastrowid
        conn.close()
        return {"status": "success", "user_id": str(u_id), "name": user.name}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/login")
def login(user: LoginUser):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name FROM users WHERE name = %s AND password = %s", (user.name, user.password))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {"status": "success", "user_id": str(row['id']), "name": row['name']}
        else:
            return {"status": "error", "message": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def home():
    return {"message": "Welcome to Faith Tourism API ⛩️"}

@app.get("/test-db")
def test_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        schema_info = {}
        for table in tables:
            table_name = list(table.values())[0]
            cursor.execute(f"DESCRIBE {table_name}")
            columns = cursor.fetchall()
            schema_info[table_name] = [col['Field'] for col in columns]
        conn.close()
        return {"status": "Connected Successfully! ", "database": "faith_tourism_db", "tables_found": list(schema_info.keys()), "schema_details": schema_info}
    except Exception as e:
        return {"status": "Connection Failed", "error": str(e)}

@app.get("/recommend/{user_id}")
def recommend(user_id: str):
    try:
        global user_similarity_matrix, user_item_matrix_global
        
        if user_similarity_matrix is None or user_item_matrix_global is None:
            return {"error": "Recommendation model not loaded."}

        conn = get_db_connection()
        df_places = pd.read_sql("SELECT * FROM attractions", conn)
        conn.close()

        if df_places.empty:
            return {"error": "Attractions database is empty."}
            
        # Header row removed from DB, so no need to filter

        target_user_id = user_id
        print(f"DEBUG: Request user_id='{user_id}'")
        if target_user_id not in user_item_matrix_global.index:
            potential_ids = [str(idx) for idx in user_item_matrix_global.index if str(user_id).lower() in str(idx).lower()]
            if potential_ids:
                target_user_id = potential_ids[0]
                print(f"DEBUG: Matched to target_user_id='{target_user_id}'")
            else:
                print(f"DEBUG: User not found: '{user_id}'")
                return {"error": f"User ID {user_id} not found.", "debug": {"available_samples": list(user_item_matrix_global.index[:5])}}

        similar_users = user_similarity_matrix[target_user_id].sort_values(ascending=False)[1:6]
        my_visited = user_item_matrix_global.loc[target_user_id][user_item_matrix_global.loc[target_user_id] > 0].index.tolist()

        recommended_scores = {}
        for sim_user, score in similar_users.items():
            their_ratings = user_item_matrix_global.loc[sim_user]
            for place_id, rating in their_ratings.items():
                if rating > 3 and place_id not in my_visited:
                    if place_id not in recommended_scores:
                        recommended_scores[place_id] = 0
                    recommended_scores[place_id] += rating * score

        # Mapping dictionaries
        type_mapping = {
            "7": "วัด",
            "10": "ศาลเจ้า",
            "11": "สถานที่ปฏิบัติธรรม",
            "12": "โบราณสถาน"
        }
        category_mapping = {
            "6": "การงาน",
            "7": "การเงิน",
            "8": "ความรัก",
            "9": "การเงิน",
            "10": "การเงิน",
            "11": "การเงิน"
        }

        # Google Maps API Key (Hardcoded for demo, ideally from env)
        primary_api_key = "AIzaSyCui4h5-VBB9WmGWP6u8M0il3g7iKqJ56E"
        
        sorted_recs = sorted(recommended_scores.items(), key=lambda x: x[1], reverse=True)[:5]
        results = []
        for place_id, score in sorted_recs:
            str_place_id = str(place_id)
            place_info = df_places[df_places['attraction_id'] == str_place_id]
            
            if not place_info.empty:
                row = place_info.iloc[0]
                
                raw_type = str(row['type_id']) if 'type_id' in row else "Unknown"
                raw_category = str(row['sect_id']) if 'sect_id' in row else "Unknown" # Using sect_id as category based on previous COL 4 usage
                
                type_name = type_mapping.get(raw_type, raw_type)
                category_name = category_mapping.get(raw_category, raw_category)
                place_name = row['attraction_name'] if 'attraction_name' in row else "Unknown"

                # 0. Check Database for Image URL
                image_url = row['image_url'] if 'image_url' in row and row['image_url'] else ""

                # 1. Fallback to Specific Hardcoded Map if DB is empty
                if not image_url:
                    specific_image_map = {
                        "ศาลเจ้าพ่อหลักเมือง": "https://images.unsplash.com/photo-1544211320-9a3d4f828734?q=80&w=800",
                        "วัดสระสี่เหลี่ยม": "https://images.unsplash.com/photo-1563603417646-77869680c2f8?q=80&w=800",
                        "วัดห้วยตะโก": "https://images.unsplash.com/photo-1599725427295-5847fa279543?q=80&w=800",
                        "วัดไทร": "https://images.unsplash.com/photo-1507646903823-74b21e721a32?q=80&w=800",
                        "วัดบ่อตะกั่วพุทธาราม": "https://images.unsplash.com/photo-1528181304800-259b0884852d?q=80&w=800"
                    }
                    
                    for key_name, url in specific_image_map.items():
                        if key_name in place_name:
                            image_url = url
                            break

                # 2. If not in map, try Google API (will fail without billing)
                if not image_url:
                    try:
                        search_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={place_name}&key={primary_api_key}"
                        response = requests.get(search_url)
                        if response.status_code == 200:
                            data = response.json()
                            if "error_message" in data:
                                pass # Silently fail
                            
                            if data.get("results"):
                                photos = data["results"][0].get("photos")
                                if photos:
                                    photo_reference = photos[0]["photo_reference"]
                                    image_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={photo_reference}&key={primary_api_key}"
                    except Exception:
                        pass

                # 3. Fallback to Generic Category Images if all else fails
                if not image_url:
                    # Generic High Quality Images by Type
                    if "ศาลเจ้า" in type_name or "ศาลเจ้า" in place_name:
                         image_url = "https://images.unsplash.com/photo-1595180492817-291771120428?q=80&w=800" # Shrine
                    elif "โบราณสถาน" in type_name:
                         image_url = "https://images.unsplash.com/photo-1582234032483-c287042531cd?q=80&w=800" # Ancient
                    else:
                         # Default Temple Rotation
                         fallback_images = [
                            "https://images.unsplash.com/photo-1599725427295-5847fa279543?q=80&w=800",
                            "https://images.unsplash.com/photo-1563603417646-77869680c2f8?q=80&w=800",
                            "https://images.unsplash.com/photo-1528181304800-259b0884852d?q=80&w=800"
                        ]
                         img_index = int(str_place_id) % len(fallback_images)
                         image_url = fallback_images[img_index]

                results.append({
                    "id": str_place_id,
                    "name": place_name,
                    "type": type_name,
                    "category": category_name,
                    "lat": float(row['latitude']) if ('latitude' in row and row['latitude'] and str(row['latitude']).upper() != 'LAT') else 0.0,
                    "lng": float(row['longitude']) if ('longitude' in row and row['longitude'] and str(row['longitude']).upper() != 'LONG') else 0.0,
                    "score": round(score, 2),
                    "image": image_url,
                    "sacred_object": row['sacred_object'] if 'sacred_object' in row else "-",
                    "offerings": row['offerings'] if 'offerings' in row else "-"
                })

        return {"user_id": user_id, "matched_id": target_user_id, "recommendations": results, "message": f"Showing recommendations for User {target_user_id}" if user_id != target_user_id else ""}

    except Exception as e:
        return {"error": str(e)}
