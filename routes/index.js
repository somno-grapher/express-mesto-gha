const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const usersController = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserBody } = require('../middlewares/validate');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', validateUserBody, usersController.createUser);
router.use('/signin', validateUserBody, usersController.login);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
