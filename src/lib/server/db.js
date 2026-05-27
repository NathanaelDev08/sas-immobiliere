import mongoose from 'mongoose';
mongoose.set('bufferCommands', true);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sasAdmin:SasImmo2026@cluster0.gumgfbu.mongodb.net/sas-immobiliere?retryWrites=true&w=majority';
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };
export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000
    }).then(m => { console.log(' MongoDB connecté'); return m; });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
