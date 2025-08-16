const express=require("express");
const router=express.Router();
const {addCategory,updateCategory,deleteCategory,getCategories,getCategoriesInMainCategory}=require("../controllers/category");
router.get("/",getCategories);
router.post("/add/:id",addCategory);
router.patch("/update/:id",updateCategory);
router.delete("/delete/:id",deleteCategory)
router.get("/subCategories/:id",getCategoriesInMainCategory)










module.exports=router