const { UNAUTHORIZED } = require('../utils/status-code');

class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = ErrorUnauthorized;
