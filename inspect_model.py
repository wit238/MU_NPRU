import pickle
import pandas as pd
import numpy as np

def inspect_pickle(file_path):
    try:
        with open(file_path, 'rb') as f:
            data = pickle.load(f)
        
        print(f"--- Inspection results for {file_path} ---")
        print(f"Type: {type(data)}")
        
        if isinstance(data, pd.DataFrame):
            print("Shape:", data.shape)
            print("Columns:", data.columns.tolist()[:10])
            print("Index:", data.index.tolist()[:10])
            print("\nHead:\n", data.head())
        elif isinstance(data, dict):
            print("Keys:", list(data.keys()))
            for k, v in data.items():
                print(f"Key '{k}' type: {type(v)}")
        elif hasattr(data, '__dict__'):
            print("Attributes:", vars(data).keys())
        else:
            print("Data summary:", str(data)[:500])
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_pickle("ubcf_model.pkl")
