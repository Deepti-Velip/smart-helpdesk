import os
import requests

NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:5000/api")

def get_kb_articles():
    try:
        res = requests.get(f"{NODE_API_URL}/kb")   # GET /api/kb
        res.raise_for_status()
        return res.json()   # Expect list of { _id, title, tags, content }
    except Exception as e:
        print("⚠️ Failed to fetch KB articles:", e)
        return []
