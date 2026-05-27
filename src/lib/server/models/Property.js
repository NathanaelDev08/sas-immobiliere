import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  type:        { type: String, enum: ['Appartement', 'Villa', 'Terrain', 'Bureau', 'Commerce'], required: true },
  transaction: { type: String, enum: ['Vente', 'Location'], required: true },
  status:      { type: String, enum: ['Brouillon', 'Publié', 'Vendu', 'Loué'], default: 'Brouillon' },
  price:       { type: Number, required: true },
  city:        { type: String, required: true },
  address:     { type: String },
  area:        { type: Number },
  rooms:       { type: Number },
  images:      [{ type: String }],
  views:       { type: Number, default: 0 },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model('Property', propertySchema);
