const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err,
        stack: err.stack,
      });
    });
};

const getUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  userModel.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err,
        stack: err.stack,
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
