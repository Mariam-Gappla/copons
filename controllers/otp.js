const getMessages = require("../configration/getMessages");
const Otp = require("../models/otp");
const jwt = require("jsonwebtoken");
const makeOtp = async (req, res, next) => {
    try {
        const lang = req.headers['accept-language'] || 'en';
        const messages = getMessages(lang);
        console.log(req.body);
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).send({ error: messages.phone });
        }
        const otp = 1111;
        const otpData = {
            phone: phone,
            otp: otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        }
        await Otp.create(otpData);
        return res.status(200).send({
            code: 200,
            status: true,
            message: messages.otp_sent
        });
    }
    catch (err) {
        next(err);
    }

}
const verifyOtp = async (req, res, next) => {
    const lang = req.headers['accept-language'] || 'en';
    const messages = getMessages(lang);
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).send({
                code: 400,
                status: false,
                message: messages.otp_invalid
            });
        }
        const otpData = await Otp.findOne({ phone: phone, otp: otp });
        if (!otpData) {
            return res.status(400).send({
                code: 400,
                status: false,
                message: messages.otp_invalid

            });
        }
        const token = jwt.sign({ phone: phone }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(process.env.JWT_SECRET);
        return res.status(200).send({ 
            code: 200,
            status: true,
            message: messages.otp_verified,
            token: token
        });
    } catch (err) {
        next(err);
    }
}
module.exports = {
    makeOtp,
    verifyOtp
}