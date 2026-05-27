import mongoose from 'mongoose';
const financeSchema = new mongoose.Schema({}, { timestamps: true });
export default mongoose.models.Finance || mongoose.model('Finance', financeSchema);
