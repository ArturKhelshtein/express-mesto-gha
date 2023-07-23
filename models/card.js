const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" – 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" — 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'поле "link" должно быть заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.ObjectId,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
