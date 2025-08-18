const commentSchema = require("../validition/comment");
const Comment = require("../models/comment");
const addCommentForOrder = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { orderId, text } = req.body;
        const { error } = commentSchema.validate({
            userId: userId,
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
        const comment = await Comment.create({
            userId: userId,
            targetId: orderId,
            text: text,
            targetType: "Order"
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
            message: "تم اضافه التعليق بنجاح",
            data: formatData
        })
    }
    catch (error) {
        next(error)
    }
}
const addCommentForPost = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { postId, text } = req.body;
        const { error } = commentSchema.validate({
            userId: userId,
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
        const comment = await Comment.create({
            userId: userId,
            targetId: postId,
            text: text,
            targetType: "Post"
        });
        const data = await comment.populate("userId")
        const formatData =
        {
            _id: data._id,
            text: data.text,
            userData: {
                userId: data.userId._id,
                username: data.userId.username,
                image: data.userId.image
            }
        }
        res.status(200).send({
            status: true,
            code: 200,
            message: "تم اضافه التعليق بنجاح",
            data: formatData
        })
    }
    catch (error) {
        next(error)
    }
}

const getCommentsOnOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const comments = await Comment.find({ targetId: orderId, targetType: "Order" })
            .populate("userId", "username image")
            .sort({ createdAt: -1 });

        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            text: comment.text,
            userData: {
                userId: comment.userId._id,
                username: comment.userId.username,
                phone: comment.userId.phone
            },
            createdAt: comment.createdAt
        }));

        res.status(200).send({
            status: true,
            code: 200,
            message: "تم جلب التعليقات بنجاح",
            data: formattedComments
        });
    }
    catch (error) {
        next(error);
    }
}
const getCommentsOnPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ targetId: postId, targetType: "Post" })
            .populate("userId", "username image")
            .sort({ createdAt: -1 });

        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            text: comment.text,
            userData: {
                userId: comment.userId._id,
                username: comment.userId.username,
                phone: comment.userId.phone
            },
            createdAt: comment.createdAt
        }));

        res.status(200).send({
            status: true,
            code: 200,
            message: "تم جلب التعليقات بنجاح",
            data: formattedComments
        });
    }
    catch (error) {
        next(error);
    }
}
module.exports = {
    addCommentForOrder,
    getCommentsOnOrder,
    getCommentsOnPost,
    addCommentForPost 
}