const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
  cardModel.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err,
        stack: err.stack,
      });
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Card Not Found',
        });
      }
      return res.send({
        message: 'Card Deleted',
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err,
        stack: err.stack,
      });
    });
};

const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Card Not Found',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err,
        stack: err.stack,
      });
    });
};

const unlikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Card Not Found',
        });
      }
      return res.send(card);
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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
