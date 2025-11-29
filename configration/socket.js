let ioInstance;

module.exports = {
    init: (io) => {
        ioInstance = io;

        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            // ---- Chat Rooms ----
            socket.on("joinRoom", (roomId) => {
                socket.join(roomId);
                console.log(`User joined chat room: ${roomId}`);
            });

            // ---- Notification Room ----
            // المستخدم يدخل Room باسم userId
            socket.on("joinNotificationRoom", (userId) => {
                socket.join(`notif_${userId}`);
                console.log(`User joined notification room: notif_${userId}`);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    },

    getIO: () => {
        if (!ioInstance) {
            throw new Error("Socket.IO not initialized!");
        }
        return ioInstance;
    }
};
