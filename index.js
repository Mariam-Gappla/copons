const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const connectDB = require("./configration/dbConfig");
const otpRoutes = require("./routes/otp");
const jwt = require("jsonwebtoken");
const authenticationRoutes = require("./routes/authentication");
const categoryRoutes = require("./routes/category");
const coponsRoutes = require("./routes/copons");
const postRoutes = require("./routes/post");
const orderRoutes = require("./routes/order");
const favoriteRoutes = require("./routes/favorite");
const commentRoutes = require("./routes/comment");
const replyComment = require("./routes/replyComment");
const mainCategoryRoutes=require("./routes/MainCategory");
const userRoutes=require("./routes/user");
const reelsRoutes = require("./routes/reels.js");
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/images", express.static("./images"))
const authenticateToken = (req, res, next) => {
    if (req.originalUrl.includes('login') || 
    req.originalUrl.includes('verify-otp') || 
    req.originalUrl.includes('send-otp') || 
    req.originalUrl.includes('images') || 
    req.originalUrl.includes('requestResetPassword') || 
    req.originalUrl.includes('resetPassword')) {
        console.log('Public route, skipping token check.');
        next();
    }
    else {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'No token provided' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(403).send({ message: 'Invalid token' });
        }
    }
};
app.use(authenticateToken);
app.use("/otp", otpRoutes);
app.use("/auth", authenticationRoutes);
app.use("/copons", coponsRoutes);
app.use("/category", categoryRoutes);
app.use("/post", postRoutes);
app.use("/order", orderRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/comment", commentRoutes);
app.use("/reply", replyComment);
app.use("/user",userRoutes);
app.use("/mainCategories", mainCategoryRoutes);
app.use("/reels", reelsRoutes);
app.use((err, req, res, next) => {
    res.status(400).send({
        status: false,
        code: 400,
        message: err.message || 'Something went wrong',
    })
})
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
})