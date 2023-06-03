const bcrypt = require('bcryptjs');

const userModel = require('../models/user');
const STATUS_CODES = require('../utils/consts');

const SALT_ROUNDS = 10;

const getUsers = (req, res) => {
  userModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(STATUS_CODES.DEFAULT).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const getUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch(() => {
      res.status(STATUS_CODES.DEFAULT).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      console.log('hash: ', hash);
      userModel.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(STATUS_CODES.CREATED).send({
            name,
            about,
            avatar,
            email,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(STATUS_CODES.BAD_REQUEST).send({
              message: `Переданы некорректные данные. ${err.message}`,
            });
            return;
          }
          if (err.code === STATUS_CODES.MONGO_DUPLICATED_KEY) {
            res.status(STATUS_CODES.CONFLICT).send({
              message: 'Такой пользователь уже существует',
            });
            return;
          }
          res.status(STATUS_CODES.DEFAULT).send({
            message: 'На сервере произошла ошибка',
          });
        });
    });
};

const login = (req, res) => {
  res.send({ message: 'login controller launched' });
};

const updateProfile = (req, res) => {
  userModel.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Переданы некорректные данные. ${err.message}`,
        });
        return;
      }
      res.status(STATUS_CODES.DEFAULT).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const updateAvatar = (req, res) => {
  userModel.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Переданы некорректные данные. ${err.message}`,
        });
        return;
      }
      res.status(STATUS_CODES.DEFAULT).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
