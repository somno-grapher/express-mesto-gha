const router = require('express').Router();

const usersController = require('../controllers/users');
const {
  validateUserBodyOnProfileUpdate,
  validateUserBodyOnAvatarUpdate,
  validateUserIdParam,
} = require('../middlewares/validate');

router.get('/', usersController.getUsers);

router.get('/me', usersController.getCurrentUserDecorator(usersController.getUser));

router.get('/:userId', validateUserIdParam, usersController.getUserByIdDecorator(usersController.getUser));

router.patch('/me', validateUserBodyOnProfileUpdate, usersController.updateProfileDecorator(usersController.updateUserInfo));

router.patch('/me/avatar', validateUserBodyOnAvatarUpdate, usersController.updateAvatarDecorator(usersController.updateUserInfo));

module.exports = router;
