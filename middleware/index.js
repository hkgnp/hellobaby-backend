const jwt = require('jsonwebtoken');

const checkIfLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash(
      'error_messages',
      'This page is only accessible to registered users who have logged in'
    );
    res.redirect('back');
  }
};

const checkIfLoggedInJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
    res.send({
      error: 'Problems authenticating',
    });
  }
};

module.exports = { checkIfLoggedIn, checkIfLoggedInJWT };
