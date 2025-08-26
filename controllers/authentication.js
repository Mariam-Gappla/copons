const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validition/authentication");
const getMessages = require("../configration/getMessages");
const saveImage=require("../configration/saveImage");
const mongoose = require("mongoose");
const register = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    const { error } = registerSchema(lang).validate(req.body);

    const messages = getMessages(lang);
    if (error) {
      return res.status(400).send({
        status: true,
        code: 400,
        message: error.details[0].message
      });
    }
    const phone = req.user.phone;
    console.log(phone);
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ phone: phone });
    if (existingUser) {
      return res.status(400).send({
        status: true,
        code: 400,
        message: messages.register.exists
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let imagePath="";
     if(req.file)
     {
       imagePath= saveImage(req.file,"images");
     }
   
    const newUser = await User.create({
      username,
      email,
      phone,
      image:BASE_URL + imagePath,
      password: hashedPassword
    });
    res.status(200).send({
      status: true,
      code: 200,
      message: messages.register.success,
      user: newUser
    });
  }
  catch (err) {
    next(err);
  }
}
const login = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const { error } = loginSchema(lang).validate(req.body);
    const { identifier, password } = req.body;
    const messages = getMessages(lang);
    
    if (error) {
      return res.status(400).send({
        status: false,
        code: 400,
        message: error.details[0].message
      });
    }

    let user;
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ phone: identifier });
    }
    console.log(messages.login.error);
    if (!user) {
      return res.status(400).send({
        status: false,
        code: 400,
        message: messages.login.error
      });
    }

console.log(messages.login.invalid)
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send({
        status: false,
        code: 400,
        message: messages.login.invalid
      });

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      status: true,
      code: 200,
      message: messages.login.success,
       data:{
        user:user,
        token
      }
    });
  }
  catch (err) {
    next(err);
  }
};
const loginAdmin=async (req,res,next)=>{
  try {
    const lang = req.headers["accept-language"] || "en";
    const { error } = loginSchema(lang).validate(req.body);
    const { email, password } = req.body;
    const messages = getMessages(lang);
    if (error) {
      return res.status(400).send({
        status: true,
        code: 400,
        message: error.details[0].message
      });
    }
    const  user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({
        status: true,
        code: 400,
        message: messages.login.error
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send({
        status: true,
        code: 400,
        message: messages.login.invalid
      });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      status: true,
      code: 200,
      message: messages.login.success,
      data:{
        admin:user,
        token
      }
      
    });
  }
  catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  loginAdmin
}
