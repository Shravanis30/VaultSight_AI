const express = require('express');
const router = express.Router();
const { sendMoney, getProfile, getTransactions, getRecipients, raiseComplaint, updatePin } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/profile', getProfile);
router.post('/transfer', sendMoney);
router.get('/transactions', getTransactions);
router.get('/recipients', getRecipients);
router.post('/complaint', raiseComplaint);
router.post('/update-pin', updatePin);

module.exports = router;
