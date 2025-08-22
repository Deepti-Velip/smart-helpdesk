import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    autoCloseEnabled: { type: Boolean, default: false },
    confidenceThreshold: { type: Number, default: 0.8 },
    slaHours: { type: Number, default: 24 },
  },
  { timestamps: true }
);

export default mongoose.model("Config", configSchema);
