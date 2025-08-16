const mongoose = require('mongoose');
const { type } = require('../validition/comment');
const postSchema = new mongoose.Schema({
  images: {
    type: [String],
    required: true
  },
  postNumber:{
    type:Number,
    require:true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mainCategory: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  video: {
    type: String,
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    long: {
      type: Number,
      required: true
    }
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  priceType: {
    type: String,
    enum: ['ثابت', 'قابل للتفاوض', 'أفضل سعر'],
    required: true
  },
  priceValue: {
    type: Number,
  },
  contactType: {
    type: String,
    enum: ["محادثه داخل التطبيق","واتساب", "اتصال"],
    required: true
  },
  contactValue: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
