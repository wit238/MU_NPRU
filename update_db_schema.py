
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="", 
        database="faith_tourism_db"
    )

def update_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Add image_url column if not exists
        try:
            cursor.execute("ALTER TABLE attractions ADD COLUMN image_url VARCHAR(500) DEFAULT NULL")
            print("Added 'image_url' column.")
        except mysql.connector.Error as err:
            if err.errno == 1060: # Duplicate column name
                print("'image_url' column already exists.")
            else:
                raise err
        
        # 2. Update existing rows with stable Unsplash URLs
        # Map place names (using LIKE for partial match) to URLs
        image_updates = {
            "ศาลเจ้าพ่อหลักเมือง": "https://images.unsplash.com/photo-1544211320-9a3d4f828734?q=80&w=800",
            "วัดสระสี่เหลี่ยม": "https://images.unsplash.com/photo-1563603417646-77869680c2f8?q=80&w=800",
            "วัดห้วยตะโก": "https://images.unsplash.com/photo-1599725427295-5847fa279543?q=80&w=800",
            "วัดไทร": "https://images.unsplash.com/photo-1507646903823-74b21e721a32?q=80&w=800",
            "วัดบ่อตะกั่วพุทธาราม": "https://images.unsplash.com/photo-1528181304800-259b0884852d?q=80&w=800"
        }
        
        for name, url in image_updates.items():
            # Use LIKE to match names partially
            sql = "UPDATE attractions SET image_url = %s WHERE `COL 2` LIKE %s"
            cursor.execute(sql, (url, f"%{name}%"))
            print(f"Updated image for: {name}")

        conn.commit()
        
        # Verify
        cursor.execute("SELECT `COL 2`, image_url FROM attractions WHERE image_url IS NOT NULL")
        results = cursor.fetchall()
        print(f"\nSuccessfully updated {len(results)} rows with images.")
        
        conn.close()
    except Exception as e:
        print(f"Error updating DB: {e}")

if __name__ == "__main__":
    update_db()
