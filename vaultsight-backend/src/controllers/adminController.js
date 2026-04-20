const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Alert = require('../models/Alert');
const Threat = require('../models/Threat');
const LoginLog = require('../models/LoginLog');
const { manualUnlock } = require('../services/lockService');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    const safeUsers = users.map(u => u.toSafeObject());
    res.status(200).json({ success: true, data: safeUsers });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, mobile, address, balance, customPassword, upiPin: providedUpiPin } = req.body;
    
    // Auto-generate
    const accountNumber = 'VS' + Math.floor(Math.random() * 9000000000 + 1000000000);
    const upiId = name.toLowerCase().replace(' ', '') + '@vaultsight';
    const username = name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 9000 + 1000);
    const password = customPassword || Math.random().toString(36).slice(-8); 
    const upiPin = providedUpiPin || Math.floor(100000 + Math.random() * 900000).toString();
    
    // Debit card
    const cardNumber = Math.floor(Math.random() * 9000000000000000 + 1000000000000000).toString();
    const expiryMonth = Math.floor(Math.random() * 12) + 1;
    const expiryYear = 2029;
    const cvv = Math.floor(Math.random() * 900 + 100).toString();

    const newUser = new User({
      name, mobile, address, accountNumber, upiId, username, password, upiPin,
      balance: balance || Math.floor(Math.random() * 490000 + 10000),
      debitCard: { cardNumber, expiryMonth, expiryYear, cvv }
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        ...newUser.toSafeObject(),
        generatedCredentials: { username, password, upiPin }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const lockedUsers = await User.countDocuments({ isLocked: true });
    
    const totalTransactions = await Transaction.countDocuments();
    const flaggedTransactions = await Transaction.countDocuments({ status: 'FLAGGED' });
    
    const volume = await Transaction.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const recentAlerts = await Alert.find().sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalUsers, activeUsers: totalUsers - blockedUsers - lockedUsers, 
        blockedUsers, lockedUsers,
        totalTransactions, flaggedTransactions,
        totalTransactionVolume: volume[0] ? volume[0].total : 0,
        recentAlerts
      }
    });
  } catch (error) {
    next(error);
  }
};

const unlockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;
    const user = await manualUnlock(userId, adminId);
    if (!user) {
       return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'Account unlocked successfully' });
  } catch (error) {
    next(error);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    const txns = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: txns });
  } catch (error) {
    next(error);
  }
};

const getLoginLogs = async (req, res, next) => {
  try {
    const logs = await LoginLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

const lockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.isLocked = true;
    user.lockReason = reason || 'Manual SOC Protocol Execution';
    user.lockedAt = new Date();
    await user.save();

    const alert = new Alert({
      alertId: 'AL' + Date.now(),
      type: 'MANUAL_LOCK',
      severity: 'HIGH',
      message: `Account manually locked: ${user.lockReason}`,
      affectedUserId: userId,
      acknowledgedBy: adminId,
      isAcknowledged: true
    });
    await alert.save();

    res.status(200).json({ success: true, message: 'Account locked successfully' });
  } catch (error) {
    next(error);
  }
};

const updateTransactionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const txn = await Transaction.findById(id);
    if (!txn) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    txn.status = status;
    await txn.save();

    res.status(200).json({ success: true, message: `Transaction status updated to ${status}`, data: txn });
  } catch (error) {
    next(error);
  }
};

const issueCard = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    if (!user.debitCard || !user.debitCard.cardNumber) {
      const cardNumber = Math.floor(Math.random() * 9000000000000000 + 1000000000000000).toString();
      const expiryMonth = Math.floor(Math.random() * 12) + 1;
      const expiryYear = 2029;
      const cvv = Math.floor(Math.random() * 900 + 100).toString();
      const cardPin = Math.floor(1000 + Math.random() * 9000).toString();
      
      user.debitCard = {
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        cardPin,
        isIssued: true
      };
    } else {
      user.debitCard.isIssued = true;
      if (!user.debitCard.cardPin) {
        user.debitCard.cardPin = Math.floor(1000 + Math.random() * 9000).toString();
      }
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Debit card issued successfully', data: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, registerUser, getStats, unlockUser, lockUser, getAllTransactions, getLoginLogs, updateTransactionStatus, issueCard };
