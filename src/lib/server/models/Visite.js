import mongoose from 'mongoose';

const visiteSchema = new mongoose.Schema({
  bien: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  client: {
    nom: String,
    email: String,
    phone: String
  },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateDemandee: { type: Date, required: true },
  heure: String,
  statut: {
    type: String,
    enum: ['demande', 'confirmee', 'effectuee', 'annulee'],
    default: 'demande'
  },
  notes: String,
  feedback: String
}, { timestamps: true });

export const Visite = mongoose.models.Visite || mongoose.model('Visite', visiteSchema);
