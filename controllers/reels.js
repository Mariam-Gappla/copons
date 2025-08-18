const Reels = require("../models/reels");
const getReels = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;   // الصفحة المطلوبة
        const limit = parseInt(req.query.limit) || 10; // عدد العناصر في الصفحة
        const skip = (page - 1) * limit;

        const reels = await Reels.find()
            .skip(skip)
            .limit(limit)
            .lean();

        const populatedReels = await Promise.all(
            reels.map(async (reel) => {
                if (reel.refType === "Post") {
                    reel.refData = await Post.findById(reel.refId).lean();
                } else if (reel.refType === "Order") {
                    reel.refData = await Order.findById(reel.refId).lean();
                }
                return reel;
            })
        );

        const total = await Reels.countDocuments();

        return res.status(200).send({
            status: true,
            code: 200,
            data: {
                reels: populatedReels,
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


module.exports = {
    getReels
}