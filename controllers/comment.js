const commentSchema=require("../validition/comment");
const Comment=require("../models/comment");
const addComment = async(req, res, next) => {
    try {
        const userId=req.user.userId;
        const {orderId,text}=req.body;
        const {error}=commentSchema.validate({
            userId:userId,
            orderId:orderId,
            text:text,
        });
        if (error) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: error.details[0].message
            });
        }
       const comment= await Comment.create({
             userId:userId,
            orderId:orderId,
            text:text,
        });
        const data= await comment.populate("userId")
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
            status:true,
            code:200,
            message:"تم اضافه التعليق بنجاح",
            data:formatData
        })
    }
    catch (error) {
        next(error)
    }
}
module.exports = {
    addComment
}