const commentSchema = require("../validition/comment");
const Comment = require("../models/comment");
const mongoose = require("mongoose");
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
        await Comment.create({
            userId: userId,
            targetId: orderId,
            text: text,
            targetType: "Order"
        });
        res.status(200).send({
            status: true,
            code: 200,
            message: "تم اضافه التعليق بنجاح"
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
const addCommentForReel = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { reelId, text } = req.body;
        const { error } = commentSchema.validate({
            userId: userId,
            targetId: reelId,
            text: text,
        });
        if (error) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: error.details[0].message
            });
        }
        await Comment.create({
            userId: userId,
            targetId: reelId,
            text: text,
            targetType: "Reels"
        });
        res.status(200).send({
            status: true,
            code: 200,
            message: "تم اضافه التعليق بنجاح",
        })
    }
    catch (error) {
        next(error)
    }
}
const getCommentsOnReel = async (req, res, next) => {
    try {
        const reelId = req.params.id;
        const comments = await Comment.find({ targetId: reelId, targetType: "Reels" })
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
const getCommentsWithReplies = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { type } = req.body;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Aggregation
        const comments = await Comment.aggregate([
            { $match: { targetId: new mongoose.Types.ObjectId(id), targetType: type } },
            { $sort: { createdAt: -1 } },
            // Pagination
            { $skip: skip },
            { $limit: limit },

            // جلب بيانات صاحب التعليق
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            { $unwind: "$userData" }, {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    pipeline: [
                        { $project: { username: 1, image: 1 } }
                    ],
                    as: "userData"
                }
            },
            { $unwind: "$userData" },

            // جلب الردود
            {
                $lookup: {
                    from: "replycomments",
                    localField: "_id",
                    foreignField: "commentId",
                    as: "replies"
                }
            },
            { $unwind: { path: "$replies", preserveNullAndEmptyArrays: true } },

            // جلب بيانات مستخدم الرد
            {
                $lookup: {
                    from: "users",
                    localField: "replies.userId",
                    foreignField: "_id",
                    as: "replies.userData"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    text: { $first: "$text" },
                    createdAt: { $first: "$createdAt" },
                    userData: { $first: "$userData" },
                    replies: {
                        $push: {
                            _id: "$replies._id",
                            text: "$replies.text",
                            createdAt: "$replies.createdAt",
                            userData: { $arrayElemAt: ["$replies.userData", 0] }
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        // حساب total count
        const total = await Comment.countDocuments({ targetId: id, targetType: type });

        res.status(200).json({
            status: true,
            code: 200,
            data: comments,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addCommentForOrder,
    getCommentsOnOrder,
    getCommentsOnPost,
    addCommentForPost,
    addCommentForReel,
    getCommentsOnReel,
    getCommentsWithReplies
}