const db = require('../db/queries');

exports.getHome = async (req, res, next) => {
  try {
    const messages = await db.getAllMessages();
    res.render('index', { title: 'The *** Club: Members Only', messages });
  } catch (error) {
    next(error);
  }
}

exports.getJoinClub = (req, res) => {
  res.render('join-club', { title: 'Join the Club' });
}

exports.postJoinClub =  async (req, res, next) => {
  const { passcode } = req.body;

  if (passcode === process.env.CLUB_PASSWORD) {
    try {
      await db.setMemberStatus(req.user.id);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  } else {
    res.render(
      'join-club', 
      { title: 'Join the Club', error: 'Wrong passcode' }
    );
  }
}