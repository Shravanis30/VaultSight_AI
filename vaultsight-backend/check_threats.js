const mongoose = require('mongoose');
require('dotenv').config();
const Threat = require('./src/models/Threat');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const threats = await Threat.find().limit(10);
  console.log(`Found ${threats.length} threats`);
  
  threats.forEach(t => {
    console.log(`- Pattern: ${t.patternType}, Desc: ${t.description}`);
  });
  
  mongoose.disconnect();
};

run().catch(console.error);
