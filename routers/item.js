const express = require('express');
const { userAuthenticate } = require('../middlewares/authenticateToken');
const itemController = require('../controllers/itemController');
const {uploadImage} = require('../middlewares/uploadFile');
const itemRouter = express.Router();
itemRouter.post('/create',userAuthenticate,uploadImage,itemController.itemCreate);
itemRouter.get('/get/:category_id',userAuthenticate,itemController.getItemByCategory);

module.exports = itemRouter