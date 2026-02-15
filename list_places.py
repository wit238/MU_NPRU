
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="", 
        database="faith_tourism_db"
    )

try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT attraction_id, attraction_name FROM attractions")
    places = cursor.fetchall()
    print(f"Total places: {len(places)}")
    for p in places:
        print(f"{p[0]}: {p[1]}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
