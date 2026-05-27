import mongoose from 'mongoose';
const contractSchema = new mongoose.Schema({}, { timestamps: true });
export default mongoose.models.Contract || mongoose.model('Contract', contractSchema);
