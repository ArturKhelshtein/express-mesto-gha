const { OK, CREATED } = require('../utils/status-code');
const Card = require('../models/card');
const ErrorInternalServer = require('../errors/error-internal-server');
const ErrorBadRequest = require('../errors/error-bad-request');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorForbidden = require('../errors/error-forbidden');

function getCards(_req, res, next) {
  Card.find({})
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(() => next(new ErrorInternalServer('шибка на сервере, при запросе карточек')));
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ErrorBadRequest(`Ошибка при вводе данных: ${error}`));
      }
      return next(error);
    });
}

// eslint-disable-next-line consistent-return
async function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  try {
    const cardData = await Card.findById(cardId).lean();
    const ownerId = cardData?.owner.valueOf();

    if (!cardId || !cardData) {
      return next(new ErrorNotFound('Карточка с таким id не найдена'));
    }

    if (userId === ownerId) {
      await Card.findByIdAndDelete(cardId)
        .orFail(new ErrorNotFound('Карточка с таким id не найдена'))
        .then((card) => res.send({ message: 'Карточка удалена', data: card }))
        .catch((error) => {
          if (error.name === 'CastError') {
            return next(new ErrorBadRequest('Ошибка при вводе данных'));
          }
          return next(error);
        });
    }
    return next(new ErrorForbidden('Ошибка, запрещено удалять чужие карточки'));
  } catch (error) {
    return next(error);
  }
}

function putLike(req, res, next) {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(new ErrorNotFound('Карточка с таким id не найден'))
    .then((likes) => res.send({ message: 'Лайк добавлен ♡', data: likes }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ErrorBadRequest('Ошибка при вводе данных'));
      }
      return next(error);
    });
}

function deleteLike(req, res, next) {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(new ErrorNotFound('Карточка с таким id не найдена'))
    .then((likes) => res.send({ message: 'Лайк удален ಠ_ಠ', data: likes }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ErrorBadRequest('Ошибка при вводе данных'));
      }
      return next(error);
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
