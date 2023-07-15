const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" – 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" — 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'поле "about" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "about" – 2 символа'],
    maxlength: [30, 'Максимальная длина поля "about" — 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'поле "avatar" должно быть заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
