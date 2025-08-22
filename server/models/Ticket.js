import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: {
    type: String,
    enum: ["billing", "tech", "shipping", "other"],
    default: "other",
  },
  status: {
    type: String,
    enum: ["open", "triaged", "waiting_human", "resolved", "closed"],
    default: "open",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  agentSuggestionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AgentSuggestion",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", ticketSchema);
