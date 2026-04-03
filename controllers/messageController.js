const db = require('../db/queries');
const { 
  body, 
  matchedData, 
  validationResult 
} = require('express-validator');

exports.getNewMessage = (req, res) => {
  if (!req.user) return res.redirect('/auth/login');
  res.render('newMessage', { title: 'Create New Message' });
}

exports.getUserMessages = async (req, res, next) => {
  try {
    const messages = await db.getMessagesByUser(req.user.id);
    res.render('userMessages', {
      title: 'My Messages',
      messages: messages,
    });
  } catch (error) {
    next(error);
  }
}

exports.postNewMessage = [
  body('title')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Title is required'),
  body('text')
  .trim()
  .isLength({ min: 1})
  .escape()
  .withMessage('Message text is required'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('newMessage', {
        title: 'Create New Message',
        errors: errors.array(),
        message: req.body,
      });
    }
    try {
      const data = matchedData(req);
      await db.createMessage(
        data.title, 
        data.text,
        req.user.id,
      );
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }
];

exports.postDeleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    await db.deleteMessage(messageId);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
}