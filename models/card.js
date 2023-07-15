const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.ObjectId,
  }],
  // likes2: {
  //   type: [mongoose.ObjectId],
  // },
  // likes3: {
  //   type: mongoose.Schema.Types.Array,
  // },
  // likes4: {
  //   type: [
  //     {
  //       type: mongoose.ObjectId,
  //       ref: 'user',
  //     },
  //   ],
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
