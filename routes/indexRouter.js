const { Router } = require('express');
const { 
  getHome, 
  getJoinClub, 
  postJoinClub,
  getBecomeAdmin,
  postBecomeAdmin
} = require('../controllers/indexController');
const { 
  isAuthenticated, 
  isMember,
  isNotMember,
  isNotAdmin
} = require('../middleware/authMiddleware');
const indexRouter = Router();

indexRouter.get('/', getHome);

indexRouter.get('/join-club', isAuthenticated, isNotMember, getJoinClub);
indexRouter.post('/join-club', isAuthenticated, isNotMember, postJoinClub);

indexRouter.get('/become-admin', isAuthenticated, isMember, isNotAdmin, getBecomeAdmin);
indexRouter.post('/become-admin', isAuthenticated, isMember, isNotAdmin, postBecomeAdmin);

module.exports = indexRouter;