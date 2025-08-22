import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createTicket,
  getTickets,
  getTicketById,
  replyToTicket,
  assignTicket,
  updateTicketStatus,
} from "../controllers/ticket.js";

const router = express.Router();

//user
router.post("/", authMiddleware, createTicket);

//user sees own, agent/admin see all
router.get("/", authMiddleware, getTickets);

//user sees own, agent/admin see all
router.get("/:id", authMiddleware, getTicketById);

//agent/admin
router.post("/:id/reply", authMiddleware, replyToTicket);

//agent/admin
router.post("/:id/assign", authMiddleware, assignTicket);

// PATCH /api/tickets/:id/status
router.patch("/:id/status", authMiddleware, updateTicketStatus);
export default router;
