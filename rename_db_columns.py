
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="", 
        database="faith_tourism_db"
    )

def rename_columns():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Delete the header row if it exists
        # identifying it by COL 1 = 'Attraction_ID'
        try:
            cursor.execute("DELETE FROM attractions WHERE `COL 1` = 'Attraction_ID'")
            print(f"Deleted header row: {cursor.rowcount} rows affected.")
        except Exception as e:
            print(f"Header row deletion warning: {e}")

        # 2. Rename Columns
        # We need to know the current definitions to CHANGE them safely.
        # Based on previous inspection:
        # COL 1 varchar(13) -> attraction_id
        # COL 2 varchar(60) -> attraction_name
        # COL 3 varchar(7) -> type_id
        # COL 4 varchar(7) -> sect_id
        # COL 5 varchar(11) -> district_id
        # COL 6 varchar(35) -> category  (Was หมวดหมู่)
        # COL 7 varchar(4) -> work
        # COL 8 varchar(4) -> love
        # COL 9 varchar(4) -> luck
        # COL 10 varchar(10) -> latitude
        # COL 11 varchar(10) -> longitude
        # COL 12 varchar(180) -> sacred_object
        # COL 13 varchar(202) -> offerings
        
        rename_queries = [
            "ALTER TABLE attractions CHANGE `COL 1` `attraction_id` VARCHAR(13)",
            "ALTER TABLE attractions CHANGE `COL 2` `attraction_name` VARCHAR(60)",
            "ALTER TABLE attractions CHANGE `COL 3` `type_id` VARCHAR(7)",
            "ALTER TABLE attractions CHANGE `COL 4` `sect_id` VARCHAR(7)",
            "ALTER TABLE attractions CHANGE `COL 5` `district_id` VARCHAR(11)",
            "ALTER TABLE attractions CHANGE `COL 6` `category` VARCHAR(35)",
            "ALTER TABLE attractions CHANGE `COL 7` `work` VARCHAR(4)",
            "ALTER TABLE attractions CHANGE `COL 8` `love` VARCHAR(4)",
            "ALTER TABLE attractions CHANGE `COL 9` `luck` VARCHAR(4)",
            "ALTER TABLE attractions CHANGE `COL 10` `latitude` VARCHAR(10)",
            "ALTER TABLE attractions CHANGE `COL 11` `longitude` VARCHAR(10)",
            "ALTER TABLE attractions CHANGE `COL 12` `sacred_object` VARCHAR(180)",
            "ALTER TABLE attractions CHANGE `COL 13` `offerings` VARCHAR(202)"
        ]

        for query in rename_queries:
            try:
                cursor.execute(query)
                print(f"Executed: {query}")
            except mysql.connector.Error as err:
                print(f"Error executing {query}: {err}")

        conn.commit()
        
        # Verify
        cursor.execute("DESCRIBE attractions")
        print("\nNew Schema:")
        for col in cursor.fetchall():
            print(col)
            
        conn.close()
    except Exception as e:
        print(f"Error renaming columns: {e}")

if __name__ == "__main__":
    rename_columns()
