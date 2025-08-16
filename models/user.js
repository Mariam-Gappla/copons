const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    unique: true
  },
  image:{
    type:String,
  },
  password: {
    type: String,
    minlength: 6
  },
  status:{
    type:String,
    enum:['trusted','untrusted'],
    default:"untrusted"
  },
  resetOtp: {
    type: Number
  },
  resetOtpExpires: {
    type: Date
  },
});

const user = mongoose.model('User', userSchema);
module.exports= user;
