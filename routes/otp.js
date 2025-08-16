const express= require("express");
const router = express.Router();
const {makeOtp, verifyOtp} = require("../controllers/otp");
router.post("/send-otp", makeOtp);
router.post("/verify-otp", verifyOtp);
module.exports = router;