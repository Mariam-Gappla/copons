const replyCommentSchema = require("../validition/replyComment");
const replyComment = require("../models/replyComment");
const Order = require("../models/order");
const addReply = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { commentId, orderId, text } = req.body;
        const { error } = replyCommentSchema.validate({
            userId: userId,
            commentId: commentId,
            orderId: orderId,
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
        });
        const data = await comment.populate("userId")
        const formatData=
             {
                _id:data._id,
                text:data.text,
                userData:{
                    userId:data.userId._id,
                    username:data.userId.username,
                    phone:data.userId.phone
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
module.exports = {
    addReply
}