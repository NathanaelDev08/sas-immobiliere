import mongoose from 'mongoose';
const visitSchema = new mongoose.Schema({}, { timestamps: true });
export default mongoose.models.Visit || mongoose.model('Visit', visitSchema);
