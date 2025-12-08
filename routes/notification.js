const express=require("express");
const router=express.Router();
const {getNotifications}=require("../controllers/notification");
router.get("/",getNotifications)
module.exports=router;