const copons = require("../models/copons")
const couponSchema = require("../validition/coponsValidition");
const saveImage = require("../configration/saveImage");
const User = require("../models/user");
const { message } = require("../validition/comment");
const updateCouponStatus = async () => {
  const today = new Date();
  await copons.updateMany({ endDate: { $lt: today }, isActive: true }, { $set: { isActive: false } });
  await copons.updateMany({ endDate: { $gte: today }, isActive: false }, { $set: { isActive: true } });
};
const addCopon = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        code: 400,
        status: false,
        message: "يجب رفع صورة للكوبون"
      });
    }

    const userId = req.user.userId;
    const lang = req.headers['accept-language'] || 'ar';
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    const { error } = couponSchema(lang).validate({
      image: req.file.originalname,
      ...req.body
    });

    if (error) {
      return res.status(400).send({
        code: 400,
        status: false,
        message: error.details[0].message
      });
    }

    // حفظ الصورة على السيرفر
    const imagePath = saveImage(req.file);

    // الرابط الكامل للمتصفح
    const imageURL = `${BASE_URL}/${imagePath}`;

    // حفظ الكوبون في الداتابيز
    const copon = await copons.create({
      userId,
      image: imageURL,
      code: req.body.code,
      discountValue: req.body.discountValue,
      discountType: req.body.discountType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    return res.status(200).send({
      status: true,
      code: 200,
      message: "تم اضافه الكوبون بنجاح",
      data: { copon }
    });

  } catch (error) {
    next(error);
  }
}

const getCopons = async (req, res, next) => {
  try {
    await updateCouponStatus();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const copon = await copons.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await copons.countDocuments();

    return res.status(200).send({
      status: true,
      code: 200,
      data: {
        copon,
        pagination: {
          page,
          totalPages: Math.ceil(total / limit)
        }
      },

    })

  } catch (error) {
    next(error);
  }
};
const getCoponByUserId = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const copon = await copons.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await copons.countDocuments();

    return res.status(200).json({
      status: true,
      code: 200,
      data: {
        copon,
        pagination: {
          page,
          totalPages: Math.ceil(total / limit)
        }
      }
      
    });

  } catch (error) {
    next(error);
  }
}
const getCoponById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const copon = await copons.findById(id);
    if (!copon) {
      return res.status(400).send({
        status: false,
        code: 400,
        message: "لا يوجد هذا الكوبون"
      })
    }
    res.status(200).send({
      code: 200,
      status: true,
      data: copon
    })

  }
  catch (error) {
    next(error)
  }
}
const deleteCopon=async (req,res,next)=>{
  try
  {
    const email = req.user.email;
    const existAdmin = await User.findOne({ email: email });

    if (!existAdmin) {
      return res.status(403).send({
        code: 403,
        status: false,
        message: "غير مسموح لك"
      });
    }
    const id=req.params.id;
    await copons.findOneAndDelete({_id:id});
    return res.status(200).send({
      code:200,
      status:true,
      message:"تم حذف الكوبون"
    })

  }
  catch(error)
  {
    next(error)
  }
}
module.exports = {
  addCopon,
  getCopons,
  getCoponByUserId,
  getCoponById,
  deleteCopon
}