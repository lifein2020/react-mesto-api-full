const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');// импортируем модуль jsonwebtoken Для создания токенов
const User = require('../models/user'); //  импортируем модель

// const JWT_SECRET = 'the-world-is-not-enought';
const { NODE_ENV, JWT_SECRET } = process.env;

//  Создание документов

// возвращает информацию о текущем пользователе
const getUserMe = (req, res, next) => {
  const { payload } = req.user;
  // console.log(req.user);
  return User.findOne({ payload })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

//  возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

//  возвращает пользователя по _id
const getUserProfile = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId) // (req.params.userId)
    .orFail(() => {
      const err = new Error('Ресурс не найден'); // notFound
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.status(200).send({ data: user });
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

//  создаёт пользователя
const createUser = (req, res, next) => {
  User.findOne(({ email: req.body.email }))
    .then((user) => {
      if (user) {
        const MongoServerError = new Error('Пользователь с таким email уже существует');
        MongoServerError.statusCode = 409;
        MongoServerError.code = 11000;
        MongoServerError.name = 'MongoServerError';
        throw MongoServerError;
      }
      return bcrypt.hash(req.body.password, 10); // хешируем пароль, 10 это соль
    })
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then(({
      name,
      about,
      avatar,
      email,
      _id,
    }) => {
      res.status(201).send({
        data: {
          name,
          about,
          avatar,
          email,
          _id,
        },
      }); // .send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(err);
      }
      next(err);
    });
};

// обновляет профиль
const updateUser = (req, res, next) => {
  const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // Передаем объект опций чтобы передать в then  уже обновлённую запись:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      const err = new Error('Ресурс не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      }
      if (err.name === 'ValidationError') {
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      next(err);
    });
};

//  обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const err = new Error('Ресурс не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      }
      if (err.name === 'ValidationError') {
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      next(err);
    });
};

// аутентификация
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        // JWT_SECRET,
        // NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        // process.env.NODE_ENV !== 'production' ? 'dev-secret' : process.env.JWT_SECRET
        NODE_ENV !== 'production' ? JWT_SECRET : 'prod-secret',
        { expiresIn: '7d' },
      );

      // вернём токен в теле ответа
      res.send({ token }); // или заголовок Set-Cookie
      // return res.status(200).send({ token });

      /* res.cookie('userToken', token, {
        maxAge: 360000,
        httpOnly: true,
        sameSite: true,
      }).send({ _id: user._id });
      */
    })
    .catch((err) => {
      // ошибка приодит из findUserByCredentials. См models - user.js - метод
      if (err.name === 'LoginError' && err.code === 11000) {
        next(err);
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserProfile,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserMe,
};
