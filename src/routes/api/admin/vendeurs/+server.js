import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User';
import { Subscription } from '$lib/server/models/Subscription';

// GET - Lister les vendeurs
export async function GET() {
  const vendeurs = await User.find({ role: { $in: ['proprietaire', 'agent'] } })
    .select('-password')
    .sort({ createdAt: -1 });

  // Récupérer les abonnements
  const vendeursWithSub = await Promise.all(vendeurs.map(async (v) => {
    const sub = await Subscription.findOne({ user: v._id, statut: 'actif' });
    return { ...v.toObject(), subscription: sub };
  }));

  return json({ vendeurs: vendeursWithSub });
}

// POST - Créer un vendeur
export async function POST({ request }) {
  const { email, phone, password, nom, prenom, plan, commission, maxBiens } = await request.json();

  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    return json({ error: 'Email ou téléphone déjà utilisé' }, { status: 400 });
  }

  const user = await User.create({
    email, phone, password, nom, prenom,
    role: 'proprietaire'
  });

  await Subscription.create({
    user: user._id,
    plan: plan || 'basic',
    commission: commission || 5,
    maxBiens: maxBiens || 10,
    statut: 'actif'
  });

  return json({ message: 'Vendeur créé', user: { id: user._id, email: user.email } }, { status: 201 });
}
