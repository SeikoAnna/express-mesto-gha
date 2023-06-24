const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const Unauthorized = require('../errors/Unauthorized');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next)
};

const getUserById = (req, res, next) => {
  const userId = req.params.id ? req.params.id : req.user._id;

  User.findById(userId)
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(String(password), 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => {
      const {
        _id, name, about, avatar, email,
      } = user;
      return res.status(201).send({
        _id, name, about, avatar, email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные'));
      } else if (err.code === 11000) {
        next(new Conflict('Такой email уже существует'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(new Unauthorized('Неверный логин или пароль'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, 'super_strong_password');
            res.cookie('jwt', jwt, {
              maxAge: 3600 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            });
            res.send(user);
          } else {
            throw new Unauthorized('Неверный логин или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};