require('dotenv').config();

const express = require('express');
const { format, formatDistanceToNow } = require('date-fns');
const passport = require('./config/passport');
const sessionConfig = require('./config/session');
const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const messageRouter = require('./routes/messageRouter');
const CustomNotFoundError = require('./errors/CustomNotFoundError');

const path = require('node:path');
const assetsPath = path.join(__dirname, 'public');

const app = express();

app.set('views', path.join(__dirname, '/views/pages'));
app.set('view engine', 'ejs');

app.use(sessionConfig);
app.use(passport.session());
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.formatRelativeDate = (date) => {
    return formatDistanceToNow(new Date(date), {addSuffix: true});
  };
  res.locals.formatExactDate = (date) => {
    return format(new Date(date), "PPP 'at' p");
  }
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/messages', messageRouter);

app.use((req, res, next) => {
  console.log("Unmatched URL:", req.url);
  next(new CustomNotFoundError('Page Not Found.'));
});
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).render('error', {
    title: 'The *** Club: Error',
    message: err.message,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening...`);
});