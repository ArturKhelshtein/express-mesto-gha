const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(router);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Application is running on port ${PORT}`));
