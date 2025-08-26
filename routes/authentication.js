const express =require("express");
const router =express.Router();
const upload= require("../configration/uploadFile");
const { register, login,loginAdmin}= require("../controllers/authentication");
router.post("/register",upload.single("image") ,register);
router.post("/login", login);
router.post("/dashboard/login",loginAdmin)
module.exports = router;
