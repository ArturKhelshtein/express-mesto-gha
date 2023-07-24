const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  getCurrentUser,
  patchInfoUser,
  patchAvatarUser,
} = require('../controllers/users');
const { regexInt16, regexUrl } = require('../utils/regexp');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().min(24).max(24)
      .pattern(regexInt16),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchInfoUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regexUrl),
  }),
}), patchAvatarUser);

module.exports = router;
