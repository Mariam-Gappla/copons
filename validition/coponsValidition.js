const Joi = require("joi");
const getMessages = require("../locals/schemaValiditionMessages/coponsValiditionMessages");

const couponSchema = (lang = "en") => {
    const messages = getMessages(lang);
    return Joi.object({
        image: Joi.string().required(),
        code: Joi.string().required().messages({
            "string.empty": messages.codeRequired,
            "any.required": messages.codeRequired
        }),
        discountValue: Joi.number().required().messages({
            "number.base": messages.discountValueRequired,
            "any.required": messages.discountValueRequired
        }),
        discountType: Joi.string().required().messages({
            "any.only": messages.invalidDiscountType,
            "any.required": messages.discountTypeRequired
        }),
        startDate: Joi.date().iso().required().messages({
            "date.base": messages.invalidDate,   // تنسيق مش صحيح
            "date.format": messages.invalidDate, // لو حاول يحط حاجة غريبة
            "any.required": messages.startDateRequired
        }),

        endDate: Joi.date().iso().greater(Joi.ref("startDate")).required().messages({
            "date.base": messages.invalidDate,
            "date.format": messages.invalidDate,
            "date.greater": messages.invalidDateRange,
            "any.required": messages.endDateRequired
        })
    });
}
module.exports = couponSchema;
