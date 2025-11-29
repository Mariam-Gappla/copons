const Joi = require('joi');

const orderSchema = Joi.object({
  images: Joi.array().items(Joi.string().uri().messages({
    'string.uri': 'كل صورة يجب أن تكون رابطًا صالحًا'
  })).min(1).required().messages({
    'array.base': 'يجب أن تكون الصور في شكل قائمة (array)',
    'array.min': 'يجب رفع صورة واحدة على الأقل',
    'any.required': 'الصور مطلوبة'
  }),
  video: Joi.string().uri().messages({
    'string.uri': 'الفيديو يجب أن تكون رابطًا صالحًا'
  }),
  mainCategory: Joi.string().required().messages({
    'string.base': 'القسم الرئيسي يجب أن يكون نصًا',
    'any.required': 'القسم الرئيسي مطلوب'
  }),

  subCategory: Joi.string().required().messages({
    'string.base': 'القسم الفرعي يجب أن يكون نصًا',
    'any.required': 'القسم الفرعي مطلوب'
  }),

  location: Joi.string().required().messages({
    'string.base': 'الموقع يجب أن يكون نصًا',
    'any.required': 'الموقع مطلوب',
  }),

  title: Joi.string().required().messages({
    'string.base': 'العنوان يجب أن يكون نصًا',
    'any.required': 'العنوان مطلوب'
  }),

  description: Joi.string().required().messages({
    'string.base': 'الوصف يجب أن يكون نصًا',
    'any.required': 'الوصف مطلوب'
  }),
  contactType: Joi.string()
  .valid("واتساب", "اتصال", "محادثة داخل التطبيق")
  .required()
  .messages({
    "string.base": "نوع وسيلة التواصل يجب أن يكون نصًا.",
    "any.only": "نوع وسيلة التواصل غير صالح. القيم المسموح بها هي: واتساب، اتصال، محادثة داخل التطبيق.",
    "any.required": "نوع وسيلة التواصل مطلوب.",
  }),

contactValue: Joi.string()
  .when("contactType", {
    is: Joi.valid("واتساب", "اتصال"),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  })
  .messages({
    "string.base": "قيمة وسيلة التواصل يجب أن تكون نصًا.",
    "any.required": "قيمة وسيلة التواصل مطلوبة عند اختيار واتساب أو اتصال.",
    "any.unknown": "لا يُسمح بوجود هذا الحقل عندما تكون وسيلة التواصل محادثة داخل التطبيق.",
  }),


});
module.exports = orderSchema;