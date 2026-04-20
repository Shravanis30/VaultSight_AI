const express = require('express');
const router = express.Router();
const { getAllUsers, registerUser, getStats, unlockUser, lockUser, getAllTransactions, getLoginLogs, updateTransactionStatus, issueCard } = require('../controllers/adminController');
const { body } = require('express-validator');
const { verifyToken, verifyAdmin, verifySOC } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(verifyToken);

router.get('/stats', verifySOC, getStats);
router.get('/transactions', verifySOC, getAllTransactions);
router.post('/transactions/:id/status', verifySOC, updateTransactionStatus);
router.get('/logins', verifySOC, getLoginLogs);
router.get('/users', verifySOC, getAllUsers);
router.post('/lock/:userId', verifySOC, lockUser);

// The rest require admin specifically
router.use(verifyAdmin);

const registrationValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('mobile').isMobilePhone().withMessage('Valid mobile number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  validate
];

router.post('/register', verifyAdmin, registrationValidation, registerUser); 
router.post('/unlock/:userId', unlockUser);
router.post('/issue-card/:userId', issueCard);

module.exports = router;

