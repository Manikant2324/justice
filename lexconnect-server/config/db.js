require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/justicehub';

  try {
    // Attempt connection to MongoDB Atlas Cloud Cluster
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`[JusticeHub DB] Successfully connected to MongoDB Atlas Cloud Database at ${mongoURI.split('@')[1] || mongoURI}`);
  } catch (err) {
    console.log(`[JusticeHub DB] Remote MongoDB Atlas connection warning (${err.message}). Starting In-Memory Mongo Database Fallback...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryURI = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryURI);
      console.log(`[JusticeHub DB] Connected to In-Memory MongoDB Server at ${inMemoryURI}`);
    } catch (memErr) {
      console.error('[JusticeHub DB] Fatal Database Error:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
