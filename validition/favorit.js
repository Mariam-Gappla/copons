const Joi = require('joi');

const favoriteSchema = Joi.object({
  itemId: Joi.string()
    .required()
    .messages({
      'string.base': 'معرّف العنصر يجب أن يكون نصًا',
      'string.empty': 'معرّف العنصر مطلوب',
      'any.required': 'معرّف العنصر مطلوب'
    }),

  itemType: Joi.string()
    .valid('Post', 'Order')
    .required()
    .messages({
      'string.base': 'نوع العنصر يجب أن يكون نصًا',
      'any.only': 'نوع العنصر يجب أن يكون إما "Post" أو "Order"',
      'string.empty': 'نوع العنصر مطلوب',
      'any.required': 'نوع العنصر مطلوب'
    })
});

module.exports = favoriteSchema;
