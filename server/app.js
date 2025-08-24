import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import articleRoutes from "./routes/kb.js";
import ticketRoutes from "./routes/ticket.js";
import agentRoutes from "./routes/agent.js";
import auditRoutes from "./routes/auditLog.js";
import connectDB from "./config/db.js";
import configRoutes from "./routes/config.js";

dotenv.config();

connectDB();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/kb", articleRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api", auditRoutes);
app.use("/api", configRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export default app;
