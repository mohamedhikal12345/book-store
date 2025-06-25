var express = require('express');
const router = express.Router();

var bookController = require('../controller/book.controller');

router.get('/books', bookController.getBookList);
router.get('/books/details/:bookId', bookController.getBookDetails);
router.post('/books/save', bookController.saveBook);
router.put('/books/update', bookController.updateBook);
router.delete('/books/delete/:bookId', bookController.deleteBook);

module.exports = router;