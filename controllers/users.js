const User = require('../models/user');

const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res
      .status(ERROR_INTERNAL_SERVER)
      .send({
        message: 'Внутренняя ошибка сервера',
      }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_INACCURATE_DATA)
          .send({
            message: 'Переданы некорректные данны при поиске пользователя по id',
          });
      } else if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Пользователь по указанному id не найден',
          });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({
            message: 'Внутренняя ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_INACCURATE_DATA)
          .send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({
            message: 'Внутренняя ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};