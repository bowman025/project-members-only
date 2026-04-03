const { Router } = require('express');
const { 
  getNewMessage, 
  postNewMessage, 
  getUserMessages,
  postDeleteMessage
} = require('../controllers/messageController');
const { 
  isAuthenticated, 
  isAdmin 
} = require('../middleware/authMiddleware');
const messageRouter = Router();


messageRouter.get('/my', isAuthenticated, getUserMessages);
messageRouter.get('/new', isAuthenticated, getNewMessage);
messageRouter.post('/new', isAuthenticated, postNewMessage);

messageRouter.post('/:messageId/delete', isAdmin, postDeleteMessage);

module.exports = messageRouter;