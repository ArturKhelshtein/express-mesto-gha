const { CONFLICT_REQUEST } = require('../utils/status-code');

class ErrorConflictRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_REQUEST;
  }
}

module.exports = ErrorConflictRequest;
