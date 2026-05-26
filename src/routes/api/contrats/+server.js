import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';

const Contrat = mongoose.models.Contrat || mongoose.model('Contrat', new mongoose.Schema({
  reference: String, locataireNom: String, locataireEmail: String, locatairePhone: String,
  bienId: String, type: String, dateDebut: String, dateFin: String,
  loyer: Number, caution: Number, statut: String
}, { timestamps: true }));

export async function GET() {
  try {
    const contrats = await Contrat.find().sort({ createdAt: -1 });
    return json({ contrats });
  } catch (error) {
    return json({ error: error.message, contrats: [] }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const contrat = await Contrat.create({
      ...data,
      reference: 'CTR-' + Date.now(),
      statut: 'Actif'
    });
    return json({ contrat }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
