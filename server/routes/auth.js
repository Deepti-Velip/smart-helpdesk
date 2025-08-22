import express from "express";
import { registerUser, loginUser, getAgents } from "../controllers/auth.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", authMiddleware, getAgents);
export default router;
