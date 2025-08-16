const Post = require('../models/post');
const Order = require('../models/order');
const Favorite = require('../models/favorite');
const favoriteSchema = require('../validition/favorit');
const toggleFavorite = async (req, res, next) => {
  try {
    const { itemId, itemType } = req.body;
    const userId = req.user.userId;
    console.log(req.body)
    const { error } = favoriteSchema.validate({ itemId, itemType });
    if (error) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: error.details[0].message
      });
    }
    let itemExists;
    if (itemType == 'Post') {
      itemExists = await Post.findOne({ _id: itemId });
    } else if (itemType == 'Order') {
      itemExists = await Order.findOne({ _id: itemId });
    }
    console.log(itemExists)

    if (!itemExists) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'العنصر غير موجود'
      });
    }
    const existing = await Favorite.findOne({ userId, itemId, itemType });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });

      return res.status(200).send({
        status: true,
        code: 200,
        message: 'تم الحذف من المفضلة'
      });
    } else {
      await Favorite.create({ userId, itemId, itemType });

      return res.status(201).send({
        status: true,
        code: 200,
        message: 'تمت الإضافة إلى المفضلة'
      });
    }

  } catch (err) {
    next(err);
  }
};
const getFavoriteByUserId = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const favorites = await Favorite.find({ userId: userId }).populate("itemId").skip(skip).limit(limit);
    const totalFavorite = await Favorite.countDocuments();
    const favoriteFormat = favorites.map((fav) => {
      const item = fav.itemId;
      return item;
    })
    res.status(200).send({
      status: true,
      code: 200,
      data: {
        favorite: favoriteFormat,
        pagination: {
          page: page,
          totalPages: Math.ceil(totalFavorite / limit),
        }
      }
    })

  }
  catch (error) {
    next(error)
  }
}
module.exports = {
  toggleFavorite,
  getFavoriteByUserId,
  getFavoriteByUserId
}
