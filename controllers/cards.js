const mongoose = require('mongoose');

const cardModel = require('../models/card');
const STATUS_CODES = require('../utils/consts');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  cardModel.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  cardModel.create({
    owner: req.user._id,
    ...req.body,
  })

    .then((card) => {
      res.status(STATUS_CODES.CREATED).send(card);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные. ${err.message}`));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)

    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
      }
      return card.deleteOne();
    })

    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })

    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )

    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send(card);
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const unlikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )

    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send(card);
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
