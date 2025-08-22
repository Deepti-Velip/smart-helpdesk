from uuid import uuid4
from app.stubs import stub_provider
from .kb_client import get_kb_articles
from .config_client import get_config

def run_triage(ticket: dict):
    trace_id = str(uuid4())

    # 1. Get config + KB from Node
    config = get_config()
    kb_articles = get_kb_articles()

    # 2. Classify
    classification = stub_provider.classify(ticket["description"])

    # 3. Retrieve KB (simple tag match)
    matched_articles = [a for a in kb_articles if classification["predictedCategory"] in a.get("tags", [])]
    if not matched_articles:
        matched_articles = kb_articles[:1]  # fallback

    # 4. Draft
    draft = stub_provider.draft(ticket["description"], matched_articles)

    # 5. Decision (using config, not hardcoded)
    auto_closed = False
    if config["autoCloseEnabled"] and classification["confidence"] >= config["confidenceThreshold"]:
        auto_closed = True

    # 6. Return structured result
    return {
        "traceId": trace_id,
        "predictedCategory": classification["predictedCategory"],
        "confidence": classification["confidence"],
        "articleIds": [a["_id"] for a in matched_articles],
        "draftReply": draft["draftReply"],
        "autoClosed": auto_closed,
        "configUsed": config  # debug/audit
    }
