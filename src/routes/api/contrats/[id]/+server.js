import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';

const Contrat = mongoose.models.Contrat || mongoose.model('Contrat', new mongoose.Schema({
  reference: String, locataireNom: String, locataireEmail: String, locatairePhone: String,
  bienId: String, type: String, dateDebut: String, dateFin: String,
  loyer: Number, caution: Number, statut: String
}, { timestamps: true }));

export async function GET({ params }) {
  try {
    const contrat = await Contrat.findById(params.id);
    if (!contrat) return json({ error: 'Non trouvé' }, { status: 404 });
    return json({ contrat });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
