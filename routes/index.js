const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { auth } = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFound = require('../errors/NotFound');
const celebrates = require('../middlewares/validate');

router.use('/signin', celebrates.validateCreateAndLoginUser, login);
router.use('/signup', celebrates.validateCreateAndLoginUser, createUser);
router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

module.exports = router;
