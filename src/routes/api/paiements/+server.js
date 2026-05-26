import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';

const Paiement = mongoose.models.Paiement || mongoose.model('Paiement', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String, methode: String, montant: Number, telephone: String,
  reference: String, statut: String
}, { timestamps: true }));

export async function GET({ cookies }) {
  try {
    let filter = {};
    
    // Si connecté, filtrer par utilisateur pour les vendeurs
    const token = cookies.get('token');
    if (token) {
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, 'dev-secret');
        // Super admin voit tout, vendeur voit ses paiements
        if (decoded.role !== 'super_admin' && decoded.role !== 'admin') {
          filter.user = decoded.userId;
        }
      } catch (e) {}
    }

    const paiements = await Paiement.find(filter)
      .populate('user', 'nom prenom email')
      .sort({ createdAt: -1 })
      .limit(50);

    return json({ paiements });
  } catch (error) {
    return json({ error: error.message, paiements: [] }, { status: 500 });
  }
}

export async function POST({ request, cookies }) {
  try {
    const data = await request.json();
    const paiement = await Paiement.create({
      ...data,
      reference: 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)
    });
    return json({ paiement }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
