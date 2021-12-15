// импортируем нужные модули
const winston = require('winston');
const expressWinston = require('express-winston');

// создадим логгер запросов
const requestLogger = expressWinston.logger({
  // куда нужно писать лог
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  // формат записи логов
  format: winston.format.json(),
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
    // new winston.transports.Console(),
  ],
  format: winston.format.json(),
});

// после создания логгеров их нужно экспортировать, затем импортировать в app.js:
module.exports = {
  requestLogger,
  errorLogger,
};
