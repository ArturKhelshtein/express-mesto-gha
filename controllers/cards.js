const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_ERROR_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');
const { getIdFromToken } = require('../utils/token');

const Card = require('../models/card');

function getCards(_req, res) {
  Card.find({})
    .then((cards) => res.status(OK_STATUS_CODE).send({ data: cards }))
    .catch((err) => res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: 'Ошибка на сервере, при запросе карточек', err }));
}

async function createCard(req, res) {
  const { name, link } = req.body;
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED_STATUS_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Ошибка на сервере, при добавлении карточки', err });
    });
}

// eslint-disable-next-line consistent-return
async function deleteCard(req, res) {
  const { cardId } = req.params;
  const token = req.cookies.jwt;
  const userId = getIdFromToken(token);
  const cardData = await Card.findById(cardId).lean();
  const ownerId = cardData.owner.valueOf();

  if (!ownerId) {
    return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Карточка с таким id не найдена' });
  }

  if (userId === ownerId) {
    await Card.findByIdAndDelete(cardId)
      .orFail(new Error('NotFoundId'))
      .then((card) => res.send({ message: 'Карточка удалена', data: card }))
      .catch((err) => {
        if (err.message === 'NotFoundId') {
          return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Карточка с таким id не найдена' });
        }
        if (err.name === 'CastError') {
          return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
        }
        return res
          .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
          .send({ message: 'Ошибка на сервере, при запросе карточки', err });
      });
  }
  return res.status(UNAUTHORIZED_ERROR_STATUS_CODE).send({ message: 'Ошибка, запрещено удалять чужие карточки' });
}

function putLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFoundId'))
    .then((likes) => res.send({ message: 'Лайк добавлен ♡', data: likes }))
    .catch((err) => {
      if (err.message === 'NotFoundId') {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Карточка с таким id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Ошибка на сервере, при добавлении лайка', err });
    });
}

function deleteLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFoundId'))
    .then((likes) => res.send({ message: 'Лайк удален ಠ_ಠ', data: likes }))
    .catch((err) => {
      if (err.message === 'NotFoundId') {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Карточка с таким id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Ошибка при вводе данных', err });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Ошибка на сервере, при удалении лайка', err });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
