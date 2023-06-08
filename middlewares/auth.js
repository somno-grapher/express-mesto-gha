const mongoose = require('mongoose');

const { checkToken } = require('../utils/jwtAuth');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error();
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    const payload = checkToken(token);
    req.user = {
      _id: new mongoose.Types.ObjectId(payload._id),
    };
    next();
  } catch (err) {
    next(new UnauthorizedError('Пользователь не авторизован'));
  }
};

module.exports = auth;
