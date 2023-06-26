const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const extractJwtToken = (header) => header.replace('jwt=', '');

const auth = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie || !(cookie.startsWith('jwt='))) {
    return next(new Unauthorized('Ошибка авторизации'));
  }

  const token = extractJwtToken(cookie);
  let payload;

  try {
    payload = jwt.verify(token, 'super_strong_password');
  } catch (err) {
    return next(new Unauthorized('Ошибка авторизации'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
