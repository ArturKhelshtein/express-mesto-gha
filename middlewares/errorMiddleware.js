const ErrorBadRequest = require('../errors/error-bad-request');
const ErrorConflictRequest = require('../errors/error-conflict-request');
const ErrorForbidden = require('../errors/error-forbidden');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorUnauthorized = require('../errors/error-unauthorized');

function returnError({ res, error }) {
  return res
    .status(error.statusCode)
    .send({ message: error.message });
}

// eslint-disable-next-line consistent-return
const errorMiddleware = (error, _req, res, next) => {
  if (error instanceof ErrorBadRequest) {
    returnError({ res, error });
  }
  if (error instanceof ErrorUnauthorized) {
    returnError({ res, error });
  }
  if (error instanceof ErrorForbidden) {
    returnError({ res, error });
  }
  if (error instanceof ErrorNotFound) {
    returnError({ res, error });
  }
  if (error instanceof ErrorConflictRequest) {
    returnError({ res, error });
  }

  next();
};

module.exports = { errorMiddleware };
