import mongoose from 'mongoose';

const schema = new mongoose.Schema({}, { timestamps: true });
const Visit = mongoose.models.Visit || mongoose.model('Visit', schema);
export default Visit;
export { Visit };
