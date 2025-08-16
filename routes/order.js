const express=require("express");
const router=express.Router();
const {addOrder,getOrderById,getAllOrders,allVideosAndImages,getTodayStats,getOrdersAndPosts,getOrderDatesandUsers,getOrderStatistics}=require("../controllers/order");
const upload=require("../configration/uploadFile");
router.post("/addOrder",upload.fields([
     { name: "images", maxCount: 4 }
]),addOrder);
router.get("/getOrder/:id",getOrderById);
router.get("/allOrders",getAllOrders);
router.get("/reels",allVideosAndImages);
router.get("/stats",getTodayStats);
router.get("/ordersAndPosts",getOrdersAndPosts);
router.get("/orderDatesAndUsers",getOrderDatesandUsers)
router.get("/orderStatistics",getOrderStatistics)





module.exports=router;