const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');

const router = require('./routes');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const ErrorNotFound = require('./errors/error-not-found');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookies());
app.use(router);
app.use((req, _res, next) => next(new ErrorNotFound(`Ресурс по адресу ${req.path} не найден`)));

app.use(errors());
app.use(errorMiddleware);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Application is running on port ${PORT}`));
