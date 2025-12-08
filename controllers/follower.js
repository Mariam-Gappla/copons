const Follow = require("../models/follower");
const User = require("../models/user");
const toggleFollow = async (req, res,next) => {
    try {
        const followerId = req.user.userId; 
        console.log(followerId)
        const followingId = req.params.userId; // اللي بتفولو

        if (followerId.toString() === followingId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        // check if already follow
        const existingFollow = await Follow.findOne({
            follower: followerId,
            following: followingId
        });

        // ------------------------------  
        // ✔ لو موجود → نحذف (UNFOLLOW)
        // ------------------------------
        if (existingFollow) {
            await Follow.findByIdAndDelete(existingFollow._id);

            return res.status(200).json({
                success: true,
                message: "Unfollowed successfully",
                isFollowed: false
            });
        }

        // ------------------------------  
        // ✔ لو مش موجود → نعمل (FOLLOW)
        // ------------------------------
        const newFollow = await Follow.create({
            follower: followerId,
            following: followingId
        });

        return res.status(201).json({
            success: true,
            message: "Followed successfully",
            isFollowed: true,
            follow: newFollow
        });

    } catch (err) {
        next(err)
    }
};
const getFollowing = async (req, res,next) => {
    try {
        const userId = req.params.userId;

        const following = await Follow.find({ follower: userId })
            .populate("following", "username image");

        res.status(200).json({
            success: true,
            code:200,
            data:following
        });

    } catch (err) {
       next(err)
    }
};
module.exports={
    toggleFollow,
    getFollowing
}
