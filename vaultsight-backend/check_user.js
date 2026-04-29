const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const user = await User.findById('69e9d1d9591fdc9ac910fd71');
  if (user) {
    console.log(`User Found: ${user.name}, Balance: ${user.balance}, Locked: ${user.isLocked}`);
  } else {
    console.log('User not found');
  }
  
  mongoose.disconnect();
};

run().catch(console.error);
