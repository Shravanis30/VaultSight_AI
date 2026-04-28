const cron = require('node-cron');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { autoLock } = require('./lockService');
const winston = require('winston');

const initCronJobs = () => {
  // Every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      winston.info('Running security scan cron job...');

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      // 1. Scan for users with 3+ FLAGGED transactions in the last hour
      const flaggedAgg = await Transaction.aggregate([
        { $match: { status: 'FLAGGED', createdAt: { $gte: oneHourAgo } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
        { $match: { count: { $gte: 3 } } }
      ]);

      for (const group of flaggedAgg) {
        await autoLock(group._id, 'Multiple flagged transactions (3+) in under an hour');
      }

      // 2. Ensure users with loginAttempts >= 5 are locked
      const vulnerableUsers = await User.find({ loginAttempts: { $gte: 5 }, isLocked: false });
      for (const user of vulnerableUsers) {
        await autoLock(user._id, 'Excessive failed login attempts (5+)');
      }

    } catch (error) {
      winston.error(`Cron error: ${error.message}`);
    }
  });

  // Daily summary at midnight
  cron.schedule('0 0 * * *', async () => {
    winston.info('Generating daily security summary...');
    // Implementation for daily alerts
  });
};

module.exports = initCronJobs;
