const express = require('express');
const productsController = require('../controllers/productsController');
const contestController = require('../controllers/contestController');
const notificationsController = require('../controllers/notificationsController');
const feedbackController = require("../controllers/feedbackController");
const tutorialController = require('../controllers/tutorialController');
const transactionController = require('../controllers/transactionController');
const checkAdmin = require("../middleware/checkAdmin");
const authenticateJWT = require("../middleware/aunthenticateJWT");//working


const router = express.Router();
//saare admin routes par checkAdmin ki logic lageygi
//create product route
router.post('/addProduct',authenticateJWT,checkAdmin, productsController.addProduct);
//get all products
router.get('/getProducts',authenticateJWT,checkAdmin, productsController.getProducts);
//un-live product 
router.put('/unLiveProduct/:id',authenticateJWT,checkAdmin, productsController.unLiveProduct);
//Edit product
router.put('/editProduct/:id',authenticateJWT,checkAdmin,productsController.editProduct);
//yeh delete ki jagah put honi chahiye
router.delete('/removeProduct/:id', authenticateJWT,checkAdmin, productsController.removeProduct);
//create lottery
router.post('/addLottery',authenticateJWT,checkAdmin, contestController.createContest);
//edit lottery
router.put('/editLottery/:id',authenticateJWT,checkAdmin,contestController.editContest);
//select winner + unlive lottery //used to select winner
router.put('/endLottery/:id',authenticateJWT,checkAdmin, contestController.endContest);
//get lotteries
router.get('/getLottery',authenticateJWT,checkAdmin, contestController.getContest);
//delete lottery
router.delete('/deleteLottery/:id',authenticateJWT,checkAdmin, contestController.deleteContest)

router.put('/unLiveLottery/:id',authenticateJWT,checkAdmin,  contestController.unLiveContest);
//Create Notification
router.post('/notification/create',authenticateJWT,checkAdmin, notificationsController.createNotification);
//unlive notification
router.put('/notification/edit/:id',authenticateJWT,checkAdmin, notificationsController.unliveNotification);
//Get notification without is live property(user route mein is live check hoga)
router.get('/notification/get',authenticateJWT,checkAdmin, notificationsController.getNotification);
//delele notification
router.delete('/notification/delete/:id',authenticateJWT,checkAdmin, notificationsController.deleteNotification);
//get feedback
router.get('/getFeedback',authenticateJWT,checkAdmin,feedbackController.getFeedback);
//create Tutorials
router.post('/createTutorial',authenticateJWT,checkAdmin,tutorialController.createTutorial);
//get tutorials
router.get('/getTutorial',authenticateJWT,checkAdmin,tutorialController.getTutorial);
//delete tutorials
router.delete('/deleteTutorial/:id',authenticateJWT,checkAdmin,tutorialController.deleteTutorial);
//------------------TRANSACTIONS---------------------
//need another route just to get all transactions
router.get('/getAllTransactions',authenticateJWT,checkAdmin,transactionController.getAllTransactions);
router.put('/approveTransactions/:id',authenticateJWT,checkAdmin,transactionController.approveTransactions);





module.exports = router;