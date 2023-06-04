const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const router = require('./routes');

const app = express();

app.use(express.json());

app.use(helmet());

app.use(router);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Централизованная ошибка по умолчанию'
        : message,
    });
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('База данных подключена');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.log('Ошибка подключения к база данных', err);
    app.exit(1);
  });
// mongoose.connect('mongodb://localhost:27017/mestodb');
