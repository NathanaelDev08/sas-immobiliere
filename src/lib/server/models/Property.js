import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  titre: String,
  description: String,
  type: String,
  transaction: String,
  prix: Number,
  surface: Number,
  pieces: Number,
  chambres: Number,
  douches: Number,
  standing: String,
  ville: String,
  quartier: String,
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  statut: String,
  vues: Number,
  contacts: Number,
  photos: [String]
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
export default Property;
export { Property };
