import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'client' },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  photo: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  categorie: { type: String, default: 'particulier' },
  commission: { type: Number, default: 5 },
  maxBiens: { type: Number, default: 5 },
  biensCount: { type: Number, default: 0 }
});

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
