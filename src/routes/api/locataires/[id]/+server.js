import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';

const Locataire = mongoose.models.Locataire || mongoose.model('Locataire', new mongoose.Schema({
  nom: String, prenom: String, email: String, phone: String,
  adresse: String, profession: String, bien: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  loyer: Number, dateDebut: String, dateFin: String, statut: String
}, { timestamps: true }));

export async function GET({ params }) {
  try {
    const locataire = await Locataire.findById(params.id).populate('bien', 'titre prix ville');
    if (!locataire) return json({ error: 'Non trouvé' }, { status: 404 });
    return json({ locataire });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
