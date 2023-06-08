const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

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

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('База данных подключена');
    app.listen(3000, () => {
      console.log('Сервер подключен к порту 3000');
    });
  })
  .catch((err) => {
    console.log('Ошибка подключения к базе данных', err);
    app.exit(1);
  });
