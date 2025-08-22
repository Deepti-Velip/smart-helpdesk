from fastapi import FastAPI
from pydantic import BaseModel
from uuid import uuid4
from app.services.planner import run_triage

app = FastAPI(title="Agent Worker")

# Input schema
class TicketIn(BaseModel):
    ticketId: str
    title: str
    description: str

# Output schema
class TriageResult(BaseModel):
    traceId: str
    predictedCategory: str
    confidence: float
    articleIds: list[str]
    draftReply: str
    autoClosed: bool

@app.post("/triage", response_model=TriageResult)
async def triage(ticket: TicketIn):
    result = run_triage(ticket.dict())
    return result
