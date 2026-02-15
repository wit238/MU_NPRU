
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="", 
        database="faith_tourism_db"
    )

def rename_ratings_columns():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Delete the header row if it exists
        # identifying it by COL 1 = 'User_ID'
        try:
            cursor.execute("DELETE FROM user_ratings WHERE `COL 1` = 'User_ID'")
            print(f"Deleted header row: {cursor.rowcount} rows affected.")
        except Exception as e:
            print(f"Header row deletion warning: {e}")

        # 2. Rename Columns
        # COL 1 varchar -> user_id
        # COL 2 varchar -> attraction_id
        # COL 3 varchar -> rating
        
        # Need to check original types. Assuming VARCHAR for IDs and INT/FLOAT for rating?
        # Let's check schema first to be safe about types.
        cursor.execute("DESCRIBE user_ratings")
        print("Original Schema:")
        cols = cursor.fetchall()
        for col in cols:
            print(col)
            
        # Rename queries keeping existing types (likely all VARCHAR if imported from CSV without care)
        # Based on previous pattern, they are likely VARCHAR. I'll convert Rating to INT if possible, but safe to keep as VARCHAR first then cast in app.
        # Actually user wants to rename "COL 1" etc.
        
        rename_queries = [
            "ALTER TABLE user_ratings CHANGE `COL 1` `user_id` VARCHAR(255)",
            "ALTER TABLE user_ratings CHANGE `COL 2` `attraction_id` VARCHAR(255)",
            "ALTER TABLE user_ratings CHANGE `COL 3` `rating` VARCHAR(255)" 
        ]

        for query in rename_queries:
            try:
                cursor.execute(query)
                print(f"Executed: {query}")
            except mysql.connector.Error as err:
                print(f"Error executing {query}: {err}")

        conn.commit()
        
        # Verify
        cursor.execute("DESCRIBE user_ratings")
        print("\nNew Schema:")
        for col in cursor.fetchall():
            print(col)
            
        conn.close()
    except Exception as e:
        print(f"Error renaming columns: {e}")

if __name__ == "__main__":
    rename_ratings_columns()
