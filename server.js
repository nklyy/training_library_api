// Lib
const express = require('express');
const bodyParser = require('body-parser');
const mong = require('mongoose');
require('dotenv').config();

// Routs
const book = require('./routes/book.routs');

// Create app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Rout
app.use('/book', book);
app.use('*', (req, res, next) => {
  res.status(404).json({ message: `Path ${req.originalUrl} not found!` });
  next();
});

// Option mongo
const optMongo = {
  promiseLibrary: global.Promise,
  poolSize: 50, // Количество одновременных подключений
  keepAlive: 30000, // Время сколько будет проверят живой конекшен или нет
  connectTimeoutMS: 5000, // Соединение 5 сек
  useNewUrlParser: true, // Для парсинга ссылки
  useFindAndModify: false, // Что бы можно было модифицировать
  useCreateIndex: true, // Для создания индексов
  useUnifiedTopology: true,
  // Отключаем автоматическое создание индексов.
  // Что бы создать индексы надо воспользоваться командой createIndexes.
  autoIndex: false,
};

async function start() {
  try {
    await mong.connect(process.env.DB, optMongo);

    app.listen(PORT, () => {
      console.log(`Server has been started! PORT ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
