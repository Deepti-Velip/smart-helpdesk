import express from "express";
import AgentSuggestion from "../models/AgentSuggestion.js";
const router = express.Router();

// GET /api/agent/suggestion/:ticketId
router.get("/suggestions/:ticketId", async (req, res) => {
  const suggestion = await AgentSuggestion.findOne({
    ticketId: req.params.ticketId,
  });
  res.json(suggestion);
});

export default router;
