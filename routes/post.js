const express=require("express");
const router=express.Router();
const upload=require("../configration/uploadFile");
const {addPost,allPosts,getStatisticsForPosts,getPostById,getAllPostAndUsers,getPostsAndUsers,getPostsStatistics}=require("../controllers/post");
router.post("/addPost",upload.fields([
     { name: "images", maxCount: 4 }
]),addPost);
router.get("/allPosts",allPosts);
router.get("/dashboard/AllpostsAndUsers",getAllPostAndUsers)
router.get("/dashboard/statistics",getStatisticsForPosts);
router.get("/:id",getPostById);
router.get("/dashboard/postsAndUsers",getPostsAndUsers);
router.get("/dashboard/potsStatistics",getPostsStatistics)







module.exports=router;