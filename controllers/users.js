const bcrypt = require('bcryptjs');

const userModel = require('../models/user');
const STATUS_CODES = require('../utils/consts');
const { signToken } = require('../utils/jwtAuth');

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

const getCurrentUser = (req, res) => {
  userModel.findById(req.user._id)
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
            data: {
              _id: user._id,
              email: user.email,
            },
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
  // res.send({ message: 'login controller launched' });
  const { email, password } = req.body;
  userModel.findOne({ email }).select('+password')
    .orFail(() => {
      throw new Error('unauthorized error');
    })
    .then((user) => {
      console.log(user);
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, match]) => {
      console.log('match: ', match);
      if (!match) {
        res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Почта или пароль неверны' });
        return;
      }
      // console.log(user._id);
      const token = signToken({ _id: user._id });
      console.log(token);
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Переданы некорректные данные. ${err.message}`,
        });
        return;
      }
      if (err.message === 'unauthorized error') {
        res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Почта или пароль неверны' });
        return;
      }
      res.status(STATUS_CODES.DEFAULT).send({
        message: 'На сервере произошла ошибка',
      });
    });
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
  getCurrentUser,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
