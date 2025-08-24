import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
// Create HTTP server
const httpServer = createServer(app);

// Attach Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join per-user room (for global notifications)
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`${socket.id} joined user-${userId}`);
  });

  // Join per-ticket room (useful when user/agent views ticket live)
  socket.on("joinTicketRoom", (ticketId) => {
    socket.join(`ticket-${ticketId}`);
    console.log(`${socket.id} joined ticket-${ticketId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- Helpers ---

// Notify all clients in a specific ticket room
export const notifyStatusChange = async (ticketId, newStatus) => {
  const room = `ticket-${ticketId}`;
  const sockets = await io.in(room).fetchSockets();

  if (sockets.length > 0) {
    io.to(room).emit("ticketStatusUpdated", { ticketId, status: newStatus });
    console.log(`✅ Update sent to ${sockets.length} client(s) in ${room}`);
  } else {
    console.log(`⚠️ No clients connected to ${room}, update not delivered`);
  }
};

// Notify the ticket creator (user room)
export const notifyUserTicketUpdate = async (userId, ticketId, newStatus) => {
  const room = `user-${userId}`;
  const sockets = await io.in(room).fetchSockets();

  if (sockets.length > 0) {
    io.to(room).emit("userTicketUpdated", { ticketId, status: newStatus });
    console.log(
      `✅ Notified user-${userId} about ticket ${ticketId} → ${newStatus}`
    );
  } else {
    console.log(`⚠️ No active clients for user-${userId}`);
  }
};

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
