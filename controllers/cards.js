const cardModel = require('../models/card');
const STATUS_CODES = require('../utils/consts');

const getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const createCard = (req, res) => {
  cardModel.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => {
      res.status(STATUS_CODES.CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Переданы некорректные данные. ${err.message}`,
        });
        return;
      }
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const deleteCard = (req, res) => {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        // return res.status(STATUS_CODES.NOT_FOUND).send({
        //   message: 'Карточка не найдена',
        // });
        console.log('not found card');
        throw new Error('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        // return res.status(STATUS_CODES.UNAUTHORIZED).send({
        //   message: 'Вы не можете удалять чужие карточки',
        // });
        console.log('alien card');
        throw new Error('Вы не можете удалять чужие карточки');
      }
      return cardModel.findByIdAndDelete(req.params.cardId);
    })
    .then(() => {
      console.log('card deleted');
      res.send({ message: 'Карточка удалена' });
    })
    .catch(() => {
      console.log('got into catch block');
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
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

const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
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
        return res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
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
