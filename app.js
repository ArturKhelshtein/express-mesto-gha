const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');

const router = require('./routes');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const { NOT_FOUND } = require('./utils/status-code');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookies());
app.use(router);

app.use(errors());
app.use(errorMiddleware);

// app.use((req, res) => {
//   res
//     .status(NOT_FOUND)
//     .send({ message: `Ресурс по адресу ${req.path} не найден` });
// });

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Application is running on port ${PORT}`));
