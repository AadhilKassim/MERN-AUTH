const express = require('express');
const { getUserData } = require('../controller/userController');
const userAuth = require('../middleware/userAuth');
const e = require('express');
const userRouter = express.Router();

userRouter.post('/getuserdata',userAuth, getUserData);

module.exports = userRouter;