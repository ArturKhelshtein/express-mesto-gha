const { OK, CREATED } = require('../utils/status-code');
const { getIdFromToken } = require('../utils/token');
const Card = require('../models/card');
const ErrorInternalServer = require('../errors/error-internal-server');
const ErrorBadRequest = require('../errors/error-bad-request');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorUnauthorized = require('../errors/error-unauthorized');

function getCards(_req, res, next) {
  Card.find({})
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(() => next(new ErrorInternalServer('шибка на сервере, при запросе карточек')));
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ErrorBadRequest(`Ошибка при вводе данных: ${error}`));
      }
      return next(new ErrorInternalServer('Ошибка на сервере, при добавлении карточки'));
    });
}

// eslint-disable-next-line consistent-return
async function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);
  const cardData = await Card.findById(cardId).lean();
  const ownerId = cardData.owner.valueOf();

  if (!ownerId) {
    return next(new ErrorNotFound('Карточка с таким id не найдена'));
  }

  if (userId === ownerId) {
    await Card.findByIdAndDelete(cardId)
      .orFail(new ErrorNotFound('Карточка с таким id не найдена'))
      .then((card) => res.send({ message: 'Карточка удалена', data: card }))
      .catch((error) => {
        if (error.statusCode === 404) {
          return next(error);
        }
        if (error.name === 'CastError') {
          return next(new ErrorBadRequest('Ошибка при вводе данных'));
        }
        return next(new ErrorInternalServer('Ошибка на сервере, при запросе карточки'));
      });
  }
  return next(new ErrorUnauthorized('Ошибка, запрещено удалять чужие карточки'));
}

function putLike(req, res, next) {
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(new ErrorNotFound('Карточка с таким id не найден'))
    .then((likes) => res.send({ message: 'Лайк добавлен ♡', data: likes }))
    .catch((error) => {
      if (error.statusCode === 404) {
        return next(error);
      }
      if (error.name === 'CastError') {
        return next(new ErrorBadRequest('Ошибка при вводе данных'));
      }
      return next(new ErrorInternalServer('Ошибка на сервере, при добавлении лайка'));
    });
}

function deleteLike(req, res, next) {
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(new ErrorNotFound('Карточка с таким id не найдена'))
    .then((likes) => res.send({ message: 'Лайк удален ಠ_ಠ', data: likes }))
    .catch((error) => {
      if (error.statusCode === 404) {
        return next(error);
      }
      if (error.name === 'CastError') {
        return next(new ErrorBadRequest('Ошибка при вводе данных'));
      }
      return next(new ErrorInternalServer('Ошибка на сервере, при удалении лайка'));
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
