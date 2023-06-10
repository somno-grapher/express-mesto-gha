const STATUS_CODES = require('./consts');

const handleError = (err, req, res, next) => {
  const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? 'Внутренняя ошибка сервера'
        : message,
    });
  next();
};

module.exports = handleError;
