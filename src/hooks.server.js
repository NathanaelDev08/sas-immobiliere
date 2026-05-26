import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sasAdmin:SasImmo2026@cluster0.gumgfbu.mongodb.net/sas-immobiliere?retryWrites=true&w=majority';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    }).then(m => {
      console.log('✅ MongoDB connecté');
      return m;
    }).catch(e => {
      console.error('❌ MongoDB erreur:', e.message);
      throw e;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export const handle = async ({ event, resolve }) => {
  try {
    await connectDB();
  } catch (e) {
    console.error('DB connection failed:', e.message);
  }
  return resolve(event);
};
