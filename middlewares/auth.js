const mongoose = require('mongoose');

const { checkToken } = require('../utils/jwtAuth');

const auth = (req, res, next) => {
  console.log(req.headers);
  if (!req.headers.authorization) {
    res.status(401).send({ message: 'Пользователь не авторизован' });
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  console.log(token);
  try {
    const payload = checkToken(token);
    console.log('payload in auth: ', payload);
    req.user = {
      // _id: '647b79ab34f41e89fdbaa730',
      // _id: new mongoose.Types.ObjectId('647b79ab34f41e89fdbaa730'),
      _id: new mongoose.Types.ObjectId(payload._id),
    };
    next();
  } catch (err) {
    res.status(401).send({ message: 'Пользователь не авторизован' });
  }
};

module.exports = auth;
