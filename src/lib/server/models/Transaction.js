import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  bien: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  client: {
    nom: String,
    email: String,
    phone: String,
    message: String
  },
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['vente', 'location'],
    required: true
  },
  montant: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  commissionPourcentage: { type: Number, default: 5 },
  statut: {
    type: String,
    enum: ['contact', 'negociation', 'visite', 'accord', 'finalise', 'annule'],
    default: 'contact'
  },
  notes: String,
  dateFinalisation: Date
}, { timestamps: true });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
