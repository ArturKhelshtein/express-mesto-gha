// файл со статусами ответов на запросы
const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED_ERROR = 401;
const NOT_FOUND = 404;
const CONFLICT_REQUEST = 409;
const INTERNAL_SERVER_ERROR = 500;

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED_ERROR,
  NOT_FOUND,
  CONFLICT_REQUEST,
  INTERNAL_SERVER_ERROR,
};
