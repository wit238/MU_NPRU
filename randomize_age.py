import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="", # default empty password for local dev
        database="appdb"
    )
    cursor = conn.cursor()
    print("Connected to MySQL 'appdb'")
except Exception as e:
    print(f"Connection failed: {e}")
    exit(1)

try:
    # Update age to a random integer between 26 and 41
    query = "UPDATE users SET age = FLOOR(26 + RAND() * 16)"
    cursor.execute(query)
    conn.commit()
    print(f"Successfully updated {cursor.rowcount} users with random age between 26-41.")
except Exception as e:
    print(f"Failed to update age: {e}")

try:
    conn.close()
    print("Database connection closed.")
except Exception as e:
    pass
