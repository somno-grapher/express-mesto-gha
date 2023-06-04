const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { validateCardBody } = require('../middlewares/validate');

router.get('/', cardsController.getCards);
router.post('/', validateCardBody, cardsController.createCard);
router.delete('/:cardId', cardsController.deleteCard);
router.put('/:cardId/likes', cardsController.likeCard);
router.delete('/:cardId/likes', cardsController.unlikeCard);

module.exports = router;
