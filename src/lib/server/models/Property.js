import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['residentiel', 'commercial', 'terrain', 'vehicule', 'autre'],
    required: true
  },
  transaction: {
    type: String,
    enum: ['vente', 'location', 'les_deux'],
    required: true
  },
  prix: { type: Number, required: true },
  devise: { type: String, default: 'XOF' },
  surface: Number,
  pieces: Number,
  standing: String,
  ville: { type: String, required: true },
  quartier: String,
  coordonnees: {
    lat: Number,
    lng: Number
  },
  photos: [String],
  documents: [{
    nom: String,
    url: String
  }],
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statut: {
    type: String,
    enum: ['brouillon', 'en_attente', 'publie', 'vendu', 'loue'],
    default: 'brouillon'
  },
  featured: { type: Boolean, default: false },
  vues: { type: Number, default: 0 },
  contacts: { type: Number, default: 0 }
}, { timestamps: true });

propertySchema.index({ type: 1, statut: 1 });
propertySchema.index({ ville: 1, prix: 1 });
propertySchema.index({ proprietaire: 1 });

export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
