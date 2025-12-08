const express=require("express");
const router=express.Router();
const {toggleFollow,getFollowing}=require("../controllers/follower");
router.post("/:userId",toggleFollow);
router.get("/:userId",getFollowing);
module.exports=router;