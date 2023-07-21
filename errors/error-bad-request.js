const { BAD_REQUEST } = require('../utils/status-code');

class ErrorBadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = ErrorBadRequest;
