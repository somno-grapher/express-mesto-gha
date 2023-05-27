const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);
router.get('/:userId', usersController.getUserById);
router.post('/', usersController.createUser);
router.patch('/me', usersController.updateProfile);

module.exports = router;
