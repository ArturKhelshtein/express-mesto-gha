const { UNAUTHORIZED_ERROR_STATUS_CODE } = require('../utils/errors');
const { checkToken } = require('../utils/token');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  if (!req.cookies) {
    return res
      .status(UNAUTHORIZED_ERROR_STATUS_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  const token = req.cookies.jwt;
  const result = checkToken(token);

  if (!result) {
    return res
      .status(UNAUTHORIZED_ERROR_STATUS_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  next();
};

module.exports = { auth };
