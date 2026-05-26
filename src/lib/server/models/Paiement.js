import mongoose from 'mongoose';

const paiementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['abonnement', 'commission'],
    required: true
  },
  methode: {
    type: String,
    enum: ['wave', 'orange_money', 'mtn_money', 'carte'],
    required: true
  },
  montant: { type: Number, required: true },
  devise: { type: String, default: 'XOF' },
  telephone: String,
  reference: String,
  statut: {
    type: String,
    enum: ['en_attente', 'complete', 'echoue', 'rembourse'],
    default: 'en_attente'
  },
  abonnement: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }
}, { timestamps: true });

export const Paiement = mongoose.models.Paiement || mongoose.model('Paiement', paiementSchema);
