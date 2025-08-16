const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",              
    required: true
  },
  image: {
    type: String, 
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  discountType: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default:true
  }
});

module.exports = mongoose.model("Coupon", couponSchema);
