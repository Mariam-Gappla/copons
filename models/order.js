const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  images: {
    type: [String],
    required: true
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
  contactType: {
    type: String,
    enum: ["محادثه داخل التطبيق","واتساب", "اتصال"],
    required: true
  },
  contactValue: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
