const ErrorBadRequest = require('../errors/error-bad-request');
const ErrorConflictRequest = require('../errors/error-conflict-request');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorUnauthorized = require('../errors/error-unauthorized');

// eslint-disable-next-line consistent-return
const errorMiddleware = (error, _req, res, next) => {
  if (error instanceof ErrorBadRequest) {
    return res
      .status(error.statusCode)
      .send({ message: error.message });
  }
  if (error instanceof ErrorUnauthorized) {
    return res
      .status(error.statusCode)
      .send({ message: error.message });
  }
  if (error instanceof ErrorNotFound) {
    return res
      .status(error.statusCode)
      .send({ message: error.message });
  }
  if (error instanceof ErrorConflictRequest) {
    return res
      .status(error.statusCode)
      .send({ message: error.message });
  }

  next();
};

module.exports = { errorMiddleware };
