import mongoose from 'mongoose';

const schema = new mongoose.Schema({}, { timestamps: true });
const Contract = mongoose.models.Contract || mongoose.model('Contract', schema);
export default Contract;
export { Contract };
