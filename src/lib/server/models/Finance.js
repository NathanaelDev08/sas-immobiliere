import mongoose from 'mongoose';

const schema = new mongoose.Schema({}, { timestamps: true });
const Finance = mongoose.models.Finance || mongoose.model('Finance', schema);
export default Finance;
export { Finance };
