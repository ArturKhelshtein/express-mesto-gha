const ErrorUnauthorized = require('../errors/error-unauthorized');
const { checkToken, getIdFromToken } = require('../utils/token');

// eslint-disable-next-line consistent-return
const auth = (req, _res, next) => {
  if (!req.cookies) {
    return next(new ErrorUnauthorized('Необходима авторизация'));
  }

  const token = req.cookies.jwt;
  const result = checkToken(token);
  const userId = getIdFromToken(token);

  req.user = { userId };

  if (!result) {
    return next(new ErrorUnauthorized('Необходима авторизация'));
  }

  next();
};

module.exports = { auth };
