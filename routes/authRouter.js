const { Router } = require('express');
const { 
  postSignup, 
  postLogin, 
  getLogout 
} = require('../controllers/authController');
const authRouter = Router();

authRouter.get('/register', 
  (req, res) => res.render('register', { title: 'Sign up' })
);
authRouter.post('/register', postSignup);

authRouter.get('/login', 
  (req, res) => res.render('login', { title: 'Log In' })
);
authRouter.post('/login', postLogin);

authRouter.get('/logout', getLogout);

module.exports = authRouter;