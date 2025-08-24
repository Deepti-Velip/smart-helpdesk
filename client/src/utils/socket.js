import { io } from "socket.io-client";

//  Connect to backend server
const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

// Request notification permission on load
if (typeof window !== "undefined" && "Notification" in window) {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

/**
 * Join a user-specific room (for personal ticket updates)
 */
export const joinUserRoom = (userId) => {
  if (!userId) return;

  const join = () => {
    socket.emit("joinUserRoom", userId);
  };

  if (socket.connected) {
    join();
  } else {
    socket.once("connect", join);
  }
};

/**
 * Join a specific ticket room (to track one ticket's updates)
 */
export const joinTicketRoom = (ticketId) => {
  if (!ticketId) return;

  const join = () => {
    socket.emit("joinTicketRoom", ticketId);
  };

  if (socket.connected) {
    join();
  } else {
    socket.once("connect", join);
  }
};

/**
 * Global listener for ticket updates
 */
socket.on("ticketStatusUpdated", (data) => {
  // Optional: trigger a browser notification
  if (Notification.permission === "granted") {
    new Notification("Ticket Update", {
      body: `Ticket ${data.ticketId} is now ${data.status}`,
    });
  }
});

/**
 * User-specific updates listener
 */
socket.on("userTicketUpdated", (data) => {
  if (Notification.permission === "granted") {
    new Notification("Your Ticket Update", {
      body: `Ticket ${data.ticketId} is now ${data.status}`,
    });
  }
});

/**
 * Utility to register custom update handlers (for React state updates)
 */
export const onTicketUpdate = (callback) => {
  socket.on("ticketStatusUpdated", callback);
  socket.on("userTicketUpdated", callback);
};

/**
 * Utility to remove listeners (avoid memory leaks in React)
 */
export const offTicketUpdate = (callback) => {
  socket.off("ticketStatusUpdated", callback);
  socket.off("userTicketUpdated", callback);
};

export default socket;
