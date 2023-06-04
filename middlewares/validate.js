const {
  celebrate,
  Joi,
} = require('celebrate');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().uri(),
  }),
});

module.exports = { validateUserBody, validateCardBody };
