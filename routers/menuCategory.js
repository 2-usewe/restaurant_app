const express = require('express');
const menuCategoryController = require('../controllers/menuCategoryController');
const { userAuthenticate } = require('../middlewares/authenticateToken');
const categoryRouter = express.Router();

categoryRouter.post('/create',userAuthenticate,menuCategoryController.categoryCreate);
categoryRouter.get('/get',userAuthenticate,menuCategoryController.getCategory);

module.exports = categoryRouter