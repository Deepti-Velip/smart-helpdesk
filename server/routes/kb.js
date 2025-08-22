import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/kb.js";

const router = express.Router();

router.get("/", getArticles);
router.post("/", authMiddleware, requireRole("admin"), createArticle);
router.put("/:id", authMiddleware, requireRole("admin"), updateArticle);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteArticle);

export default router;
