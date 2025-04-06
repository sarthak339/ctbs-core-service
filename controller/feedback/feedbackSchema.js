const Joi = require("joi");

const FEED_BACK_SCHEMA = Joi.object({
  name: Joi.string().required(),
  email : Joi.string().email().required(),
  organization:Joi.string().required(), 
  designation:Joi.string().required(),
  feedback: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
});

module.exports = {
  FEED_BACK_SCHEMA: FEED_BACK_SCHEMA,
};
