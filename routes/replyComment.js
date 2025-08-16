const express=require("express");
const router=express.Router();
const {addReply}=require("../controllers/replycomment");
router.post("/add",addReply)










module.exports=router;