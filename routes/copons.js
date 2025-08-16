const express=require("express");
const router=express.Router();
const {addCopon,getCopons,getCoponByUserId,getCoponById,deleteCopon}=require("../controllers/copons");
const upload=require("../configration/uploadFile")
router.post("/add",upload.single("image"),addCopon);
router.get("/userCopons",getCoponByUserId);
router.get("/:id",getCoponById)
router.delete("/:id",deleteCopon)
router.get("/",getCopons);


















module.exports=router;