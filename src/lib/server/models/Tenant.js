import mongoose from 'mongoose';
const tenantSchema = new mongoose.Schema({}, { timestamps: true });
export default mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);
