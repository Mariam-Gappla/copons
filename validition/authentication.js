const joi = require('joi');
const getMessages = require("../locals/schemaValiditionMessages/userValiditionMessages");
const registerSchema = (lang = "en") => {
  const messages = getMessages(lang);
  return joi.object({
    username: joi.string().min(3).required().messages({
      'string.empty': messages.register.username.required,
      'any.required': messages.register.username.required,
      "string.min": messages.register.username.min,
    }),

    email: joi.string().email().messages({
      'string.email': messages.register.email.invalid
    }),
    phone: joi.string().min(3).required().messages({
      'string.empty': messages.register.phone.required,
      'any.required': messages.register.phone.required,
    }),
    password: joi.string().min(3).required().messages({
      'string.empty': messages.register.password.required,
      'string.min': messages.register.password.min,
      'any.required': messages.register.password.required,
    }),

    confirmPassword: joi.any().valid(joi.ref('password')).required().messages({
      'any.only': messages.register.confirmPassword.match,
      'any.required': messages.register.confirmPassword.required,
      'string.empty': messages.register.confirmPassword.required,
    }),
  });
}
const loginSchema = (lang = "ar") => {
  const messages = getMessages(lang);
  return joi.object({
    identifier: joi.alternatives().try(
      joi.string().pattern(/^\d{10,15}$/).messages({
        'string.pattern.base': messages.login.phone.invalid
      }),
      joi.string().email().messages({
        'string.email': messages.login.phone.invalid
      })
    ).required().messages({
      'any.required': messages.login.phone.required,
      'string.empty': messages.login.phone.required
    }),
    password: joi.string().min(3).max(30).required().messages({
      'string.empty': messages.login.password.required,
      'any.required': messages.login.password.required
    }),
  });
}
module.exports = {
  registerSchema,
  loginSchema
}
