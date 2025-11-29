const mongoose = require("mongoose");
const replyCommentSchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true
    },
    targetType:{
      type:String,
      enum:["Reels","Post","Order"],
      required:true
    },
    targetId:{
      type:mongoose.Schema.Types.ObjectId,
      refPath:'targetType',
      required:true,
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
replyCommentSchema.index({ commentId: 1 });
replyCommentSchema.index({ userId: 1 });

module.exports = mongoose.model("ReplyComment", replyCommentSchema);
