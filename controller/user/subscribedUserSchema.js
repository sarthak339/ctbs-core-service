const Joi = require("joi");

const SUBSCRIBED_USER_SCHEMA = Joi.object({
  email : Joi.string().email().required(),
});

module.exports = {
  SUBSCRIBED_USER_SCHEMA: SUBSCRIBED_USER_SCHEMA,
};
