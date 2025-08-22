import requests
import os

NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:5000/api/config")

def get_config():
    try:
        res = requests.get(NODE_API_URL, timeout=5)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print("⚠️ Failed to fetch config from Node, using defaults:", e)
        return {
            "autoCloseEnabled": True,
            "confidenceThreshold": 0.78,
            "slaHours": 24
        }
