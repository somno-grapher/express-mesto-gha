const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
// mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();

app.use(express.json());

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    // _id: '6471bdd75bd759a28a073056',
    _id: new mongoose.Types.ObjectId('6471bdd75bd759a28a073056'),
  };
  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
