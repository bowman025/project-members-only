require('dotenv').config();

const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db/pool');
const passport = require('./config/passport');

const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const messageRouter = require('./routes/messageRouter');
const CustomNotFoundError = require('./errors/CustomNotFoundError');

const path = require('node:path');
const assetsPath = path.join(__dirname, 'public');

const app = express();

app.set('views', path.join(__dirname, '/views/pages'));
app.set('view engine', 'ejs');

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));
app.use(passport.session());
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);

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