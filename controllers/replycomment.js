const replyCommentSchema = require("../validition/replyComment");
const replyComment = require("../models/replyComment");
const Order = require("../models/order");
const addReplyToOrder = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { commentId, orderId, text } = req.body;
        const { error } = replyCommentSchema.validate({
            userId: userId,
            commentId: commentId,
            targetId: orderId,
            text: text,
        });
        if (error) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: error.details[0].message
            });
        }
        const findUserWithOrder = await Order.findById(orderId);
        if (findUserWithOrder.userId != userId) {
            return res.status(400).send({
                status: false,
                code: 400,
                message: "غير مسموح لك بالرد على التعليق"
            })
        }
        const comment = await replyComment.create({
            userId: userId,
            commentId: commentId,
            text: text,
            targetId: orderId,
            targetType: "Order",
        });
        const data = await comment.populate("userId")
        const formatData =
        {
            _id: data._id,
            text: data.text,
            userData: {
                userId: data.userId._id,
                username: data.userId.username,
                phone: data.userId.phone
            }
        }
        res.status(200).send({
            status: true,
            code: 200,
            message: "تم الرد على التعليق بنجاح",
            data: formatData
        })
    }
    catch (error) {
        next(error)
    }
}
const addReplyToPost = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { commentId, postId, text } = req.body;
        const { error } = replyCommentSchema.validate({
            userId: userId,
            commentId: commentId,
            targetId: postId,
            text: text,
        });
        if (error) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: error.details[0].message
            });
        }
        const comment = await replyComment.create({
            userId: userId,
            commentId: commentId,
            targetId: postId,
            targetType: "Post",
            text: text,
        });
        const data = await comment.populate("userId")
        const formatData =
        {
            _id: data._id,
            text: data.text,
            userData: {
                userId: data.userId._id,
                username: data.userId.username,
                phone: data.userId.phone
            }
        }
        res.status(200).send({
            status: true,
            code: 200,
            message: "تم الرد على التعليق بنجاح",
            data: formatData
        })
    }
    catch (error) {
        next(error)
    }
}
const getReplyByCommentId = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const replies = await replyComment.find({ commentId: commentId }).populate("userId");
        if (replies.length === 0) {
            return res.status(404).send({
                status: false,
                code: 404,
                message: "لا توجد ردود على هذا التعليق"
            });
        }
        const formattedReplies = replies.map(reply => ({
            _id: reply._id,
            text: reply.text,
            userData: {
                userId: reply.userId._id,
                username: reply.userId.username,
                image: reply.userId.image
            }
        }));
        res.status(200).send({
            status: true,
            code: 200,
            message: "تم جلب الردود بنجاح",
            data: formattedReplies
        });
    }
    catch (error) {
        next(error);
    }
}
module.exports = {
    addReplyToOrder,
    addReplyToPost,
    getReplyByCommentId
}