import express from "express";
import Config from "../models/Config.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /api/config
router.get("/config", authMiddleware, async (req, res) => {
  try {
    const config = (await Config.findOne()) || (await Config.create({}));
    res.json(config);
  } catch (err) {
    console.error("Error fetching config:", err);
    res.status(500).json({ message: "Error fetching config" });
  }
});

// PUT /api/config (admin only)
router.put("/config", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const { autoCloseEnabled, confidenceThreshold, slaHours } = req.body;
    let config = await Config.findOne();

    if (!config) {
      config = new Config({ autoCloseEnabled, confidenceThreshold, slaHours });
    } else {
      config.autoCloseEnabled = autoCloseEnabled;
      config.confidenceThreshold = confidenceThreshold;
      config.slaHours = slaHours;
    }

    await config.save();
    res.json(config);
  } catch (err) {
    console.error("Error updating config:", err);
    res.status(500).json({ message: "Error updating config" });
  }
});

export default router;
