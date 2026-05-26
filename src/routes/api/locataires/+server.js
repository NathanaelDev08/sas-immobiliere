import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';

// Modèle simplifié
const Locataire = mongoose.models.Locataire || mongoose.model('Locataire', new mongoose.Schema({
  nom: String, prenom: String, email: String, phone: String,
  adresse: String, profession: String, bien: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  loyer: Number, dateDebut: String, dateFin: String, statut: String
}, { timestamps: true }));

export async function GET() {
  try {
    const locataires = await Locataire.find()
      .populate('bien', 'titre prix ville')
      .sort({ createdAt: -1 });
    return json({ locataires });
  } catch (error) {
    return json({ error: error.message, locataires: [] }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const locataire = await Locataire.create(data);
    return json({ locataire }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
