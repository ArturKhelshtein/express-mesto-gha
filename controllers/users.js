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
    .then((user) => {
      if (user !== null) {
        return res.status(OK_STATUS_CODE).send({ data: user });
      }
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Пользователь с таким id не найден' });
    })
    .catch((err) => {
      res
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
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка во введенных данных', ...err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Ошибка на сервере, при добавлении пользователя', err });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
};
