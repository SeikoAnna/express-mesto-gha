const router = require('express').Router();
const userController = require('../controllers/users');
const celebrates = require('../middlewares/validate');

router.get('/', userController.getUsers);
router.get('/me', userController.getUserById);
router.get('/:id', celebrates.validateUserId, userController.getUserById);
router.patch('/me', celebrates.validateUpdateUser, userController.updateUser);
router.patch('/me/avatar', celebrates.validateUserAvatar, userController.updateUserAvatar);

module.exports = router;
