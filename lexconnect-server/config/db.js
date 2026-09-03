require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (mongoURI) {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 15000
      });
      console.log(`[JusticeHub DB] Successfully connected to MongoDB Atlas Cloud Database`);
      return;
    } catch (err) {
      console.error(`[JusticeHub DB] MongoDB Atlas connection failed (${err.message}).`);
    }
  } else {
    console.warn('[JusticeHub DB] MONGODB_URI environment variable is not defined.');
  }

  // If on Production / Render, fail fast with a clear diagnostic message
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    console.error('[JusticeHub DB] FATAL: Production database connection failed.');
    console.error('[JusticeHub DB] Please check:');
    console.error('  1. MONGODB_URI environment variable is set in Render settings.');
    console.error('  2. MongoDB Atlas Network Access allows 0.0.0.0/0 (Access from Anywhere).');
    process.exit(1);
  }

  // Development Fallback: In-Memory Mongo Database with explicit version >= 7.0.3 for Debian 12 compatibility
  console.log('[JusticeHub DB] Starting In-Memory Mongo Database Fallback for local development...');
  try {
    mongoMemoryServer = await MongoMemoryServer.create({
      binary: { version: '7.0.3' }
    });
    const inMemoryURI = mongoMemoryServer.getUri();
    await mongoose.connect(inMemoryURI);
    console.log(`[JusticeHub DB] Connected to In-Memory MongoDB Server at ${inMemoryURI}`);
  } catch (memErr) {
    console.error('[JusticeHub DB] Fatal In-Memory Database Error:', memErr);
    process.exit(1);
  }
};

module.exports = connectDB;

