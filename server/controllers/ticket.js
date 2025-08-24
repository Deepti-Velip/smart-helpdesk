import AuditLog from "../models/AuditLog.js";
import Ticket from "../models/Ticket.js";
import { triggerTriage } from "../controllers/agent.js";
import { notifyStatusChange, notifyUserTicketUpdate } from "../index.js";
// import { notifyStatusChange } from "../index.js";

// Create new ticket (user)
export const createTicket = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      category,
      createdBy: req.user.id,
    });

    // Log TICKET_CREATED
    await AuditLog.create({
      ticketId: ticket._id,
      traceId: "ticket-" + ticket._id,
      actor: "user",
      action: "TICKET_CREATED",
      meta: { title, description },
    });

    // Trigger triage in background
    triggerTriage(ticket).catch((err) =>
      console.error("Agent triage failed:", err)
    );

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error creating ticket:", err);
    res
      .status(500)
      .json({ message: "Error creating ticket", error: err.message });
  }
};

// Get tickets (user = own, agent/admin = all)
export const getTickets = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "user") filter.createdBy = req.user.id;
    if (req.query.status) filter.status = req.query.status;

    const tickets = await Ticket.find(filter).populate(
      "createdBy",
      "name email"
    );
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tickets", error: err });
  }
};

// Get ticket by ID (user = own, agent/admin = all)
export const getTicketById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };

    if (req.user.role === "user") {
      filter.createdBy = req.user.id;
    }

    const ticket = await Ticket.findOne(filter)
      .populate("createdBy", "name email")
      .populate("assignee", "name email")
      .populate("agentSuggestionId");

    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or access denied" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ticket", error: err });
  }
};

// Reply to ticket (agent/admin)
export const replyToTicket = async (req, res) => {
  try {
    if (!["agent", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { reply, action } = req.body;
    // action = "close" | "reopen"

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Apply action
    if (action === "close") {
      ticket.status = "closed";
    } else if (action === "reopen") {
      ticket.status = "open";
    } else {
      ticket.status = "resolved"; // default when reply is sent
    }
    ticket.updatedAt = new Date();
    await ticket.save();

    // Audit Log
    await AuditLog.create({
      ticketId: ticket._id,
      traceId: "ticket-" + ticket._id,
      actor: "agent",
      action:
        action === "reopen"
          ? "TICKET_REOPENED"
          : action === "close"
          ? "TICKET_CLOSED"
          : "REPLY_SENT",
      meta: { reply },
    });

    res.json({ message: "Reply processed", ticket });
  } catch (err) {
    console.error("Error in reply:", err);
    res.status(500).json({ message: "Error sending reply" });
  }
};

// Assign ticket (agent/admin)
export const assignTicket = async (req, res) => {
  try {
    if (!["agent", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { assignee } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignee, updatedAt: new Date() },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error assigning ticket", error: err });
  }
};

// Update ticket status (only admin/agent)
export const updateTicketStatus = async (req, res) => {
  try {
    if (!["admin", "agent"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    if (
      !["open", "triaged", "waiting_human", "resolved", "closed"].includes(
        status
      )
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("assignee", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 1. Notify clients in the ticket room (if any are watching live)
    notifyStatusChange(req.params.id, status);
    notifyUserTicketUpdate(ticket.createdBy._id, req.params.id, status);

    res.json({ message: "Status updated successfully", ticket });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating status", error: err.message });
  }
};
