const express =require("express");
const router =express.Router();
const { register, login,loginAdmin}= require("../controllers/authentication");
router.post("/register", register);
router.post("/login", login);
router.post("/dashboard/login",loginAdmin)
module.exports = router;
