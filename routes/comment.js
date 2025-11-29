const express=require("express");
const router=express.Router();
const { addCommentForOrder,getCommentsOnOrder,getCommentsOnPost,addCommentForPost, getCommentsOnReel,
     addCommentForReel, getCommentsWithReplies }=require("../controllers/comment");
router.post("/order/add",addCommentForOrder);
router.post("/post/add", addCommentForPost);
router.get("/order/:id", getCommentsOnOrder);
router.get("/post/:id", getCommentsOnPost);
router.post("/reel/add", addCommentForReel);
router.get("/reel/:id", getCommentsOnReel);
router.get("/getCommentsWithReplies/:id", getCommentsWithReplies)








module.exports=router