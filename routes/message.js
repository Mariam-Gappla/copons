const express=require("express");
const router=express.Router();
const {getAllChatsWithSenderInfo,sendMessage,getChat}=require("../controllers/messages")
router.post("/", sendMessage);
router.get("/chats/:userId", getAllChatsWithSenderInfo);
router.get("/:user1/:user2",getChat);
module.exports=router;
