const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../db/queries');
const { 
  body, 
  matchedData, 
  validationResult 
} = require('express-validator');
const CustomValidationError = require('../errors/CustomValidationError');

exports.getSignup = (_, res) => {
  return res.render('register', { title: 'The Club: Sign Up' });
}

exports.postSignup = [
  body('first_name')
  .optional({ values: 'falsy' })
  .trim()
  .isLength({ min: 1, max: 50 })
  .escape()
  .withMessage('First name should be between 1 and 50 characters.'),
  body('last_name')
  .optional({ values: 'falsy' })
  .trim()
  .isLength({ min: 1, max: 50 })
  .escape()
  .withMessage('Last name should be between 1 and 50 characters.'),
  body('username')
  .trim()
  .isLength({ min: 1, max: 50 })
  .escape()
  .withMessage('Username should be between 1 and 50 characters.')
  .custom(async (value) => {
    const user = await db.getUserByUsername(value);
    if (user) {
      throw new CustomValidationError('Username already in use.');
    }
  }),
  body('password')
  .isLength({ min: 6, max: 50 })
  .withMessage('Password must be between 6 and 50 characters.'),
  body('confirmPassword')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new CustomValidationError('Passwords do not match.')
    };
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render(
        'register', { 
          title: 'The Club: Sign Up', 
          errors: errors.array()
        }
      );
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

exports.getLogin = (_, res) => {
  return res.render('login', { title: 'The Club: Log In' });
}

exports.postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
});

exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
}