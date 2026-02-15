
import mysql.connector
import requests
import time

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="", 
        database="faith_tourism_db"
    )

def get_wiki_image(place_name):
    try:
        headers = {
            "User-Agent": "FaithTourismApp/1.0 (contact@example.com)"
        }
        search_url = "https://th.wikipedia.org/w/api.php"
        search_params = {
            "action": "query",
            "list": "search",
            "srsearch": place_name,
            "format": "json"
        }
        search_res = requests.get(search_url, params=search_params, headers=headers).json()
        
        if search_res.get("query", {}).get("search"):
            title = search_res["query"]["search"][0]["title"]
            
            img_params = {
                "action": "query",
                "titles": title,
                "prop": "pageimages",
                "format": "json",
                "pithumbsize": 600
            }
            img_res = requests.get(search_url, params=img_params, headers=headers).json()
            
            pages = img_res.get("query", {}).get("pages", {})
            for page_id, page_data in pages.items():
                if "thumbnail" in page_data:
                    return page_data["thumbnail"]["source"]
    except Exception as e:
        print(f"Error fetching {place_name}: {e}")
    return None

def update_images():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all places
        cursor.execute("SELECT attraction_id, attraction_name FROM attractions")
        places = cursor.fetchall()
        
        print(f"Found {len(places)} places. Starting update...")
        
        updated_count = 0
        not_found_count = 0
        
        for pid, name in places:
            # clean name if needed (sometimes CSV has spaces)
            name = name.strip()
            
            print(f"Processing {name}...", end=" ")
            image_url = get_wiki_image(name)
            
            if image_url:
                sql = "UPDATE attractions SET image_url = %s WHERE attraction_id = %s"
                cursor.execute(sql, (image_url, pid))
                conn.commit()
                print(f"Updated! ({image_url[:30]}...)")
                updated_count += 1
            else:
                print("No image found.")
                not_found_count += 1
            
            # Be polite to API
            # time.sleep(0.1) 
            
        print(f"\nFinished. Updated: {updated_count}, Not Found: {not_found_count}")
        conn.close()
        
    except Exception as e:
        print(f"Database Error: {e}")

if __name__ == "__main__":
    update_images()
