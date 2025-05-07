const express = require('express');
const route = express.Router();
const apiController = require('../controllers/apiController');

route.get('/chats', apiController.getChats)
route.post('/chat', apiController.sendMessage);
route.post('/chats/new', apiController.createNewChat);

module.exports = route;