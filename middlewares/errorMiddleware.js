const ErrorBadRequest = require('../errors/error-bad-request');
const ErrorUnauthorized = require('../errors/error-unauthorized');
const ErrorForbidden = require('../errors/error-forbidden');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorConflictRequest = require('../errors/error-conflict-request');

function errorReturn({ res, error }) {
  return res
    .status(error.statusCode)
    .send({ message: error.message });
}

// eslint-disable-next-line consistent-return
const errorMiddleware = (error, _req, res, next) => {
  if (error instanceof ErrorBadRequest) {
    errorReturn({ res, error });
  }
  if (error instanceof ErrorUnauthorized) {
    errorReturn({ res, error });
  }
  if (error instanceof ErrorForbidden) {
    errorReturn({ res, error });
  }
  if (error instanceof ErrorNotFound) {
    errorReturn({ res, error });
  }
  if (error instanceof ErrorConflictRequest) {
    errorReturn({ res, error });
  }

  next();
};

module.exports = { errorMiddleware };
