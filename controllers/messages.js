const Message = require("../models/messages");
const socket = require("../configration/socket");
const User = require("../models/user");
const mongoose=require("mongoose");
// إرسال رسالة جديدة
const sendMessage = async (req, res, next) => {
    try {
        const { sender, receiver, text } = req.body;

        // Room ID ثابت لكل محادثة بين الشخصين
        const roomId = sender < receiver ? `${sender}_${receiver}` : `${receiver}_${sender}`;

        // حفظ الرسالة في DB
        const saved = await Message.create({ sender, receiver, roomId, text });

        // إرسال الرسالة real-time للـ Room
        const io = socket.getIO();
        io.to(roomId).emit("newMessage", saved);

        res.status(200).json({
            status: true,
            code: 200,
            message: "تم ارسال الرساله"
        });
    } catch (err) {
        next(err);
    }
};
// جلب كل الرسائل بين شخصين
const getChat = async (req, res, next) => {
    try {
        const { user1, user2 } = req.params;
        const roomId = user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;

        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
        res.status(200).send({
            status: true,
            code: 200,
            data: messages
        });
    } catch (err) {
        next(err);
    }
};
const getAllChatsWithSenderInfo = async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log(userId)

        const chats = await Message.aggregate([
            // 1️⃣ جلب الرسائل التي فيها المستخدم
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(userId) },
                        { receiver: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            // 2️⃣ ترتيب الرسائل من الأحدث للأقدم
            { $sort: { createdAt: -1 } },
            // 3️⃣ تجميع حسب roomId
            {
                $group: {
                    _id: "$roomId",
                    lastMessage: { $first: "$$ROOT" },
                    senders: { $addToSet: "$sender" },
                    receivers: { $addToSet: "$receiver" }
                }
            },
            // 4️⃣ مشروع النتيجة النهائية
            {
                $project: {
                    roomId: "$_id",
                    lastMessage: 1,
                    participants: { $setUnion: ["$senders", "$receivers"] }, // array واحد بدون array داخلي
                    _id: 0
                }
            },
            // 5️⃣ ترتيب المحادثات حسب آخر رسالة
            { $sort: { "lastMessage.createdAt": -1 } }
        ]);

        console.log(chats)
        // 6️⃣ عمل populate لبيانات المرسل (اسم + صورة)
        const populatedChats = await User.populate(chats, {
            path: "lastMessage.sender",
            select: "username image"
        });
        res.status(200).send({
            status: true,
            code: 200,
            data: populatedChats
        });

    } catch (err) {
        next(err)
    }
};
module.exports = {
    getChat,
    sendMessage,
    getAllChatsWithSenderInfo
}