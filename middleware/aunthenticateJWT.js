const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, 'lottery-app', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'No token provided' });
  }
};

module.exports = authenticateJWT;
