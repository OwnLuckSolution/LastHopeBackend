const express = require('express');
const notificationsController = require('../controllers/notificationsController');
const authController = require('../controllers/authController');
const contestController = require('../controllers/contestController');
const productsController = require('../controllers/productsController');
const feedbackController = require('../controllers/feedbackController');
const tutorialController = require('../controllers/tutorialController');
const transactionController = require('../controllers/transactionController');
const authenticateJWT = require('../middleware/aunthenticateJWT');
const investmentController = require('../controllers/investmentController');

const router = express.Router();

//basit bhai yahan to saara data ayega usko filter karna hai?
router.put('/editUser',authenticateJWT,authController.editUser);
router.get('/getProducts',authenticateJWT,productsController.getProducts);
router.get('/getNotifications',authenticateJWT,notificationsController.getNotification);
router.get('/getContests',authenticateJWT,contestController.getContest);
router.post('/buyContest/:id',authenticateJWT,contestController.buyContest);
router.post('/feedback',authenticateJWT,feedbackController.createFeedback);
router.get('/getTutorial',authenticateJWT,tutorialController.getTutorial);
router.post('/deposit',authenticateJWT,transactionController.deposit);
router.post('/withdraw',authenticateJWT,transactionController.withdraw);
router.post('/buyProduct/:id',authenticateJWT,productsController.buyProduct);
router.get('/getUserTransaction',authenticateJWT,transactionController.getUserTransactions);
router.post('/investment/create',authenticateJWT,investmentController.addInvestment);
router.get('/investment/get',authenticateJWT,investmentController.calculateInvestment)
router.post('/investment/withdraw/:id',authenticateJWT,investmentController.withdrawInvestment);

module.exports = router;