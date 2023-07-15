const { OK_STATUS_CODE } = require('../utils/errors');
const { CREATED_STATUS_CODE } = require('../utils/errors');
const { BAD_REQUEST_STATUS_CODE } = require('../utils/errors');
const { NOT_FOUND_STATUS_CODE } = require('../utils/errors');
const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require('../utils/errors');
const User = require('../models/user');

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

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_STATUS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Ошибка на сервере, при добавлении пользователя', err });
    });
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchInfoUser,
  patchAvatarUser,
};
