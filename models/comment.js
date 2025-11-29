const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType"
    },
    targetType: {
      type: String,
      required: true,
      enum: ["Order", "Post", "Reels"], // لو هتزودي Reel
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

// ✅ إضافة Index مركب
commentSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model("Comment", commentSchema);
