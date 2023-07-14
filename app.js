const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64b128439a51a5026a724892',
  };
  next();
});
app.use(router);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Application is running on port ${PORT}`));
