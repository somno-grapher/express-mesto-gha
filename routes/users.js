const router = require('express').Router();

const usersController = require('../controllers/users');
const { validateUserBodyOnUpdate, validateUserIdParam } = require('../middlewares/validate');

router.get('/', usersController.getUsers);
router.get('/me', usersController.getCurrentUser);
router.get('/:userId', validateUserIdParam, usersController.getUserById);
router.patch('/me', validateUserBodyOnUpdate, usersController.updateProfileDecorator(usersController.updateUserInfo));
router.patch('/me/avatar', validateUserBodyOnUpdate, usersController.updateAvatarDecorator(usersController.updateUserInfo));

module.exports = router;
