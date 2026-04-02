const db = require('../db/queries');
const { 
  body,
  matchedData,
  validationResult
} = require('express-validator');

exports.getHome = async (req, res, next) => {
  try {
    const messages = await db.getAllMessages();
    res.render('index', { title: 'The *** Club: Members Only', messages });
  } catch (error) {
    next(error);
  }
}

exports.getJoinClub = (req, res) => {
  res.render('joinClub', { title: 'Join the Club' });
}

exports.postJoinClub = [ 
  body('passcode')
  .trim()
  .isLength({ min: 1})
  .escape()
  .withMessage('Passcode is required.'),
    
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render(
        'joinClub',
        { title: 'Join the Club', errors: errors.array() } 
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
          title: 'Join the Club', 
          errors: [{msg: 'Incorrect passcode. Try again!' }] 
        }
      );
    }
  }
];