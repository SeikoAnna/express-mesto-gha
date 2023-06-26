const router = require('express').Router();
const cardsController = require('../controllers/cards');
const celebrates = require('../middlewares/validate');

router.get('/', cardsController.getCards);
router.post('/', celebrates.validateCreateCard, cardsController.createCard);
router.delete('/:cardId', celebrates.validateCardId, cardsController.deleteCard);
router.put('/:cardId/likes', celebrates.validateCardId, cardsController.likeCard);
router.delete('/:cardId/likes', celebrates.validateCardId, cardsController.dislikeCard);

module.exports = router;
