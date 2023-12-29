const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  var token = req.headers.authorization;
  if (token) {
      jwt.verify(token, 'lottery-app', (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        req.user = user;
        next();
      });
    } else {
      jwt.verify(req.user.token,'lottery-app',(err,user) =>{
        if(err){
          return res.status(403).json({error:"failed to authenticate token"})
        }
        req.user = user;
        next();
      } );
    }
};

module.exports = authenticateJWT;

  // console.log(`this is the req.headers.authorization ${req.headers.authorization}`);
  // console.log(`this is the req.user.token ${req.user.token}`);
  // var token = req.headers.authorization || req.user.token;
  // console.log(`this is the token in middleware${token}`)
  // if (token) {
  //   jwt.verify(token, 'lottery-app', (err, user) => {
  //     if (err) {
  //       return res.status(403).json({ error: 'Failed to authenticate token' });
  //     }
  //     req.user = user;
  //     next();
  //   });
  // } else {
  //   res.status(401).json({ error: 'No token provided' });
  // }

