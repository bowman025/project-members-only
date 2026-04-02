const { Router } = require('express');
const { 
  getNewMessage, 
  postNewMessage 
} = require('../controllers/messageController');
const messageRouter = Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

messageRouter.get('/new', isAuthenticated, getNewMessage);
messageRouter.post('/new', isAuthenticated, postNewMessage);

module.exports = messageRouter;