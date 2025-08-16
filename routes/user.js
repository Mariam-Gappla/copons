const express=require("express");
const router=express.Router();
const { updateUser,deleteUser,getUserById,changePassword,getUsers,requestResetPassword,resetPassword}=require("../controllers/user")
router.get("/",getUsers)
router.patch("/updateUser/:id",upload.single("image"),updateUser);
router.delete("/:id",deleteUser);
router.get("/:id",getUserById);
router.put("/change-passord",changePassword);
router.put("/requestResetPassword",requestResetPassword);
router.put("/resetPassword",resetPassword);
module.exports=router;