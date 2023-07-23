const { FORBIDDEN } = require('../utils/status-code');

class ErrorForbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ErrorForbidden;
