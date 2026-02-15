
import requests

def get_wiki_image(place_name):
    try:
        headers = {
            "User-Agent": "FaithTourismApp/1.0 (contact@example.com)"
        }
        # Search for the page first to get the exact title
        search_url = "https://th.wikipedia.org/w/api.php"
        search_params = {
            "action": "query",
            "list": "search",
            "srsearch": place_name,
            "format": "json"
        }
        search_res = requests.get(search_url, params=search_params, headers=headers).json()
        
        if search_res.get("query", {}).get("search"):
            title = search_res["query"]["search"][0]["title"]
            
            # Now fetch the image for this title
            img_params = {
                "action": "query",
                "titles": title,
                "prop": "pageimages",
                "format": "json",
                "pithumbsize": 600
            }
            img_res = requests.get(search_url, params=img_params, headers=headers).json()
            
            pages = img_res.get("query", {}).get("pages", {})
            for page_id, page_data in pages.items():
                if "thumbnail" in page_data:
                    return page_data["thumbnail"]["source"]
    except Exception as e:
        print(f"Error: {e}")
    return None

test_places = ["วัดพระปฐมเจดีย์ราชวรมหาวิหาร", "วัดไร่ขิง", "วัดดอนหวาย", "ศาลเจ้าพ่อหลักเมือง"]

for place in test_places:
    url = get_wiki_image(place)
    print(f"{place}: {url}")
