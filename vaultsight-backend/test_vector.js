const mongoose = require('mongoose');
require('dotenv').config();
require('./src/models/User'); // Register User
const { searchSimilarThreats } = require('./src/services/vectorService');
const { generateEmbedding } = require('./src/services/embeddingService');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  const query = "Unusual login";
  const embedding = await generateEmbedding(query);
  console.log('Generated embedding length:', embedding?.length);
  
  if (embedding) {
    const results = await searchSimilarThreats(embedding, 5);
    console.log('Results count:', results.length);
    if (results.length > 0) {
      console.log('Top result similarity:', results[0].similarityScore);
      console.log('Top result user:', results[0].user?.name);
    }
  }
  
  mongoose.disconnect();
};

run().catch(console.error);
