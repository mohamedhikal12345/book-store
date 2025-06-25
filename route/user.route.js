var express = require('express');
const router = express.Router();


var userController = require('../controller/user.controller');

router.get('/users', userController.getUserList);
router.post('/users/save' , userController.saveUser);

module.exports = router;