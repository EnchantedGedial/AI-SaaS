import mongoose,{Mongoose} from 'mongoose';
const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      // dbName: 'saas',
      dbName: 'imaginify',
      bufferCommands: false
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

module.exports = connectToDatabase;
