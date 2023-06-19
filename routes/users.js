const router = require('express').Router();
const userController = require('../controllers/users');;

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.patch('/me', userController.updateUser);
router.patch('/me/avatar', userController.updateUserAvatar);

module.exports = router;