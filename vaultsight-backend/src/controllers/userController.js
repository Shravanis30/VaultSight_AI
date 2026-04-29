const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Threat = require('../models/Threat');
const { calculateRiskScore } = require('../utils/riskScorer');
const { autoLock } = require('../services/lockService');
const { createAlert } = require('../services/alertService');
const { generateEmbedding } = require('../services/embeddingService');
const Complaint = require('../models/Complaint');

const sendMoney = async (req, res, next) => {
  try {
    const { receiverUpiId, receiverAccountNumber, amount, note, device, location, upiPin } = req.body;
    const sender = req.user;

    if (sender.isBlocked || sender.isLocked) {
      return res.status(403).json({ success: false, error: 'Account is restricted' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    if (!upiPin) {
      return res.status(400).json({ success: false, error: 'UPI PIN is required' });
    }

    // Step 1: Find receiver
    const receiver = await User.findOne({
      $or: [{ upiId: receiverUpiId }, { accountNumber: receiverAccountNumber }]
    });

    if (!receiver) {
      return res.status(404).json({ success: false, error: 'Recipient not found' });
    }

    if (sender._id.toString() === receiver._id.toString()) {
        return res.status(400).json({ success: false, error: 'Cannot send money to yourself' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' });
    }

    // Step 1.5: Verify PIN
    const isCorrectPin = await sender.compareUpiPin(upiPin);
    
    // Step 2: Risk Scoring
    // Check for previous transactions to this receiver
    const previousTxn = await Transaction.findOne({ userId: sender._id, receiverId: receiver._id });
    
    const riskInput = {
      amount,
      isNewDevice: device !== sender.lastLoginDevice,
      isNewLocation: location !== sender.lastLoginLocation,
      timestamp: new Date(),
      isNewBeneficiary: !previousTxn,
      isWrongPin: !isCorrectPin
    };
    
    const { score, level, flags } = calculateRiskScore(riskInput, null, { hasHighThreats: sender.riskScore > 50 });

    // Step 3: Create transaction record
    const txnId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
    const transaction = new Transaction({
      transactionId: txnId,
      userId: sender._id,
      receiverId: receiver._id,
      receiverUpiId: receiver.upiId,
      receiverAccountNumber: receiver.accountNumber,
      amount,
      type: 'send',
      note,
      location,
      device,
      ipAddress: req.ip,
      riskScore: score,
      riskLevel: level,
      riskFlags: flags,
      status: 'PENDING'
    });

    // Step 4: High Risk Handling & Auto-Lock Logic
    const riskThreshold = Number(process.env.AUTO_LOCK_RISK_THRESHOLD) || 70;
    const amountThreshold = Number(process.env.AUTO_LOCK_AMOUNT_THRESHOLD) || 500000;
    const shouldLock = score > riskThreshold || amount > amountThreshold;

    if (level === 'HIGH' || level === 'CRITICAL' || shouldLock) {
      const description = `${isCorrectPin ? 'High-risk transfer' : 'Suspicious failed attempt'} of ₹${amount} to ${receiver.name} from ${device} in ${location}. Reason: ${flags.join(', ')}`;
      
      // Generate embedding for vector search
      let embedding = null;
      try {
        embedding = await generateEmbedding(description);
      } catch (err) {
        console.error('Embedding generation failed during auto-lock check:', err);
      }
      
      const threat = await Threat.create({
        threatId: 'TH' + Date.now(),
        description,
        embedding: embedding || Array(384).fill(0),
        riskLevel: level,
        riskScore: score,
        category: isCorrectPin ? 'HIGH_VALUE_TRANSFER' : 'SUSPICIOUS_ATTEMPT',
        affectedUserId: sender._id,
        relatedTransactionId: transaction._id,
        location,
        device,
        actionTaken: shouldLock ? 'LOCKED' : 'ALERTED'
      });

      await createAlert(
        shouldLock ? 'FRAUD_DETECTED' : 'HIGH_RISK_TRANSACTION',
        shouldLock ? 'CRITICAL' : 'HIGH',
        description,
        sender._id,
        transaction._id,
        threat._id
      );

      if (shouldLock) {
        await autoLock(sender._id, `Auto-locked due to high-risk patterns: ${score} risk points. Flags: ${flags.join(', ')}`);
        transaction.status = 'BLOCKED';
        await transaction.save();
        return res.status(403).json({ 
          success: false, 
          blocked: true, 
          error: 'Transaction blocked and account locked for security', 
          data: { score, level, flags } 
        });
      }

      transaction.status = 'FLAGGED';
    }

    // Step 5: Finalize Transaction (if not locked)
    // If PIN is wrong, we record the attempt (already flagged as threat above if needed) and block it
    if (!isCorrectPin) {
        transaction.status = 'FAILED';
        transaction.note = 'Failed UPI PIN verification';
        await transaction.save();
        
        return res.status(401).json({ 
            success: false, 
            error: 'Invalid UPI PIN', 
            data: { score, level, flags }
        });
    }

    const transferAmount = Number(amount);
    
    // Refresh sender and receiver to be safe
    const latestSender = await User.findById(sender._id);
    const latestReceiver = await User.findById(receiver._id);

    latestSender.balance -= transferAmount;
    latestReceiver.balance += transferAmount;
    transaction.status = transaction.status === 'FLAGGED' ? 'FLAGGED' : 'COMPLETED';

    await latestSender.save();
    await latestReceiver.save();
    await transaction.save();

    res.status(200).json({ 
      success: true, 
      message: transaction.status === 'FLAGGED' ? 'Transaction completed but flagged for review' : 'Money sent successfully',
      data: transaction 
    });

  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({ success: true, data: req.user.toSafeObject() });
};

const getTransactions = async (req, res, next) => {
  try {
    const txns = await Transaction.find({ 
      $or: [{ userId: req.user._id }, { receiverId: req.user._id }] 
    })
    .populate('userId', 'name upiId')
    .populate('receiverId', 'name upiId')
    .sort({ createdAt: -1 });
    
    const formattedTxns = txns.map(t => {
      const isSender = t.userId._id.toString() === req.user._id.toString();
      return {
        ...t.toObject(),
        type: isSender ? 'send' : 'receive',
        displayIdentity: isSender ? (t.receiverId ? t.receiverId.name : t.receiverUpiId) : (t.userId ? t.userId.name : 'Unknown Sender')
      };
    });

    res.status(200).json({ success: true, data: formattedTxns });
  } catch (error) {
    next(error);
  }
};

const getRecipients = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user', _id: { $ne: req.user._id } })
            .select('name upiId accountNumber balance');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

const raiseComplaint = async (req, res, next) => {
    try {
        const { subject, description, transactionId } = req.body;
        const complaint = new Complaint({
            complaintId: 'CMP' + Date.now(),
            userId: req.user._id,
            subject,
            description,
            transactionId
        });
        await complaint.save();
        res.status(201).json({ success: true, message: 'Complaint registered successfully', data: complaint });
    } catch (error) {
        next(error);
    }
};

const updatePin = async (req, res, next) => {
    try {
        const { oldPin, newPin } = req.body;
        const user = await User.findById(req.user._id);

        const isCorrect = await user.compareUpiPin(oldPin);
        if (!isCorrect) {
            return res.status(401).json({ success: false, error: 'Incorrect current PIN' });
        }

        user.upiPin = newPin;
        await user.save();

        res.status(200).json({ success: true, message: 'UPI PIN updated successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    sendMoney, 
    getProfile, 
    getTransactions, 
    getRecipients, 
    raiseComplaint,
    updatePin
};
