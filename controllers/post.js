const postSchema = require('../validition/post');
const saveImage = require("../configration/saveImage");
const Post = require("../models/post");
const User = require("../models/user");
const Counter = require("../models/counter");
const Reel=require("../models/reels");
const addPost = async (req, res, next) => {
  try {
    const files = req.files.images || [];
    const userId = req.user.userId;
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    const imageFiles = files.filter(file => file.mimetype.startsWith('image/'));
    const videoFiles = files.filter(file => file.mimetype.startsWith('video/'));
    const lat = parseFloat(req.body['location.lat']);
    const long = parseFloat(req.body['location.long']);
    const location = { lat, long };
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
    delete req.body['location.lat'];
    delete req.body['location.long'];
    const { error } = postSchema.validate({
      ...req.body,
      location,
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
    const count = await Counter.findOneAndUpdate(
      { name: "post" },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true }
    );
    // احفظ في قاعدة البيانات
    const post=await Post.create({
      ...req.body,
      location,
      userId,
      postNumber: count.seq,
      images: imagesPath,
      video: videoPath[0]
    });
    await Reel.create({
      title:req.body.title,
      images: imagesPath,
      video: videoPath[0],
      refType: "Post",
      refId: post._id,
    })
    res.status(200).send({
      code: 200,
      status: true,
      message: 'تم اضافه اعلانك بنجاح'
    });
  } catch (error) {
    next(error);
  }
};
const allPosts = async (req, res, next) => {
  try {
    const category = req.query.category;
    let posts = []
    if (!category) {
      posts = await Post.find()
    }
    else {
      posts = await Post.find({ subCategory: category });
    }

    res.status(200).send({
      status: true,
      code: 200,
      posts: posts
    })
  }
  catch (error) {
    next(error)
  }
}
const getStatisticsForPosts = async (req, res, next) => {
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

    // السنة من query أو السنة الحالية
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // أسماء الشهور بالعربي
    const monthNamesAr = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    // Aggregation
    const stats = await Post.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    // تجهيز النتيجة كاملة 12 شهر
    const months = Array.from({ length: 12 }, (_, i) => ({
      monthNumber: i + 1,
      monthName: monthNamesAr[i],
      count: 0
    }));

    stats.forEach(s => {
      months[s._id.month - 1].count = s.count;
    });

    return res.status(200).send({
      code: 200,
      status: true,
      data: months
    });

  } catch (error) {
    next(error)
  }
};
const getAllPostAndUsers = async (req, res, next) => {
  try {
    const email = req.user.email;
    const existAdmin = await User.findOne({ email });
    if (!existAdmin) {
      return res.status(403).send({
        code: 403,
        status: false,
        message: "غير مسموح لك"
      });
    }

    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // إجمالي عدد الإعلانات
    const totalPosts = await Post.countDocuments();

    // جلب البيانات مع populate فقط للحاجات المطلوبة
    const posts = await Post.find({})
      .populate("userId", "username") // بس الـ username
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // أحدث الأول

    // تنسيق البيانات
    const formatedPosts = posts.map((post) => {
      const obj = post.toObject();
      return {
        username: obj.userId?.username || "غير معروف",
        images: obj.images,
        postNumber: obj.postNumber,
        createdAt: obj.createdAt
      };
    });

    // رد النتيجة
    return res.status(200).send({
      status: true,
      code: 200,
      data: {
        posts: formatedPosts,
        pagination: {
          page: page,
          totalPages: Math.ceil(totalPosts / limit),
        }
      }
    });

  } catch (error) {
    next(error);
  }
};
const getPostById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findOne({ _id: id });
    return res.status(200).send({
      status: true,
      code: 200,
      data: {
        ...post
      }
    })

  }
  catch (error) {
    next(error)
  }
}
const getPostsAndUsers = async (req, res, next) => {
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
    const todayPostsCount = await Post.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    // عدد طلبات امبارح
    const yesterdayPostsCount = await Post.countDocuments({
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
    const postsGrowth = yesterdayPostsCount
      ? ((todayPostsCount - yesterdayPostsCount) / yesterdayPostsCount * 100).toFixed(2)
      : "100";

    const usersGrowth = yesterdayUsersCount
      ? ((todayUsersCount - yesterdayUsersCount) / yesterdayUsersCount * 100).toFixed(2)
      : "100";

    return res.status(200).send({
      code:200,
      status:true,
      message: "تم استرجاع الإحصائيات بنجاح",
      data: {
        todayPosts: todayPostsCount,
        yesterdayPosts: yesterdayPostsCount,
        todayUsers: todayUsersCount,
        yesterdayUsers: yesterdayUsersCount,
        postsGrowth: `${postsGrowth}%`,
        usersGrowth: `${usersGrowth}%`
      }
    });

  } catch (err) {
    next(err)
  }

}
const getPostsStatistics = async (req, res, next) => {
  try {
    // 🛠 جلب عدد الطلبات في كل قسم باستخدام aggregation
    const stats = await Post.aggregate([
      {
        $group: {
          _id: "$mainCategory", // 👈 غيرها حسب اسم الفيلد اللي بيمثل القسم
          count: { $sum: 1 }
        }
      }
    ]);

    // 🔢 إجمالي الطلبات
    const totalPosts = stats.reduce((sum, item) => sum + item.count, 0);

    // 📊 حساب النسب المئوية
    const statsWithPercentage = stats.map(item => ({
      category: item._id,
      count: item.count,
      percentage: totalPosts > 0 ? ((item.count / totalPosts) * 100).toFixed(2) : 0
    }));

    return res.status(200).send({
      status: true,
      code: 200,
      data: {
        posts: statsWithPercentage
      }
    });

  } catch (err) {
    next(err);
  }
};



module.exports = {
  addPost,
  allPosts,
  getStatisticsForPosts,
  getAllPostAndUsers,
  getPostById,
  getPostsAndUsers,
  getPostsStatistics
}