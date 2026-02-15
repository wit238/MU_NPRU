import pickle
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

def visualize_ubcf_model():
    model_path = "ubcf_model.pkl"
    try:
        with open(model_path, 'rb') as f:
            data = pickle.load(f)
        
        user_similarity = data.get('user_similarity')
        
        if user_similarity is None:
            print("Error: 'user_similarity' not found in model.")
            return

        print("Generating heatmap for User Similarity Matrix...")
        plt.figure(figsize=(15, 12))  # Slightly larger figure
        
        # Check if DataFrame or Array for better labeling
        if isinstance(user_similarity, pd.DataFrame):
             sns.heatmap(user_similarity, annot=True, fmt=".2f", cmap='viridis', 
                        xticklabels=user_similarity.columns, yticklabels=user_similarity.index)
        else:
             sns.heatmap(user_similarity, annot=True, fmt=".2f", cmap='viridis')

        plt.title('User Similarity Heatmap (Annotated)')
        plt.tight_layout()
        
        output_file = "user_similarity_heatmap.png"
        plt.savefig(output_file)
        print(f"Heatmap saved to {output_file}")
        
    except FileNotFoundError:
        print(f"Error: Model file '{model_path}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    visualize_ubcf_model()
