const JWT = require('jsonwebtoken');

const SECRET_KEY = 'secret';

function generateToken(payload) {
  return JWT.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

function checkToken(token) {
  if (!token) {
    return false;
  }

  try {
    return JWT.verify(token, SECRET_KEY);
  } catch (error) {
    return false;
  }
}

function getIdFromToken(token) {
  if (!token) {
    return false;
  }

  const decode = JWT.verify(token, SECRET_KEY)._id;
  return decode;
}

module.exports = { generateToken, checkToken, getIdFromToken };
