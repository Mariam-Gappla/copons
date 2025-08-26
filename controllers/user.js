const User = require("../models/user");
const saveImage = require("../configration/saveImage");
const path=require("path");
const fs=require("fs");
const bcrypt = require("bcrypt");
const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        let updatedData = {};
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).send({
                status: false,
                code: 404,
                message: "هذا المستخدم غير موجود"
            });
        }

        if (req.file) {
            // 🟢 امسح الصورة القديمة لو فيه واحدة
            if (user.image) {
                const oldImagePath = path.join(__dirname, "..", user.image.replace(process.env.BASE_URL || 'http://localhost:3000', ""));
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("خطأ أثناء حذف الصورة القديمة:", err.message);
                    }
                });
            }

            // 🟢 احفظ الصورة الجديدة
            const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
            const url = saveImage(req.file, "images");
            updatedData.image = BASE_URL + url;
        }

        if (req.body.username) {
            updatedData.username = req.body.username;
        }
        if (req.body.email) {
            updatedData.email = req.body.email;
        }

        await User.findByIdAndUpdate(id, updatedData);

        return res.status(200).send({
            status: true,
            code: 200,
            message: "تم تحديث البيانات بنجاح"
        });

    } catch (err) {
        next(err);
    }
};
const deleteUser = async (req, res, next) => {
    try {
        const email = req.user.email;
        const existAdmin = await User.findOne({ email: email });
        if (!existAdmin) {
            return res.status(403).send({
                code: 403,
                status: false,
                message: "غير مسموح لك"
            })
        }
        const id = req.params.id;
        await User.findOneAndDelete({ _id: id });
        return res.status(200).send({
            status: true,
            code: 200,
            message: "تم حذف المستخدم"
        })

    }
    catch (err) {
        next(err)
    }
}
const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const existUser = await User.findOne({ _id: id });
        if (!existUser) {
            return res.status(404).send({
                status: false,
                code: 404,
                message: "هذا المستخدم غير موجود"
            })
        }
        return res.status(200).send({
            status: true,
            code: 200,
            message: "تم استرجاع الطلب بنجاح",
            date: existUser
        })

    }
    catch (err) {
        next(err)
    }
}
const changePassword = async (req, res, next) => {
    try {
        const id = req.user.userId;
        const existingUser = await User.findOne({ _id: id });
        if (!existingUser) {
            return res.status(404).send({
                status: false,
                code: 404,
                message: "هذا المستخدم غير موجود"
            });
        }
        const { oldPassword, newPassword } = req.body;
        const match = await bcrypt.compare(oldPassword, existingUser.password);
        if (!match) {
            return res.status(400).send({
                code: 400,
                status: false,
                message: "الباسورد القديمه غير صحيحه حاول مره اخرى"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();
        return res.status(200).send({
            code: 200,
            status: true,
            message: "تم تحديث الباسورد بنجاح"
        })

    }
    catch (err) {
        next(err)
    }
}
const getUsers = async (req, res, next) => {
    try {
        const email = req.user.email;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const existAdmin = await User.findOne({ email });
        if (!existAdmin) {
            return res.status(403).send({
                code: 403,
                status: false,
                message: "غير مسموح لك"
            });
        }
        const status = req.query.status;
        const totalUsers = await User.countDocuments({ status: status });
        let users;
        if (status == "untrusted") {
            users = await User.find({ status: "untrusted" }).skip(skip).limit(limit);
        }
        else if (status == "trusted") {
            users = await User.find({ status: "trusted" }).skip(skip).limit(limit);
        }
        else {
            return res.status(400).send({
                status: false,
                code: 400,
                message: "هذه الحاله غير موجوده"
            })
        }
        return res.status(200).send({
            status: true,
            code: 200,
            message: "تم معاجه الطلب بنجاح",
            data: {
                users: users,
                pagination: {
                    page: page,
                    totalPages: Math.ceil(totalUsers / limit),
                }
            }
        })

    }
    catch (err) {
        next(err)
    }
}
const requestResetPassword = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).send({
                code: 400,
                status: false,
                message: "هذا الرقم غير موجود"
            });
        }

        const otp = 1111 /*Math.floor(100000 + Math.random() * 900000)*/;
        user.resetOtp = otp;
        user.resetOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        res.send({
            code: 200,
            status: true,
            message: "تم ارسال الكود بنجاح"
        });
    } catch (err) {
        next(err);
    }
};
const resetPassword = async (req, res, next) => {
    try {
        const { phone, otp, newPassword } = req.body;
        const user = await User.findOne({ phone });

        if (
            !user ||
            user.resetOtp != otp || // تطابق الكود
            !user.resetOtpExpires ||
            user.resetOtpExpires < new Date() // تحقق من انتهاء صلاحية الكود
        ) {
            return res.status(400).send({
                status: false,
                message: "الكود غير صحيح أو انتهت صلاحيته"
            });
        }

        // تحديث الباسورد (مع افتراض وجود bcrypt في pre-save)
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.resetOtpExpires = undefined;

        await user.save();

        res.status(200).send({
            code: 200,
            status: true,
            message: "تم تحديث الباسورد بنجاح"
        });
    } catch (err) {
        next(err);
    }
};
module.exports = {
    updateUser,
    deleteUser,
    getUserById,
    changePassword,
    getUsers,
    requestResetPassword,
    resetPassword
}