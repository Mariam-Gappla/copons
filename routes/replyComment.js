const express=require("express");
const router=express.Router();
const { addReplyToOrder,addReplyToPost,getReplyByCommentId,addReplyToReel}=require("../controllers/replycomment");
router.get("/:commentId",getReplyByCommentId)
router.post("/post/add",addReplyToPost);
router.post("/order/add",addReplyToOrder);
router.post("/reel/add",addReplyToReel)










module.exports=router;