const bcrypt = require('bcryptjs');
const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_ERROR_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  CONFLICT_REQUEST_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');
const User = require('../models/user');
const { generateToken, getIdFromToken } = require('../utils/token');

function getUsers(_req, res) {
  User.find({})
    .then((user) => res.status(OK_STATUS_CODE).send({ data: user }))
    .catch((err) => res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: 'Ошибка на сервере, при запросе пользователей', err }));
}

function getUser(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotFoundId'))
    .then((user) => res.status(OK_STATUS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFoundId') {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Ошибка на сервере, при запросе пользователя', err });
    });
}

async function getCurrentUser(req, res) {
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);
  User.findById(userId)
    .orFail(new Error('NotFoundId'))
    .then((user) => res.status(OK_STATUS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFoundId') {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Ошибка на сервере, при запросе пользователя', err });
    });
}

function isUserDataGood(req, res) {
  if (!req.body) {
    res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка тело запроса некорректно' });
    return false;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка, не заполнено поле email или password' });
    return false;
  }
  return true;
}

// eslint-disable-next-line consistent-return
async function createUser(req, res) {
  if (isUserDataGood(req, res)) {
    const { email, password } = req.body;

    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hash });
      return res.status(CREATED_STATUS_CODE).send({ message: 'Пользователь создан', user: { _id: user._id, email: user.email } });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
      }
      if (err.keyValue.email) {
        return res.status(CONFLICT_REQUEST_STATUS_CODE).send({ message: 'Ошибка данный email уже используется', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Ошибка на сервере, при добавлении пользователя', err });
    }
  }
}

// eslint-disable-next-line consistent-return
function patchInfoUser(req, res) {
  const userId = req.user._id;
  const { name, about } = req.body;
  if (name === undefined || about === undefined) {
    return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных, неверные данные' });
  }
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(OK_STATUS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Ошибка на сервере, при запросе пользователя', err });
    });
}

// eslint-disable-next-line consistent-return
function patchAvatarUser(req, res) {
  const userId = req.user._id;
  const { avatar } = req.body;
  if (avatar === undefined) {
    return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных, неверные данные' });
  }
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(OK_STATUS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Ошибка на сервере, при запросе пользователя', err });
    });
}

// eslint-disable-next-line consistent-return
async function login(req, res) {
  if (isUserDataGood(req, res)) {
    const { email, password } = req.body;

    try {
      const user = await User.findUserByCredentials(email, password);
      const payload = { _id: user._id };
      const token = generateToken(payload);
      res.cookie('jwt', token);
      return res.status(OK_STATUS_CODE).send({ message: 'Авторицазия успешна', user: payload });
    } catch (error) {
      res.status(UNAUTHORIZED_ERROR_STATUS_CODE).send({ message: 'Пользователь не найден', error });
    }
  }
}

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  patchInfoUser,
  patchAvatarUser,
  login,
};
