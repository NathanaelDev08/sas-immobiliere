import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema({}, { timestamps: true });
export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
