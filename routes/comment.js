const express=require("express");
const router=express.Router();
const { addCommentForOrder,getCommentsOnOrder,getCommentsOnPost,addCommentForPost }=require("../controllers/comment");
router.post("/order/add",addCommentForOrder);
router.post("/post/add", addCommentForPost);
router.get("/order/:id", getCommentsOnOrder);
router.get("/post/:id", getCommentsOnPost);








module.exports=router