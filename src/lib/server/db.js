import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/sas-immo');
    console.log('✅ MongoDB local connecté');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
  }
}
