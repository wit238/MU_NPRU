import pickle
import pandas as pd
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="", 
        database="faith_tourism_db"
    )

def diagnose():
    try:
        # Check pickle types
        with open("ubcf_model.pkl", "rb") as f:
            data = pickle.load(f)
            uim = data.get('user_item_matrix')
            if uim is not None:
                print(f"Pickle Index Type: {uim.index.dtype}")
                print(f"Pickle Column (Place ID) Type: {uim.columns.dtype}")
                print(f"Sample Index: {uim.index[:2].tolist()}")
                print(f"Sample Column: {uim.columns[:2].tolist()}")
        
        # Check DB types
        conn = get_db_connection()
        df_places = pd.read_sql("SELECT * FROM attractions LIMIT 5", conn)
        conn.close()
        
        if not df_places.empty:
            print(f"DB attractions 'COL 1' Type: {df_places['COL 1'].dtype}")
            print(f"Sample DB 'COL 1': {df_places['COL 1'].tolist()}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    diagnose()
