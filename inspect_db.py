
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
    cursor.execute("DESCRIBE attractions")
    columns = cursor.fetchall()
    print("Table 'attractions' columns:")
    for col in columns:
        print(col)
    
    # Also check if 'users' table has what we expect, just in case
    cursor.execute("DESCRIBE users")
    print("\nTable 'users' columns:")
    for col in cursor.fetchall():
        print(col)
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
