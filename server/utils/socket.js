// server/socket.js
import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join per-user room
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user-${userId}`);
      console.log(`${socket.id} joined user-${userId}`);
    });

    // Join per-ticket room
    socket.on("joinTicketRoom", (ticketId) => {
      socket.join(`ticket-${ticketId}`);
      console.log(`${socket.id} joined ticket-${ticketId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}
