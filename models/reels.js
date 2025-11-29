const mongoose = require('mongoose');
const reelSchema = new mongoose.Schema({
    title: { type: String, required: true },
    refType: { type: String, enum: ["Post", "Order"], required: true }, // نوع المرجع
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        path: 'refType'
    },
    video: {
        type: String,
    },
    images: {
        type: [String],
        required: true
    },
    views: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],

    commentsCount: { type: Number, default: 0 }, // عدد التعليقات
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Reels", reelSchema);