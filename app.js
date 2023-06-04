const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
// mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());

app.use(helmet());

app.use(router);

app.use(errors());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
