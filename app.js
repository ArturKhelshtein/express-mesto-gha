const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const router = require('./routes');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(helmet());
app.use(express.json());
app.use(router);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Application is running on port ${PORT}`));
