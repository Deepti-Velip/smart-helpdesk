import Ticket from "../models/Ticket";

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
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error creating ticket", error: err });
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
      .populate("assignee", "name email");

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

    const { reply, status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: status || "waiting_human", updatedAt: new Date() },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.json({ ticket, reply });
  } catch (err) {
    res.status(500).json({ message: "Error replying to ticket", error: err });
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
