// const { OK_STATUS_CODE } = require('../utils/errors');
// const { CREATED_STATUS_CODE } = require('../utils/errors');
// const { BAD_REQUEST_STATUS_CODE } = require('../utils/errors');
// const { NOT_FOUND_STATUS_CODE } = require('../utils/errors');
const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require('../utils/errors');
const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: 'Ошибка на сервере' }));
}

function getUser(req, res) {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: 'Ошибка на сервере' }));
}

function createUser(req, res) {
  const { name, about } = req.body;

  User.create({ name, about })
    .then((user) => res.send({ data: user }))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: 'Ошибка на сервере' }));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
};
