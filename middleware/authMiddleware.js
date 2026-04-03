exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  res.redirect('/auth/login');
}

exports.isMember = (req, res, next) => {
  if (req.isAuthenticated() && req.user.membership_status) return next();
  
  const err = new Error('Forbidden: Members only.');
  err.statusCode = 403;
  next(err);
}

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) return next();

  const err = new Error('Forbidden: Admins only.');
  err.statusCode = 403;
  next(err);
}