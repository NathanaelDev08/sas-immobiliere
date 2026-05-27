import mongoose from 'mongoose';

mongoose.set('bufferCommands', true);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sasAdmin:SasImmo2026@cluster0.gumgfbu.mongodb.net/sas-immobiliere?retryWrites=true&w=majority';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectWithRetry() {
  const options = {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  };
  try {
    const m = await mongoose.connect(MONGODB_URI, options);
    console.log('✅ MongoDB connecté');
    return m;
  } catch (err) {
    console.error('❌ Échec connexion MongoDB:', err.message);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mongoose.connect(MONGODB_URI, options);
  }
}

export async function connectDB() {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = connectWithRetry();
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
