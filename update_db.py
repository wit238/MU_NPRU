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

# Add age column
try:
    cursor.execute("ALTER TABLE users ADD COLUMN age INT DEFAULT NULL")
    print("Column 'age' added successfully.")
except Exception as e:
    print(f"Skipped adding 'age': {e} (might already exist)")

# Add gender column
try:
    cursor.execute("ALTER TABLE users ADD COLUMN gender VARCHAR(50) DEFAULT NULL")
    print("Column 'gender' added successfully.")
except Exception as e:
    print(f"Skipped adding 'gender': {e} (might already exist)")

try:
    conn.commit()
    conn.close()
    print("Database connection closed.")
except Exception as e:
    pass
