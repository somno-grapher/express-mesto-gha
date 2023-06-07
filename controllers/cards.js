const cardModel = require('../models/card');
const STATUS_CODES = require('../utils/consts');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

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
        // res.status(STATUS_CODES.BAD_REQUEST).send({
        //   message: `Переданы некорректные данные. ${err.message}`,
        // });
        next(new BadRequestError(`Переданы некорректные данные. ${err.message}`));
        return;
      }
      // res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      //   message: 'На сервере произошла ошибка',
      // });
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        // return res.status(STATUS_CODES.NOT_FOUND).send({
        //   message: 'Карточка не найдена',
        // });
        console.log('not found card');
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        // return res.status(STATUS_CODES.UNAUTHORIZED).send({
        //   message: 'Вы не можете удалять чужие карточки',
        // });
        console.log('alien card');
        throw new UnauthorizedError('Вы не можете удалять чужие карточки');
      }
      return cardModel.findByIdAndDelete(req.params.cardId);
    })
    .then(() => {
      console.log('card deleted');
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      console.log('got into catch block');
      next(err);
      // res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      //   message: 'На сервере произошла ошибка',
      // });
    });
};

// const deleteCard = (req, res) => {
//   cardModel.findByIdAndRemove(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         return res.status(STATUS_CODES.NOT_FOUND).send({
//           message: 'Карточка не найдена',
//         });
//       }
//       return res.send({
//         message: 'Карточка удалена',
//       });
//     })
//     .catch(() => {
//       res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
//         message: 'На сервере произошла ошибка',
//       });
//     });
// };

const likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // return res.status(STATUS_CODES.NOT_FOUND).send({
        //   message: 'Карточка не найдена',
        // });
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(STATUS_CODES.BAD_REQUEST).send({
        //   message: 'Переданы некорректные данные',
        // });
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      // res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      //   message: 'На сервере произошла ошибка',
      // });
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
        // return res.status(STATUS_CODES.NOT_FOUND).send({
        //   message: 'Карточка не найдена',
        // });
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(STATUS_CODES.BAD_REQUEST).send({
        //   message: 'Переданы некорректные данные',
        // });
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      // res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      //   message: 'На сервере произошла ошибка',
      // });
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
