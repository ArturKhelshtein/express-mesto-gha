const { NOT_FOUND } = require('../utils/status-code');

class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = ErrorNotFound;
