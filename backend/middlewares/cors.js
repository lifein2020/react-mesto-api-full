// Разрешаем доступ с определённых источников
const allowedCors = [
  'https://mesto.practicum.nomoredomains.rocks',
  'http://mesto.practicum.nomoredomains.rocks',
  'https://auth.nomoreparties.co',
  'http://localhost:3000/',
  'http://localhost:3000/sign-up',
  'http://localhost:3000/sign-in',
  '*',
  'localhost: 3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin

  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Conrol-Allow-Origin', origin); // origin
  }

  const { httpMethod } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,POST,PUT,PATCH,DELETE'; // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const requestHeaders = req.headers['access-control-request-headers']; // сохраняем список заголовков исходного запроса

  // Если это предварительный запрос, добавляем нужные заголовки
  if (httpMethod === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS); // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Headers', requestHeaders); // разрешаем кросс-доменные запросы с этими заголовками

    return res.end(); // завершаем обработку запроса и возвращаем результат клиенту
  }
  next();
};
