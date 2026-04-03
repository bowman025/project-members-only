const { Router } = require('express');
const { 
  postSignup, 
  postLogin, 
  getLogout 
} = require('../controllers/authController');
const { isGuest, isAuthenticated } = require('../middleware/authMiddleware');
const authRouter = Router();

authRouter.get('/register', isGuest,
  (req, res) => res.render('register', { title: 'Sign up' })
);
authRouter.post('/register', isGuest, postSignup);

authRouter.get('/login', isGuest,
  (req, res) => res.render('login', { title: 'Log In' })
);
authRouter.post('/login', isGuest, postLogin);

authRouter.get('/logout', isAuthenticated, getLogout);

module.exports = authRouter;