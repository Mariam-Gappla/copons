const Joi = require("joi");

const commentSchema = Joi.object({
    targetId: Joi.string().required().messages({
      "any.required":"رقم الطلب او الاعلان مطلوب",
      "string.base": "رقم الطلب او الاعلان يجب أن يكون نصًا"
    }),
  userId: Joi.string().required().messages({
    "any.required": "رقم المستخدم مطلوب.",
    "string.base": "رقم المستخدم يجب أن يكون نصًا"
  }),
  text: Joi.string().required().messages({
    "any.required": "نص التعليق مطلوب",
    "string.empty": "لا يمكن ترك نص التعليق فارغًا",
    "string.base": "نص التعليق يجب أن يكون نصًا"
  })
});

module.exports = commentSchema;
