const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../db/queries');
const { 
  body, 
  matchedData, 
  validationResult 
} = require('express-validator');

exports.postSignup = [
  body('username').trim()
  .isLength({ min: 1}).escape().withMessage('Username is required.'),
  body('password')
  .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('confirmPassword')
  .custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match.');
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', { title: 'Sign Up', errors: errors.array()});
    }

    try {
      const hashedPw = await bcrypt.hash(req.body.password, 10);
      const data = matchedData(req);
      const newUser = await db.createUser(
        data.first_name, 
        data.last_name, 
        data.username, 
        hashedPw
      );
      req.login(newUser, (error) => {
        if (error) return next(error);
        return res.redirect('/');
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
});

exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  })
}