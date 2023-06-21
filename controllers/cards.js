const Card = require('../models/card');

const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => res
      .status(ERROR_INTERNAL_SERVER)
      .send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      }));
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  }).then((card) => res.status(STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_INACCURATE_DATA)
          .send({
            message: 'Введены некорректные данные',
          });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({
            message: 'Внутренняя ошибка сервера',
          });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Введены некорректные данные при удалении карточки' });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Введены некорректные данные' });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};