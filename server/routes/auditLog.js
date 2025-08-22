import express from "express";
import AuditLog from "../models/AuditLog.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /api/tickets/:id/audit
router.get("/tickets/:id/audit", authMiddleware, async (req, res) => {
  try {
    const logs = await AuditLog.find({ ticketId: req.params.id }).sort({
      timestamp: 1,
    });
    res.json(logs);
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ message: "Error fetching audit logs" });
  }
});

export default router;
