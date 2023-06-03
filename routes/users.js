const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);
router.get('/:userId', usersController.getUserById);
// router.post('/signup', usersController.createUser);
// router.post('/signin', usersController.login);
router.patch('/me', usersController.updateProfile);
router.patch('/me/avatar', usersController.updateAvatar);

module.exports = router;
