const express=require("express");
const router=express.Router();
const {addComment}=require("../controllers/comment");
router.post("/add",addComment)








module.exports=router