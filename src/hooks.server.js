import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sasAdmin:SasImmo2026@cluster0.gumgfbu.mongodb.net/sas-immobiliere?retryWrites=true&w=majority';

// Connexion unique pour toute l'application
mongoose.set('bufferCommands', true);
const mongoPromise = mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 60000,
  connectTimeoutMS: 60000,
  socketTimeoutMS: 90000,
})
.then(() => console.log('✅ Mongoose connecté'))
.catch((err) => console.error('❌ Mongoose échec:', err.message));

export const handle = async ({ event, resolve }) => {
  // Attendre que la connexion soit prête, avec un timeout global de 90s
  try {
    await mongoPromise;
  } catch (e) {
    console.error('❌ Impossible de se connecter à MongoDB:', e.message);
  }
  return resolve(event);
};
