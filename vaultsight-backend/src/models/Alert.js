const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['ACCOUNT_LOCKED', 'FRAUD_DETECTED', 'SUSPICIOUS_LOGIN', 'HIGH_RISK_TRANSACTION', 'BRUTE_FORCE', 'AUTO_LOCK', 'MANUAL_LOCK', 'NEURAL_CONTAINMENT'],
    required: true
  },

  severity: { type: String, enum: ['INFO', 'WARNING', 'HIGH', 'CRITICAL'], required: true },
  message: { type: String, required: true },
  affectedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  relatedThreatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Threat' },
  isRead: { type: Boolean, default: false },
  isAcknowledged: { type: Boolean, default: false },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
