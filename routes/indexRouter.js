const { Router } = require('express');
const { 
  getHome, 
  getJoinClub, 
  postJoinClub,
  getBecomeAdmin,
  postBecomeAdmin
} = require('../controllers/indexController');
const { isAuthenticated, isMember } = require('../middleware/authMiddleware');
const indexRouter = Router();

indexRouter.get('/', getHome);

indexRouter.get('/join-club', isAuthenticated, getJoinClub);
indexRouter.post('/join-club', isAuthenticated, postJoinClub);

indexRouter.get('/become-admin', isAuthenticated, isMember, getBecomeAdmin);
indexRouter.post('/become-admin', isAuthenticated, isMember, getBecomeAdmin);


module.exports = indexRouter;