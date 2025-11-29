const Reels = require("../models/reels");
const getReels = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const reels = await Reels.aggregate([
            { $skip: skip },
            { $limit: limit },

            // --------- 1️⃣ عدّ الكومنتات ---------
            {
                $lookup: {
                    from: "comments",
                    let: { reelId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$targetId", "$$reelId"] },
                                        { $eq: ["$targetType", "Reels"] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1 } }
                    ],
                    as: "reelComments"
                }
            },

            // --------- 2️⃣ عدّ الريبلات ---------
            {
                $lookup: {
                    from: "replycomments",
                    let: { commentIds: "$reelComments._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$commentId", "$$commentIds"]
                                }
                            }
                        },
                        { $project: { _id: 1 } }
                    ],
                    as: "replies"
                }
            },

            // --------- 3️⃣ حساب العدود ----------  
            {
                $addFields: {
                    commentsCount: { $size: "$reelComments" },
                    repliesCount: { $size: "$replies" },
                    totalComments: { $add: [{ $size: "$reelComments" }, { $size: "$replies" }] },  // ← المهم
                    likesCount: { $size: "$likes" },
                    viewsCount: { $size: "$views" }
                }
            },

            // --------- 4️⃣ تنظيف البيانات ----------
            {
                $project: {
                    reelComments: 0,
                    replies: 0,
                    likes: 0,
                    views: 0,
                    commentsCount: 0,
                    repliesCount: 0
                }
            }
        ]);

        const total = await Reels.countDocuments();

        return res.status(200).send({
            status: true,
            code: 200,
            data: {
                reels,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                },
            },
        });

    } catch (error) {
        next(error);
    }
};

const toggleLike = async (req, res,next) => {
    try {
        const { reelId } = req.params;
        const userId = req.user.userId; 
        console.log(userId)

        const reel = await Reels.findById(reelId);
        if (!reel) return res.status(404).json({
             status: false, 
             code:404,
             message: "الريلز مش موجود" 
            });

        // لو موجود already → إزالة like
        if (reel.likes.includes(userId)) {
            reel.likes.pull(userId);
            await reel.save();
            return res.status(200).json({ 
                code:200,
                status: true, 
                message: "تم حذف الاعجاب",
            });
        }

        // لو مش موجود → إضافة like
        reel.likes.push(userId);
        await reel.save();
        return res.status(200).json({ 
            status: true, 
            code:200,
            message: "تم اضافه الاعجاب بنجاح"
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getReels,
    toggleLike
}