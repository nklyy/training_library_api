const { Schema, model } = require('mongoose');

const setBookModel = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50,
  },
  author: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  date: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  image: {
    type: String,
    required: true,
    match: [/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|png|svg))/, 'Incorrect url'],
  },
});

const BookModel = model('book', setBookModel);

module.exports = BookModel;

BookModel.createIndexes();
