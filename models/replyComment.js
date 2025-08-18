const mongoose = require("mongoose");

const replyCommentSchema = new mongoose.Schema(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType"  // 👈 هنا بيحدد المرجع حسب القيمة
    },
    targetType: {
      type: String,
      required: true,
      enum: ["Order", "Post"], // 👈 ممكن يكون Order أو Post
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ReplyComment", replyCommentSchema);
