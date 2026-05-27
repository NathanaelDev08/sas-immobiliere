import mongoose from 'mongoose';

const schema = new mongoose.Schema({}, { timestamps: true });
const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', schema);
export default Tenant;
export { Tenant };
