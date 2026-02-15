
import mysql.connector
import random

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="", 
        database="faith_tourism_db"
    )

def populate_generic():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get places without images
        cursor.execute("SELECT attraction_id, attraction_name, type_id, category FROM attractions WHERE image_url IS NULL OR image_url = ''")
        places = cursor.fetchall()
        
        print(f"Found {len(places)} places without images. Populating with generic themes...")
        
        # Generic Image Sets
        temple_images = [
            "https://images.unsplash.com/photo-1599725427295-5847fa279543?q=80&w=800",
            "https://images.unsplash.com/photo-1563603417646-77869680c2f8?q=80&w=800", 
            "https://images.unsplash.com/photo-1528181304800-259b0884852d?q=80&w=800",
            "https://images.unsplash.com/photo-1627546376269-14569527f31b?q=80&w=800",
            "https://images.unsplash.com/photo-1585644198426-1502a249cc1b?q=80&w=800"
        ]
        
        shrine_images = [
            "https://images.unsplash.com/photo-1595180492817-291771120428?q=80&w=800",
            "https://images.unsplash.com/photo-1624823180234-5834f8910404?q=80&w=800"
        ]
        
        market_images = [
            "https://images.unsplash.com/photo-1533038590840-1cde6b4ae6b5?q=80&w=800", # floating market style
        ]
        
        ancient_images = [
            "https://images.unsplash.com/photo-1582234032483-c287042531cd?q=80&w=800"
        ]

        # Process
        updated_count = 0
        for pid, name, tid, cat in places:
            # Determine type
            img_url = ""
            
            if "ศาลเจ้า" in name or "Shrine" in name:
                img_url = random.choice(shrine_images)
            elif "ตลาด" in name or "Market" in name:
                img_url = random.choice(market_images)
            elif "โบราณ" in name or "Ancient" in name:
                img_url = random.choice(ancient_images)
            else:
                # Default to Temple for Faith Tourism
                # Use a deterministic random based on ID to be consistent across refreshes if re-run
                # But here we just want to fill it once.
                img_url = random.choice(temple_images)
            
            sql = "UPDATE attractions SET image_url = %s WHERE attraction_id = %s"
            cursor.execute(sql, (img_url, pid))
            updated_count += 1
            
        conn.commit()
        print(f"Successfully populated {updated_count} remaining places with generic images.")
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    populate_generic()
