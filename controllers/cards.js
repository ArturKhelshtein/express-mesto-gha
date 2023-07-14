// const router = require('express').Router();
const { OK_STATUS_CODE } = require('../utils/errors');
// const { CREATED_STATUS_CODE } = require('../utils/errors');
// const { BAD_REQUEST_STATUS_CODE } = require('../utils/errors');
// const { NOT_FOUND_STATUS_CODE } = require('../utils/errors');
const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require('../utils/errors');

const Card = require('../models/card');

module.exports.getInitialCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_STATUS_CODE).send(cards))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: 'Ошибка на сервере' }));
};
