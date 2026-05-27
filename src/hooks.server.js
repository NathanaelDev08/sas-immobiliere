import mongoose from 'mongoose';
import './lib/server/models/User.js';
import './lib/server/models/Property.js';
import './lib/server/models/Notification.js';
import './lib/server/models/Paiement.js';
import './lib/server/models/Subscription.js';
import './lib/server/models/Transaction.js';
import './lib/server/models/Visite.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sasAdmin:SasImmo2026@cluster0.gumgfbu.mongodb.net/sas-immobiliere?retryWrites=true&w=majority';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 25000,
      connectTimeoutMS: 25000,
      socketTimeoutMS: 25000,
      bufferCommands: false
    }).then(m => { console.log('MongoDB connecte'); return m; })
      .catch(e => {
        cached.promise = null;
        console.error('MongoDB erreur:', e.message);
        throw e;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export const handle = async ({ event, resolve }) => {
  connectDB().catch(e => console.error('DB connection failed:', e.message));
  return resolve(event);
};
