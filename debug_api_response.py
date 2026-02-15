
import requests
import json

try:
    # Try a probable user ID, or we might need to look at the DB. 
    # Since I don't know a guaranteed existing user, I'll try to register one first or just try 1.
    # The logs showed successful startups, so DB should be there.
    
    # First, let's try to see if we can get a recommendation for user 1.
    url = "http://127.0.0.1:8000/recommend/1"
    print(f"Requesting: {url}")
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        print("API Response Status: Success")
        
        if "recommendations" in data:
           if data.get("status") != "error" and data.get("recommendations"):
            print(f"Found {len(data['recommendations'])} recommendations.")
            rec = data['recommendations'][0]
            print(f"Rec 1:\n  Name: {rec.get('name')}\n  Image URL: {rec.get('image')[:50]}...")
            print(f"  Sacred Object: {rec.get('sacred_object')[:50]}...")
            print(f"  Offerings: {rec.get('offerings')[:50]}...")
            print("-" * 20)
            rec = data['recommendations'][-1]
            print(f"Rec 5:\n  Name: {rec.get('name')}\n  Image URL: {rec.get('image')[:50]}...")
            print(f"  Sacred Object: {rec.get('sacred_object')[:50]}...")
            print(f"  Offerings: {rec.get('offerings')[:50]}...")
            print("-" * 20)
        else:
            print("No 'recommendations' key in response.")
            print(data)
    else:
        print(f"API Failed: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"Exception: {e}")
