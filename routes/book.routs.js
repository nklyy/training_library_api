// Lib
const { Router } = require('express');

// Controllers
const BookController = require('../controller/book.controller');

const book = Router();

// Routs
book.get('/', BookController.getBooks);
book.get('/:id', BookController.getBook);

book.post('/', BookController.postBook);

book.put('/:id', BookController.updateBook);

book.delete('/:id', BookController.deleteBook);

module.exports = book;
