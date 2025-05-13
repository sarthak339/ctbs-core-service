const Joi = require("joi");

const USER_SIGN_UP_SCHEMA = Joi.object({
  name : Joi.string().required(),
  email: Joi.string().email().required(), 
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': '{{#label}} does not match',
  }),
});

const USER_LOGIN_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
    USER_SIGN_UP_SCHEMA: USER_SIGN_UP_SCHEMA,
    USER_LOGIN_SCHEMA: USER_LOGIN_SCHEMA,
};
