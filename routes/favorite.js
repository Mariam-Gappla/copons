const express=require("express");
const router=express.Router();
const {toggleFavorite,getFavoriteByUserId}=require("../controllers/favorite")
router.post("/add",toggleFavorite);
router.get("/favorites",getFavoriteByUserId)








module.exports=router