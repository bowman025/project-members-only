const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('../db/pool');

const sessionConfig = session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
});

module.exports = sessionConfig;