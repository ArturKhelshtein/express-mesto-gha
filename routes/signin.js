const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { login } = require('../controllers/users');
const { regexEmail } = require('../utils/regexp');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .pattern(regexEmail),
    password: Joi.string().required().min(2),
  }),
}), login);

module.exports = router;
