const Joi = require("joi");

const replyCommentSchema = Joi.object({
  commentId: Joi.string().required().messages({
    "any.required": "رقم التعليق الأساسي مطلوب",
    "string.base": "رقم التعليق الأساسي يجب أن يكون نصًا"
  }),
  orderId: Joi.string().required().messages({
    "any.required": "رقم الطلب مطلوب",
    "string.base": "رقم الطلب يجب ان يكون نصا"
  }),
  userId: Joi.string().required().messages({
    "any.required": "رقم المستخدم مطلوب",
    "string.base": "رقم المستخدم يجب أن يكون نصًا"
  }),
  text: Joi.string().required().messages({
    "any.required": "نص الرد مطلوب",
    "string.empty": "لا يمكن ترك نص الرد فارغًا",
    "string.base": "نص الرد يجب أن يكون نصًا"
  })
});

module.exports = replyCommentSchema;
