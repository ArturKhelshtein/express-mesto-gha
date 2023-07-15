const { OK_STATUS_CODE } = require('../utils/errors');
const { CREATED_STATUS_CODE } = require('../utils/errors');
const { BAD_REQUEST_STATUS_CODE } = require('../utils/errors');
const { NOT_FOUND_STATUS_CODE } = require('../utils/errors');
const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require('../utils/errors');

const Card = require('../models/card');

function getCards(_req, res) {
  Card.find({})
    .then((cards) => res.status(OK_STATUS_CODE).send({ data: cards }))
    .catch((err) => res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: 'Ошибка на сервере, при запросе карточек', err }));
}

function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
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

function deleteCard(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (card !== null) {
        return res.send({ message: 'Карточка удалена', data: card });
      }
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Карточка с таким id не найдена' });
    })
    .catch((err) => res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: 'Ошибка на сервере, при запросе карточки', err }));
}

function putLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { like: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (like !== null) {
        return res.send({ message: 'Лайк добавлен ♡', data: like });
      }
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Карточка с таким id не найдена' });
    })
    .catch((err) => res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Ошибка на сервере, при добавлении лайка', err }));
}

function deleteLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { like: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (like !== null) {
        return res.send({ message: 'Лайк удален ಠ_ಠ', data: like });
      }
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Карточка с таким id не найдена' });
    })
    .catch((err) => res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Ошибка на сервере, при удалении лайка', err }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
