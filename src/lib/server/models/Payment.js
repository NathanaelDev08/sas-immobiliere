import mongoose from 'mongoose';

const schema = new mongoose.Schema({}, { timestamps: true });
const Payment = mongoose.models.Payment || mongoose.model('Payment', schema);
export default Payment;
export { Payment };
