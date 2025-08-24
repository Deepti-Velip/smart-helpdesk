import axios from "axios";
import AgentSuggestion from "../models/AgentSuggestion.js";
import AuditLog from "../models/AuditLog.js";
import { notifyStatusChange, notifyUserTicketUpdate } from "../index.js";

const AGENT_URL = process.env.AGENT_URL || "http://localhost:8000/triage";

export async function triggerTriage(ticket) {
  const start = Date.now();

  try {
    // --- 1. Call FastAPI worker ---
    const res = await axios.post(AGENT_URL, {
      ticketId: ticket._id,
      title: ticket.title,
      description: ticket.description,
    });

    const triage = res.data;

    // --- 2. Save AgentSuggestion ---
    const suggestion = await AgentSuggestion.create({
      ticketId: ticket._id,
      predictedCategory: triage.predictedCategory,
      articleIds: triage.articleIds,
      draftReply: triage.draftReply,
      confidence: triage.confidence,
      autoClosed: triage.autoClosed,
      modelInfo: {
        provider: "stub",
        version: "v1",
        latencyMs: Date.now() - start,
      },
    });

    // --- 3. Update Ticket status ---
    ticket.agentSuggestionId = suggestion._id;
    ticket.status = triage.autoClosed ? "resolved" : "waiting_human";
    await ticket.save();

    // Notify via Socket.IO
    notifyStatusChange(req.params.id, ticket.status);
    notifyUserTicketUpdate(ticket.createdBy._id, req.params.id, ticket.status);

    // --- 4. Log steps in AuditLog ---
    await AuditLog.create({
      ticketId: ticket._id,
      traceId: triage.traceId,
      actor: "system",
      action: triage.autoClosed ? "AUTO_CLOSED" : "ASSIGNED_TO_HUMAN",
      meta: triage,
    });

    return suggestion;
  } catch (err) {
    console.error(" Triage failed:", err.message);
    throw err;
  }
}
