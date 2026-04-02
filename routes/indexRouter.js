const { Router } = require('express');
const { 
  getHome, 
  getJoinClub, 
  postJoinClub 
} = require('../controllers/indexController');
const indexRouter = Router();

indexRouter.get('/', getHome);
indexRouter.get('/join-club', getJoinClub);
indexRouter.post('/join-club', postJoinClub);

module.exports = indexRouter;