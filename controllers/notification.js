const socket = require("../configration/socket");
const Notification = require("../models/notification");

const createNotification = async ({ userId, fromUserId, type, targetId, targetType, message }) => {
    // حفظ Notification في DB
    const notification = await Notification.create({
        userId,
        fromUserId,
        type,
        targetId,
        targetType,
        message
    });

    // ارسال realtime عبر Room الخاصة بالـ Notification
    const io = socket.getIO();
    io.to(`notif_${userId}`).emit("notification", {
        id: notification._id,
        type: notification.type,
        message: notification.message,
        targetId: notification.targetId,
        targetType: notification.targetType,
        fromUserId: notification.fromUserId,
        createdAt: notification.createdAt
    });

    return notification;
};
module.exports={createNotification}
