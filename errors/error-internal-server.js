const { INTERNAL_SERVER_ERROR } = require('../utils/status-code');

class ErrorInternalServer extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}

module.exports = ErrorInternalServer;
