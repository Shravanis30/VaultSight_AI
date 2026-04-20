const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  upiId: { type: String, required: true, unique: true },
  debitCard: {
    cardNumber: { type: String, required: true },
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    cvv: { type: String, required: true }, // Not returned in API
    cardLimit: { type: Number, default: 100000 },
    isBlocked: { type: Boolean, default: false },
    isIssued: { type: Boolean, default: false }
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  balance: { type: Number, default: 50000 },
  role: { type: String, enum: ['user', 'admin', 'soc'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  lockReason: { type: String },
  lockedAt: { type: Date },
  riskScore: { type: Number, default: 0 },
  loginAttempts: { type: Number, default: 0 },
  lastLoginAt: { type: Date },
  lastLoginIp: { type: String },
  lastLoginDevice: { type: String },
    lastLoginLocation: { type: String },
    upiPin: { type: String, required: false }
  }, { timestamps: true });
  
  // Hash password and UPI PIN before saving
  userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    if (this.isModified('upiPin')) {
      const salt = await bcrypt.genSalt(12);
      this.upiPin = await bcrypt.hash(this.upiPin, salt);
    }
    next();
  });
  
  // Compare password
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
  // Compare UPI PIN
  userSchema.methods.compareUpiPin = async function(candidatePin) {
    return await bcrypt.compare(candidatePin, this.upiPin);
  };
  
  // Safe object for API responses
  userSchema.methods.toSafeObject = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.upiPin;
    if (obj.debitCard) {
      delete obj.debitCard.cvv;
      // Mask card number: XXXX XXXX XXXX 1234
    if (obj.debitCard.cardNumber) {
      obj.debitCard.cardNumber = `XXXX XXXX XXXX ${obj.debitCard.cardNumber.slice(-4)}`;
    }
  }
  return obj;
};

module.exports = mongoose.model('User', userSchema);
