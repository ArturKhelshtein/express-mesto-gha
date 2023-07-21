const router = require('express').Router();
const cookies = require('cookie-parser');
const { NOT_FOUND } = require('../utils/status-code');

const userRouter = require('./users');
const cardRouter = require('./cards');
const signInRouter = require('./signin');
const signUpRouter = require('./signup');
const { auth } = require('../middlewares/auth');
const { errors } = require('../middlewares/errors');

router.use('/signin', signInRouter);
router.use('/signup', signUpRouter);

router.use(cookies());
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use(errors);

router.use((req, res) => {
  res
    .status(NOT_FOUND)
    .send({ message: `Ресурс по адресу ${req.path} не найден` });
});

module.exports = router;
