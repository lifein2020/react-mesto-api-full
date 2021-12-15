//  импртируем модель
const Card = require('../models/card');

//  возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

//  создаёт карточку
module.exports.createCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя
  return Card.create({ name, link, owner: ownerId }) // создадим документ на основе пришедших данных
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      next(err);
    });
};

//  удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const notFound = new Error('Ресурс не найден');
      notFound.statusCode = 404;
      throw notFound;
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id.toString()) {
        const NotAuthError = new Error('Попытка удалить чужую карточку');
        NotAuthError.statusCode = 403;
        throw NotAuthError;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      }
      if (err.statusCode === 403) {
        next(err);
      }
      if (err.name === 'CastError') {
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      next(err);
    });
};

//  поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    { _id: cardId }, //  req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      const err = new Error('Ресурс не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      }
      if (err.name === 'CastError') {
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      next(err);
    });
};

//  убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId, //  req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      const err = new Error('Ресурс не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      }
      if (err.name === 'CastError') {
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      next(err);
    });
};
