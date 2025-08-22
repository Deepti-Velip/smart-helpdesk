import mongoose from "mongoose";

const agentSuggestionSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
  predictedCategory: String,
  articleIds: [String],
  draftReply: String,
  confidence: Number,
  autoClosed: Boolean,
  modelInfo: {
    provider: { type: String, default: "stub" },
    version: { type: String, default: "v1" },
    latencyMs: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AgentSuggestion", agentSuggestionSchema);
