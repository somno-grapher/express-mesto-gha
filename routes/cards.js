const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { validateCardIdParam, validateCardBody } = require('../middlewares/validate');

router.get('/', cardsController.getCards);
router.post('/', validateCardBody, cardsController.createCard);
router.delete('/:cardId', validateCardIdParam, cardsController.deleteCard);
router.put('/:cardId/likes', validateCardIdParam, cardsController.likeCard);
router.delete('/:cardId/likes', validateCardIdParam, cardsController.unlikeCard);

module.exports = router;
