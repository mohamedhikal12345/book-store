var express = require('express');
const router = express.Router();

var userController = require('../book.controller/user');

router.get('/users', userController.getBookList);


module.exports = router;