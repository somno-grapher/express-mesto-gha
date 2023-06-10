const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userModel = require('../models/user');
const STATUS_CODES = require('../utils/consts');
const { signToken } = require('../utils/jwtAuth');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (id, res, next) => {
  userModel.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

// getUser decorator
const getUserByIdDecorator = (getUserById) => (req, res, next) => {
  getUserById(req.params.userId, res, next);
};

// getUser decorator
const getCurrentUserDecorator = (getUserById) => (req, res, next) => {
  getUserById(req.user._id, res, next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)

    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => {
      res.status(STATUS_CODES.CREATED).send({
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      });
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные. ${err.message}`));
        return;
      }
      if (err.code === STATUS_CODES.MONGO_DUPLICATED_KEY) {
        next(new ConflictError('Такой пользователь уже существует'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')

    .orFail(() => {
      throw new UnauthorizedError('Почта или пароль неверны');
    })

    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))

    .then(([user, match]) => {
      if (!match) {
        throw new UnauthorizedError('Почта или пароль неверны');
      }
      const token = signToken({ _id: user._id });
      res.send({ token });
    })

    .catch((err) => {
      next(err);
    });
};

const updateUserInfo = (id, updatedInfo, res, next) => {
  userModel.findByIdAndUpdate(
    id,
    updatedInfo,
    {
      new: true,
      runValidators: true,
    },
  )

    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные. ${err.message}`));
      } else {
        next(err);
      }
    });
};

// updateUserInfo decorator
const updateProfileDecorator = (updateProfile) => (req, res, next) => {
  updateProfile(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    res,
    next,
  );
};

// updateUserInfo decorator
const updateAvatarDecorator = (updateAvatar) => (req, res, next) => {
  updateAvatar(
    req.user._id,
    { avatar: req.body.avatar },
    res,
    next,
  );
};

module.exports = {
  getUsers,
  getUser,
  getUserByIdDecorator,
  getCurrentUserDecorator,
  createUser,
  login,
  updateProfileDecorator,
  updateAvatarDecorator,
  updateUserInfo,
};
