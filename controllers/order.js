const Order = require("../models/order");
const Post = require("../models/post");
const User = require("../models/user");
const orderSchema = require("../validition/order");
const saveImage = require("../configration/saveImage");
const Reel = require("../models/reels")
const addOrder = async (req, res, next) => {
    try {
        const files = req.files.images || [];
        console.log(files)
        const userId = req.user.userId;
        const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
        const imageFiles = files.filter(file => file.mimetype.startsWith('image/'));
        const videoFiles = files.filter(file => file.mimetype.startsWith('video/'));
        console.log(req.body)
        if (imageFiles.length > 4) {
            return res.status(400).send({
                code: 400,
                status: false,
                message: 'يجب رفع 3 صور بالضبط'
            });
        }

        if (videoFiles.length > 1) {
            return res.status(400).send({
                status: false,
                code: 400,
                message: 'يجب رفع فيديو واحد فقط'
            });
        }
        const imagesPath = imageFiles.map((file) => {
            return BASE_URL + `/${Date.now()}-${encodeURIComponent(file.originalname)}`;
        })
        const videoPath = videoFiles.map((file) => {
            return BASE_URL + `/${Date.now()}-${encodeURIComponent(file.originalname)}`;
        })
        console.log(imagesPath)
        const { error } = orderSchema.validate({
            ...req.body,
            images: imagesPath,
            video: videoPath[0]
        });

        if (error) {
            return res.status(400).send({
                status: false,
                code: 400,
                message: error.details[0].message
            });
        }
        const images = files.map((file) => {
            return saveImage(file, "images");
        })
        // احفظ في قاعدة البيانات
        const order = await Order.create({
            ...req.body,
            userId,
            images: imagesPath,
            video: videoPath[0]
        });

        await Reel.create({
            title: req.body.title,
            images: imagesPath,
            video: videoPath[0],
            refType: "Order",
            refId: order._id,
        })
        res.status(200).send({
            code: 200,
            status: true,
            message: 'تم اضافه طلبك بنجاح'
        });
    } catch (error) {
        next(error);
    }
};
const getOrderById = async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({
            status: false,
            code: 400,
            message: "رقم الطلب مطلوب"
        })
    }
    const order = await Order.findById({ _id: id });
    const subCatergory = order.subCategory;
    const semailerOrders = await Order.find({ subCategory: subCatergory });
    res.status(200).send({
        status: true,
        code: 200,
        data: {
            order,
            semailerOrders
        }
    })
}
const getAllOrders = async (req, res, next) => {
    try {
        const category = req.query.category;
        let orders = []
        if (!category) {
            orders = await Order.find()
        }
        else {
            orders = await Order.find({ subCategory: category });
        }

        res.status(200).send({
            status: true,
            code: 200,
            orders: orders
        })
    }
    catch (error) {
        next(error)
    }
}
const allVideosAndImages = async (req, res, next) => {
    try {
        const orderMedia = await Order.find();
        const postMedia = await Post.find();
        let reels = []
        const generalOrderMedia = orderMedia.map((med) => {
            const media = {
                title: med.title,
                images: med.images || [],
                video: med.video || ""
            }
            return media
        });
        console.log(generalOrderMedia)
        reels = generalOrderMedia;
        const generalPostMedia = postMedia.map((med) => {
            const media = {
                title: med.title,
                images: med.images || [],
                video: med.video || ""
            }
            reels.push(media);
            return media
        });

        res.status(200).send({
            code: 200,
            status: true,
            media: reels
        })

    }
    catch (error) {
        next(error)
    }
}
const getOrdersAndPosts = async (req, res, next) => {
    try {
        const email = req.user.email;
        const existAdmin = await User.findOne({ email: email });
        if (!existAdmin) {
            return res.status(403).send({
                code: 403,
                status: false,
                message: "غير مسموح لك"
            });
        }

        // 🗓 تحديد بداية ونهاية اليوم
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // 🔢 إجمالى الطلبات والإعلانات
        const totalOrders = await Order.countDocuments();
        const totalPosts = await Post.countDocuments();

        // 📅 طلبات النهاردة
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // 📅 إعلانات النهاردة
        const todayPosts = await Post.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // 📊 حساب النسب المئوية
        const ordersPercentage = totalOrders > 0 ? (todayOrders / totalOrders) * 100 : 0;
        const postsPercentage = totalPosts > 0 ? (todayPosts / totalPosts) * 100 : 0;

        return res.status(200).send({
            status: true,
            code: 200,
            data: {
                totalOrders,
                totalPosts,
                ordersPercentage: ordersPercentage.toFixed(2), // النسبة لطلب النهاردة
                postsPercentage: postsPercentage.toFixed(2)    // النسبة لإعلان النهاردة
            }
        });

    } catch (error) {
        next(error);
    }
};
const getTodayStats = async (req, res, next) => {
    try {
        // تاريخ النهارده من أول اليوم (00:00:00)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // تاريخ بكره (علشان نحدد نهاية النهارده)
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // تاريخ أمس
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        const endOfYesterday = new Date(endOfToday);
        endOfYesterday.setDate(endOfYesterday.getDate() - 1);

        // عدد طلبات النهارده
        const todayOrdersCount = await Order.countDocuments({
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        });

        // عدد طلبات امبارح
        const yesterdayOrdersCount = await Order.countDocuments({
            createdAt: { $gte: startOfYesterday, $lte: endOfYesterday }
        });

        // عدد المستخدمين الجدد النهارده
        const todayUsersCount = await User.countDocuments({
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        });

        // عدد المستخدمين الجدد امبارح
        const yesterdayUsersCount = await User.countDocuments({
            createdAt: { $gte: startOfYesterday, $lte: endOfYesterday }
        });

        // حساب النسبة المئوية للزيادة
        const ordersGrowth = yesterdayOrdersCount
            ? ((todayOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount * 100).toFixed(2)
            : "100";

        const usersGrowth = yesterdayUsersCount
            ? ((todayUsersCount - yesterdayUsersCount) / yesterdayUsersCount * 100).toFixed(2)
            : "100";

        return res.status(200).send({
           status:true,
           code:200,
           message:"تم استرجاع الطلب بنجاح",
           data:{
             todayOrders: todayOrdersCount,
            todayUsers: todayUsersCount,
            ordersGrowth: `${ordersGrowth}%`,
            usersGrowth: `${usersGrowth}%`
           }
        });

    } catch (err) {
        next(err)
    }
};
const getOrderDatesandUsers = async (req, res, next) => {
    try {
        // قراءة page و limit من الـ query مع قيم افتراضية
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // عدد كل الطلبات
        const totalOrders = await Order.countDocuments();

        // جلب البيانات مع pagination
        const orders = await Order.find({})
            .populate("userId", "username image")
            .sort({ createdAt: -1 }) // الأحدث أولاً
            .skip(skip)
            .limit(limit)
            .lean(); // عشان تبقى كائنات عادية وتقلل الحمل

        // تجهيز البيانات
        const formattedData = orders.map(order => ({
            username: order.userId?.username,
            image: order.userId?.image,
            date: order.createdAt
        }));

        return res.status(200).json({
            status: true,
            code: 200,
            data: {
                orders: formattedData,
                pagination: {
                    page,
                    totalPages: Math.ceil(totalOrders / limit)
                }
            }
        });

    } catch (err) {
        next(err);
    }
};
const getOrderStatistics = async (req, res, next) => {
    try {
        // 🛠 جلب عدد الطلبات في كل قسم باستخدام aggregation
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: "$mainCategory", // 👈 غيرها حسب اسم الفيلد اللي بيمثل القسم
                    count: { $sum: 1 }
                }
            }
        ]);

        // 🔢 إجمالي الطلبات
        const totalOrders = stats.reduce((sum, item) => sum + item.count, 0);

        // 📊 حساب النسب المئوية
        const statsWithPercentage = stats.map(item => ({
            category: item._id,
            count: item.count,
            percentage: totalOrders > 0 ? ((item.count / totalOrders) * 100).toFixed(2) : 0
        }));

        return res.status(200).send({
            status: true,
            code: 200,
            data: {
                categories: statsWithPercentage
            }
        });

    } catch (err) {
        next(err);
    }
};


module.exports = {
    addOrder,
    getOrderById,
    getAllOrders,
    allVideosAndImages,
    getOrdersAndPosts,
    getTodayStats,
    getOrderDatesandUsers,
    getOrderStatistics
}