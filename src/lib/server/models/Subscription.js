import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: {
    type: String,
    enum: ['gratuit', 'basic', 'pro', 'business'],
    default: 'gratuit'
  },
  prix: { type: Number, default: 0 },
  dateDebut: { type: Date, default: Date.now },
  dateFin: { type: Date },
  statut: {
    type: String,
    enum: ['actif', 'expire', 'annule'],
    default: 'actif'
  },
  maxBiens: { type: Number, default: 3 },
  commission: { type: Number, default: 5 }, // 5% de commission
  biensCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
