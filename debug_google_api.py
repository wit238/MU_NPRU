
import requests

api_key = "AIzaSyCui4h5-VBB9WmGWP6u8M0il3g7iKqJ56E"
place_name = "วัดพระปฐมเจดีย์"

print(f"Testing with API Key: {api_key}")
print(f"Searching for: {place_name}")

try:
    search_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={place_name}&key={api_key}"
    print(f"Requesting: {search_url}")
    response = requests.get(search_url)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("Response JSON keys:", data.keys())
        if "error_message" in data:
            print(f"API Error Message: {data['error_message']}")
            
        if data.get("results"):
            print(f"Found {len(data['results'])} results.")
            first_result = data["results"][0]
            if "photos" in first_result:
                photo_ref = first_result["photos"][0]["photo_reference"]
                print(f"Photo Reference found: {photo_ref[:20]}...")
                image_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={photo_ref}&key={api_key}"
                print(f"Constructed Image URL: {image_url}")
            else:
                print("No photos found in the first result.")
        else:
            print("No results found.")
            print("Full response:", data)
    else:
        print("HTTP Error:", response.text)

except Exception as e:
    print(f"Exception: {e}")
