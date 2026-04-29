const mongoose = require('mongoose');
require('dotenv').config();
const Transaction = require('./src/models/Transaction');
const User = require('./src/models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const allTxns = await Transaction.find().populate('userId receiverId');
  console.log(`Found ${allTxns.length} total transactions`);
  
  for (const txn of allTxns) {
    console.log(`ID: ${txn._id}, Status: ${txn.status}, Amount: ${txn.amount}, Sender: ${txn.userId?.name} (Bal: ${txn.userId?.balance}), Receiver: ${txn.receiverId?.name}`);
  }
  
  mongoose.disconnect();
};

run().catch(console.error);
