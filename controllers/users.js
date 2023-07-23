const bcrypt = require('bcryptjs');
const { OK, CREATED } = require('../utils/status-code');
const User = require('../models/user');
const { generateToken, getIdFromToken } = require('../utils/token');
const ErrorBadRequest = require('../errors/error-bad-request');
const ErrorInternalServer = require('../errors/error-internal-server');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorConflictRequest = require('../errors/error-conflict-request');

function getUsers(_req, res, next) {
  User.find({})
    .then((user) => res.status(OK).send({ data: user }))
    .catch(() => next(new ErrorInternalServer('Ошибка на сервере, при запросе пользователей')));
}

function getUser(req, res, next) {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new ErrorNotFound('Пользователь с таким id не найден'))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((error) => {
      if (error.statusCode === 404) {
        return next(error);
      }
      if (error.name === 'CastError') {
        return next(new ErrorBadRequest('Ошибка при вводе данных'));
      }
      return next(new ErrorInternalServer('Ошибка на сервере, при запросе пользователя'));
    });
}

function getCurrentUser(req, res, next) {
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);
  User.findById(userId)
    .orFail(new ErrorNotFound('Пользователь с таким id не найден'))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((error) => {
      if (error.statusCode === 404) {
        return next(error);
      }
      if (error.name === 'CastError') {
        return next(new ErrorBadRequest('Ошибка при вводе данных'));
      }
      return next(new ErrorInternalServer('Ошибка на сервере, при запросе пользователя'));
    });
}

function isUserDataGood(req) {
  if (!req.body) {
    return false;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return false;
  }
  return true;
}

// eslint-disable-next-line consistent-return
async function createUser(req, res, next) {
  if (isUserDataGood(req, res)) {
    const { email, password } = req.body;

    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hash });
      return res.status(CREATED).send({
        message: 'Пользователь создан',
        user: {
          _id: user._id, email: user.email, name: user.name, about: user.about, avatar: user.avatar,
        },
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return next(new ErrorBadRequest(`Ошибка при вводе данных: ${error}`));
      }
      if (error.keyValue.email) {
        return next(new ErrorConflictRequest(`Ошибка, email: «${email}» уже используется`));
      }
      return new ErrorInternalServer('Ошибка на сервере, при запросе пользователей');
    }
  } else {
    return next(new ErrorBadRequest('Ошибка, в теле запроса проверте поле email или password'));
  }
}

// eslint-disable-next-line consistent-return
function patchInfoUser(req, res, next) {
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);
  const { name, about } = req.body;
  if (name === undefined || about === undefined) {
    return next(new ErrorBadRequest('Ошибка при вводе данных, неверные данные'));
  }
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(OK).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ErrorBadRequest(`Ошибка при вводе данных: ${error}`));
      }
      return new ErrorInternalServer('Ошибка на сервере, при запросе пользователя');
    });
}

// eslint-disable-next-line consistent-return
function patchAvatarUser(req, res, next) {
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);
  const { avatar } = req.body;
  if (avatar === undefined) {
    return next(new ErrorBadRequest('Ошибка при вводе данных, неверные данные'));
  }
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(OK).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ErrorBadRequest(`Ошибка при вводе данных: ${error}`));
      }
      return next(new ErrorInternalServer('Ошибка на сервере, при запросе пользователя'));
    });
}

// eslint-disable-next-line consistent-return
async function login(req, res, next) {
  if (isUserDataGood(req, res)) {
    const { email, password } = req.body;

    try {
      const user = await User.findUserByCredentials(email, password);
      const payload = { _id: user._id };
      const token = generateToken(payload);
      res.cookie('jwt', token);
      return res.status(OK).send({ message: 'Авторицазия успешна', user: payload });
    } catch (error) {
      if (error.statusCode === 400) {
        return next(error);
      }
      return next(new ErrorBadRequest('Пользователь не найден'));
    }
  } else {
    return next(new ErrorBadRequest('Ошибка, в теле запроса проверьте поле email или password'));
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
