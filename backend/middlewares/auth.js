const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken Для создания токенов

// const JWT_SECRET = 'the-world-is-not-enought'; // secret key for token
const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = () => {
  const loginError = new Error('Необходима авторизация');
  loginError.statusCode = 401;
  throw loginError;
};

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  // если токен на месте, извлечём его
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV !== 'production' ? JWT_SECRET : 'prod-secret');
  } catch (err) {
    return handleAuthError(err);
  }

  /*
  // Проверка.
  // Секретный ключ для верификации JWT в режиме разработки не должен верифицировать JWT продакшена.

  // JWT, который вернул публичный сервер
  const YOUR_JWT = authorization.replace('Bearer ', '');

  // секретный ключ для разработки из кода
  const SECRET_KEY_DEV = JWT_SECRET;

  let payload;
  try {
    payload = jwt.verify(YOUR_JWT, SECRET_KEY_DEV);
    console.log('\x1b[31m%s\x1b[0m', `
      Надо исправить. В продакшне используется тот же
      секретный ключ, что и в режиме разработки.
    `);
  } catch (err) {
    if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
      console.log(
        '\x1b[32m%s\x1b[0m',
        'Всё в порядке. Секретные ключи отличаются',
      );
    } else {
      console.log(
        '\x1b[33m%s\x1b[0m',
        'Что-то не так',
        err,
      );
    }
  }
  */
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
