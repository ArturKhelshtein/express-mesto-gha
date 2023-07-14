const router = require('express').Router();
const { NOT_FOUND_STATUS_CODE } = require('../utils/errors');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: `Ресурс по адресу ${req.path} не найден` });
});

module.exports = router;
