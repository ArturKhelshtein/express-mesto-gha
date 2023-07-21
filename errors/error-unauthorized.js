const { UNAUTHORIZED_ERROR } = require('../utils/status-code');

class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}

module.exports = ErrorUnauthorized;
