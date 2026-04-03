const db = require('../db/queries');
const { 
  body,
  matchedData,
  validationResult
} = require('express-validator');

exports.getHome = async (req, res, next) => {
  try {
    const messages = await db.getAllMessages();
    res.render('index', { title: 'The Club: Members Only', messages });
  } catch (error) {
    next(error);
  }
}

exports.getJoinClub = (req, res) => {
  res.render('joinClub', { title: 'Join The Club' });
}

exports.postJoinClub = [ 
  body('passcode')
  .trim()
  .isLength({ min: 1, max: 50 })
  .escape()
  .withMessage('Your answer should be between 1 and 50 characters.'),
    
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render(
        'joinClub',
        { title: 'Join The Club', errors: errors.array() } 
      );
    }
    const data = matchedData(req);
    const { passcode } = data;
    const CLUB_SECRET = process.env.CLUB_PASSWORD;

    if (passcode === CLUB_SECRET) {
      try {
        await db.updateMemberStatus(req.user.id);
        res.redirect('/');
      } catch (error) {
        next(error);
      }
    } else {
      res.render(
        'joinClub', 
        { 
          title: 'Join The Club', 
          errors: [{msg: 'Incorrect answer. Try again!' }]
        }
      );
    }
  }
];

exports.getBecomeAdmin = (req, res) => {
  res.render('becomeAdmin', { title: 'The Club: Become Admin' });
}

exports.postBecomeAdmin = [
  body('adminPasscode')
  .trim()
  .isLength({ min: 1, max: 50 })
  .escape()
  .withMessage('Passcode should be between 1 and 50 characters.'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render(
        'becomeAdmin', 
        {
          title: 'The Club: Become Admin',
          errors: errors.array(),
        }
      );
    }

    const { adminPasscode } = matchedData(req);
    if (adminPasscode === process.env.ADMIN_PASSWORD) {
      try {
        await db.promoteToAdmin(req.user.id);
        res.redirect('/');
      } catch (error) {
        next(error);
      }
    } else {
      res.render(
        'becomeAdmin', 
        {
          title: 'The Club: Become Admin',
          errors: [{ msg: 'Incorrect admin passcode. Try again!' }]
        }
      );
    }
  }
];