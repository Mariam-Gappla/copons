const express=require("express");
const router=express.Router();
const {getReels,toggleLike}=require("../controllers/reels");
router.get("/",getReels);
router.post("/like/:reelId",toggleLike);













module.exports=router;