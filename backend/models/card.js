const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, //  т.к. тут ссылка на автора объявления
    ref: 'user', // то тут имя модели, на которую ссылаемся
    required: true,
  },
  likes: {
    // при этом возникает ошибка "TypeError: Cannot read properties of undefined (reading 'some')"
    // в src/components/Card/Card.js:20:
    // const isLiked = props.card.likes.some(i => i === currentUser._id);
    // НЕ нашла решение проблемы и понимание, почему так, не приходит

    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'user',
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
