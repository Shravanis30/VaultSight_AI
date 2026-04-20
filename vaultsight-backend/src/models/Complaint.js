const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'PENDING' },
  category: { type: String, default: 'General' },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
