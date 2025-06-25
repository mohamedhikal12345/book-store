var express = require('express');
const router = express.Router();

var storeController = require('../controller/store.controller');

router.get('/store', storeController.getStoreList);
router.post('/store/save', storeController.saveStore);


module.exports = router;