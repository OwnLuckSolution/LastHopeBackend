const express = require('express');
const authController = require('../controllers/authController');
const forgotPassword = require('../middleware/forgotPassword');
const passport = require('passport');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify',authController.verify)
router.get('/getUser',authController.getUser);
router.post('/forgotPassword',forgotPassword,authController.forgotPassword);
router.put('/changePasscode',authController.changePasscode);

//-----------------AUTH ROUTES-----------------
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://encouraging-lime-tick.cyclic.app/auth/login' }),
  function(req, res) {
    const token = req.user.token;
    console.log(`google callback route`,req.user.token);
    res.header('Authorization', `${token}`);
    req.additionalData = { example: 'Some additional data' };
    console.log(req.user.token,'google callback route 2');
    res.redirect('https://encouraging-lime-tick.cyclic.app/user/getProducts');
  }
);


//router.patch('/resetpassword/:token', authController.resetPassword);
//auth routes par aur almost saare routes par implement check login
module.exports = router;
