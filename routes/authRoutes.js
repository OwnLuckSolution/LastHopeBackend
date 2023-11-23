const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
//router.post('/forgotpassword', authController.forgotPassword);
router.post('/verify',authController.verify)
router.get('/getUser',authController.getUser);
//router.patch('/resetpassword/:token', authController.resetPassword);
//auth routes par aur almost saare routes par implement check login
module.exports = router;
