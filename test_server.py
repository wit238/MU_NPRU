import urllib.request
import json
import urllib.error

url = 'http://127.0.0.1:8000/register'
data = json.dumps({"user_name": "testuser_debug", "password": "Password123"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    response = urllib.request.urlopen(req)
    print("STATUS 200")
    print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP ERROR: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"OTHER ERROR: {e}")
