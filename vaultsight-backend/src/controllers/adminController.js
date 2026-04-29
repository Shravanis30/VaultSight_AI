const winston = require('winston');
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
    const txns = await Transaction.find()
      .populate('userId', 'name email balance upiId isLocked')
      .populate('receiverId', 'name email upiId')
      .sort({ createdAt: -1 });
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

    await User.findByIdAndUpdate(userId, {
      isLocked: true,
      lockReason: reason || 'Manual SOC Protocol Execution',
      lockedAt: new Date()
    }, { runValidators: false });

    const alert = new Alert({
      alertId: 'AL' + Date.now(),
      type: 'MANUAL_LOCK',
      severity: 'HIGH',
      message: `Account manually locked: ${reason || 'Manual SOC Protocol Execution'}`,
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

    if (winston && winston.info) {
      winston.info(`Updating transaction ${id} status to ${status}. Current status: ${txn.status}`);
    } else {
      console.log(`Updating transaction ${id} status to ${status}. Current status: ${txn.status}`);
    }

    // If approving a previously blocked transaction, we need to process the funds
    if (status === 'COMPLETED' && txn.status === 'BLOCKED') {
      const sender = await User.findById(txn.userId);
      const receiver = await User.findById(txn.receiverId);

      if (!sender) {
        if (winston && winston.error) {
          winston.error(`Sender not found for transaction ${id}`);
        } else {
          console.error(`Sender not found for transaction ${id}`);
        }
        return res.status(404).json({ success: false, error: 'Sender account not found' });
      }
      if (!receiver) {
        if (winston && winston.error) {
          winston.error(`Receiver not found for transaction ${id}`);
        } else {
          console.error(`Receiver not found for transaction ${id}`);
        }
        return res.status(404).json({ success: false, error: 'Receiver account not found' });
      }

      if (sender.balance < txn.amount) {
      if (winston && winston.warn) {
         winston.warn(`Insufficient balance to authorize blocked transaction ${id}. Required: ${txn.amount}, Available: ${sender.balance}`);
      } else {
         console.warn(`Insufficient balance to authorize blocked transaction ${id}. Required: ${txn.amount}, Available: ${sender.balance}`);
      }
         return res.status(400).json({ success: false, error: 'Insufficient balance in sender account' });
      }

      sender.balance -= txn.amount;
      receiver.balance += txn.amount;

      await sender.save();
      await receiver.save();
      if (winston && winston.info) {
        winston.info(`Funds transferred for authorized transaction ${id}`);
      } else {
        console.log(`Funds transferred for authorized transaction ${id}`);
      }
    }

    txn.status = status;
    await txn.save();

    // Also close any associated threats for this transaction
    await Threat.updateMany({ relatedTransactionId: txn._id }, { status: 'CLOSED' });

    if (winston && winston.info) {
      winston.info(`Transaction ${id} status successfully updated to ${status} and associated threats closed.`);
    } else {
      console.log(`Transaction ${id} status successfully updated to ${status} and associated threats closed.`);
    }
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

const deleteLoginLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    await LoginLog.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Log entry cleared' });
  } catch (error) {
    next(error);
  }
};

const neutralizeUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found for this username' });
    }

    // Use findByIdAndUpdate to bypass full document validation in case some fields are missing in DB
    await User.findByIdAndUpdate(user._id, {
      isLocked: true,
      lockReason: 'SOC Neutralization: Suspected Brute Force / Unauthorized Access Attempt',
      lockedAt: new Date()
    }, { runValidators: false });

    // Create an alert
    try {
      const alert = new Alert({
        alertId: `AL-NC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'NEURAL_CONTAINMENT',
        severity: 'CRITICAL',
        message: `Account neutralized after login anomalies: @${username}`,
        affectedUserId: user._id,
        acknowledgedBy: req.user?._id,
        isAcknowledged: true
      });
      await alert.save();
    } catch (alertError) {
      console.error('Failed to create neutralization alert:', alertError);
      if (alertError.name === 'ValidationError') {
        console.error('Alert Validation Details:', alertError.errors);
      }
      // We still continue because the user IS locked in the DB
    }

    res.status(200).json({ success: true, message: `Account @${username} has been neutralized` });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    next(error);
  }
};

module.exports = { 
  getAllUsers, 
  registerUser, 
  getStats, 
  unlockUser, 
  lockUser, 
  getAllTransactions, 
  getLoginLogs, 
  updateTransactionStatus, 
  issueCard,
  deleteLoginLog,
  neutralizeUsername
};
