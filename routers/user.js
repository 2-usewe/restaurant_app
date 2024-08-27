const express = require('express');
const userController = require('../controllers/userController');
const { userAuthenticate } = require('../middlewares/authenticateToken');
const userRouter = express.Router();

userRouter.post('/signup',userController.signup);
userRouter.post('/login',userController.login);
userRouter.post('/logout',userAuthenticate,userController.logout);

module.exports = userRouter