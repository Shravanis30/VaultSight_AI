const mongoose = require('mongoose');
require('dotenv').config();

async function checkDB() {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');
    
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Databases:', dbs.databases.map(d => d.name));
    
    const currentDb = mongoose.connection.db.databaseName;
    console.log('Current DB:', currentDb);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in current DB:', collections.map(c => c.name));
    
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(` - ${coll.name}: ${count} documents`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkDB();
