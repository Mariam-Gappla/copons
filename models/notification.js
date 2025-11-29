// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {               // المستلم
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    fromUserId: {           // مين عمل الفعل
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {                 // نوع الإشعار
      type: String,
      enum: ["comment", "reply", "like", "bid"],
      required: true
    },
    targetId: {             // الحاجة اللي حصل عليها الإشعار
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType"
    },
    targetType: {           // نوع الحاجة
      type: String,
      enum: ["Reel", "Post", "Order", "Comment"],
      required: true
    },
    message: {              // رسالة الإشعار
      type: String,
      required: true
    },
    isRead: {               // هل المستخدم قرأه
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
