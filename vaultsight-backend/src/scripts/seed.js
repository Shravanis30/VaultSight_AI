const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Threat = require('../models/Threat');
const Alert = require('../models/Alert');
const LoginLog = require('../models/LoginLog');
const { generateEmbedding } = require('../services/embeddingService');

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to ${conn.connection.host} for seeding...`);

    // Clear collections
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Threat.deleteMany({});
    await Alert.deleteMany({});
    await LoginLog.deleteMany({});

    console.log('Collections cleared.');

    // 1. Create Admin
    const admin = new User({
      name: 'VaultSight Admin',
      mobile: '0000000000',
      address: 'Security Operations Center',
      accountNumber: 'VS0000000000',
      upiId: 'admin@vaultsight',
      username: 'admin',
      password: 'Admin@123',
      role: 'admin',
      debitCard: {
        cardNumber: '0000000000000000',
        expiryMonth: 12,
        expiryYear: 2030,
        cvv: '000'
      }
    });
    await admin.save();
    console.log('Admin user created.');

    // 2. Create Users
    const userNames = ['Rahul Sharma', 'Priya Mehta', 'Amit Patel', 'Sneha Joshi', 'Rajan Nair'];
    const users = [];

    for (const name of userNames) {
      const username = name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 900 + 100);
      const user = new User({
        name,
        mobile: Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
        address: 'India',
        accountNumber: 'VS' + Math.floor(Math.random() * 9000000000 + 1000000000),
        upiId: name.toLowerCase().replace(' ', '') + '@vaultsight',
        username,
        password: 'Password@123',
        balance: Math.floor(Math.random() * 490000 + 10000),
        isLocked: name === 'Priya Mehta', // Set Priya as locked for demo
        lockReason: name === 'Priya Mehta' ? 'Unusual transaction history' : null,
        lockedAt: name === 'Priya Mehta' ? new Date() : null,
        debitCard: {
          cardNumber: Math.floor(Math.random() * 9000000000000000 + 1000000000000000).toString(),
          expiryMonth: 1,
          expiryYear: 2029,
          cvv: '123'
        }
      });
      await user.save();
      users.push(user);
    }
    console.log('Demo users created.');

    // 3. Create Threats with REAL descriptions & embeddings
    const threatDescriptions = [
      "Unauthorized transfer of Rs 150000 to unknown account from new mobile device in Rajasthan",
      "Multiple failed login attempts from different IPs followed by successful login from Kolkata",
      "UPI transfer to new beneficiary exceeding weekly limit at 2am",
      "Large cash withdrawal from ATM followed by immediate online transfer",
      "Login from a device that has never accessed this account before in a foreign location",
      "Three transactions within 60 seconds to different beneficiaries totaling Rs 200000",
      "Account accessed from Tor network or VPN with high-value transaction",
      "Debit card used simultaneously in two different cities"
    ];

    for (const desc of threatDescriptions) {
      // Mock or call python service
      const embedding = await generateEmbedding(desc);

      const threat = new Threat({
        threatId: 'TH' + Math.floor(Math.random() * 1000000),
        description: desc,
        embedding: embedding || Array(384).fill(0),
        riskLevel: desc.includes('150000') || desc.includes('VPN') ? 'CRITICAL' : 'HIGH',
        riskScore: desc.includes('150000') || desc.includes('VPN') ? 92 : 78,
        category: desc.includes('transfer') ? 'HIGH_VALUE_TRANSFER' : 'UNUSUAL_PATTERN',
        affectedUserId: users[Math.floor(Math.random() * users.length)]._id,
        actionTaken: 'ALERTED'
      });
      await threat.save();
    }
    console.log('Threat intelligence data seeded.');

    console.log('Seeding completed successfully.');
    process.exit(0);

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
