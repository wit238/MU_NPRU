import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="",
        database="appdb"
    )
    cursor = conn.cursor()
    print("Connected to MySQL 'appdb'")
    
    # 1 or 2 for 'ชาย' or 'หญิง'
    query = "UPDATE users SET gender = ELT(FLOOR(1 + RAND() * 2), 'ชาย', 'หญิง')"
    cursor.execute(query)
    conn.commit()
    print(f"Successfully updated {cursor.rowcount} users with random gender (ชาย/หญิง).")
    conn.close()
except Exception as e:
    print(f"Failed to update gender: {e}")
