const router = require('express').Router();

const usersController = require('../controllers/users');
const { validateUserBodyOnUpdate, validateUserIdParam } = require('../middlewares/validate');

router.get('/', usersController.getUsers);
router.get('/me', usersController.getCurrentUserDecorator(usersController.getUser));
router.get('/:userId', validateUserIdParam, usersController.getUserByIdDecorator(usersController.getUser));
router.patch('/me', validateUserBodyOnUpdate, usersController.updateProfileDecorator(usersController.updateUserInfo));
router.patch('/me/avatar', validateUserBodyOnUpdate, usersController.updateAvatarDecorator(usersController.updateUserInfo));

module.exports = router;
