import { json } from '@sveltejs/kit';
const JWT_SECRET = process.env.JWT_SECRET || "MaCleSecrete2026";
import mongoose from 'mongoose';

const Visite = mongoose.models.Visite || mongoose.model('Visite', new mongoose.Schema({
  bien: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  client: { nom: String, email: String, phone: String },
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateDemandee: Date, heure: String, statut: String
}, { timestamps: true }));

export async function GET({ cookies }) {
  try {
    let filter = {};
    
    const token = cookies.get('token');
    if (token) {
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
        if (decoded.role !== 'super_admin' && decoded.role !== 'admin') {
          filter.proprietaire = decoded.userId;
        }
      } catch (e) {}
    }

    const visites = await Visite.find(filter)
      .populate('bien', 'titre prix ville')
      .populate('proprietaire', 'nom prenom')
      .sort({ dateDemandee: -1 });

    return json({ visites });
  } catch (error) {
    return json({ error: error.message, visites: [] }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const visite = await Visite.create(data);
    return json({ visite }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function PUT({ request }) {
  try {
    const { id, statut } = await request.json();
    await Visite.findByIdAndUpdate(id, { statut });
    return json({ message: 'Statut mis à jour' });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
