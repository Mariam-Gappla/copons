const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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


module.exports = mongoose.model("Comment", commentSchema);
