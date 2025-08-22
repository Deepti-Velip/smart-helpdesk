import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  status: {
    type: String,
    enum: ["unpublished", "published"],
    default: "unpublished",
  },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Article", articleSchema);
