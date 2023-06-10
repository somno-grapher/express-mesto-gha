const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const { PORT, DB_URL } = require('./config');
const router = require('./routes');
const STATUS_CODES = require('./utils/consts');

const app = express();

app.use(express.json());

app.use(helmet());

app.use(router);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? 'Внутренняя ошибка сервера'
        : message,
    });
  next();
});

mongoose.connect(DB_URL)
  .then(() => {
    console.log('База данных подключена');
    app.listen(PORT, () => {
      console.log(`Сервер подключен к порту ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Ошибка подключения к базе данных', err);
    app.exit(1);
  });
