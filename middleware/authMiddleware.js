const CustomValidationError = require('../errors/CustomValidationError');

exports.isGuest = (req, res, next) => {
  if (!req.isAuthenticated()) return next();

  res.redirect('/');
}

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  res.redirect('/auth/login');
}

exports.isMember = (req, res, next) => {
  if (req.isAuthenticated() && req.user.membership_status) return next();
  
  res.redirect('/');
}

exports.isNotMember = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.membership_status) return next();

  res.redirect('/');
}

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) return next();

  const err = new CustomValidationError('Forbidden: Admins only.');
  err.statusCode = 403;
  next(err);
}

exports.isNotAdmin = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.is_admin) return next();

  res.redirect('/');
}