import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["article", "video", "pdf", "image", "other"],
    },
    tags: [String],
    embedding: {
      type: [Number],
      required: true,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

//Compound indexes
itemSchema.index({ user: 1, createdAt: -1 });
itemSchema.index({ user: 1, type: -1 });
itemSchema.index({ user: 1, tags: -1 });

//Text index for search
itemSchema.index({
  title: "text",
  description: "text",
});

const itemModel = mongoose.model("Item", itemSchema);

export default itemModel;
