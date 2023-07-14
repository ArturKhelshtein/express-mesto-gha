const mongoose = require('mongoose');

const cardSchema = new mongoose.Shema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    require: true,
  },
  owner: {
    type: mongoose.ObjectId,
    require: true,
  },
  likes: {
    type: mongoose.ObjectId,
    require: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
