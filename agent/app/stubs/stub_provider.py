import random
from uuid import uuid4
from app.services.config_client import get_config

KEYWORDS = {
    "billing": ["refund", "invoice", "payment", "charged"],
    "tech": ["error", "bug", "stack", "crash", "403", "500", "login"],
    "shipping": ["delivery", "shipment", "package", "tracking"]
}

def classify(text: str):
    text_lower = text.lower()
    for category, words in KEYWORDS.items():
        if any(w in text_lower for w in words):
            return {
                "predictedCategory": category,
                "confidence": round(random.uniform(0.7, 0.95), 2)
            }
    return {"predictedCategory": "other", "confidence": 0.5}

def retrieve_kb(predicted_category: str, kb_articles: list):
    matched = [a for a in kb_articles if predicted_category in a.get("tags", [])]
    return matched[:3] if matched else kb_articles[:1]

def draft(text: str, articles: list):
    citations = [a["_id"] for a in articles]
    titles = [a["title"] for a in articles]
    draft_reply = "Based on our KB, here are some helpful articles: " + ", ".join(titles)
    return {"draftReply": draft_reply, "citations": citations}

def decision(classification: dict, config: dict):
    """Decide auto-close using dynamic config"""
    if config["autoCloseEnabled"] and classification["confidence"] >= config["confidenceThreshold"]:
        return True
    return False

def run_stub_pipeline(ticket: dict, kb_articles: list):
    trace_id = str(uuid4())

    # Load dynamic config
    config = get_config()

    # 1. Classify
    classification = classify(ticket["description"])

    # 2. Retrieve KB
    matched_articles = retrieve_kb(classification["predictedCategory"], kb_articles)

    # 3. Draft reply
    draft_reply = draft(ticket["description"], matched_articles)

    # 4. Decision
    auto_closed = decision(classification, config)

    return {
        "traceId": trace_id,
        "predictedCategory": classification["predictedCategory"],
        "confidence": classification["confidence"],
        "articleIds": [a["_id"] for a in matched_articles],
        "draftReply": draft_reply["draftReply"],
        "autoClosed": auto_closed,
        "configUsed": config  # (for debugging / audit)
    }
