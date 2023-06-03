const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const usersController = require('../controllers/users');
const auth = require('../middlewares/auth');

router.use('/signup', usersController.createUser);
router.use('/signin', usersController.login);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(404).send({ message: 'Маршрут не найден' });
});

module.exports = router;
