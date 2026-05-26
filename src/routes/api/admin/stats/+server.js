import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User';
import { Property } from '$lib/server/models/Property';
import { Transaction } from '$lib/server/models/Transaction';
import { Subscription } from '$lib/server/models/Subscription';

export async function GET() {
  try {
    const totalBiens = await Property.countDocuments();
    const biensPublies = await Property.countDocuments({ statut: 'publie' });
    const biensVendus = await Property.countDocuments({ statut: { $in: ['vendu', 'loue'] } });
    const totalVendeurs = await User.countDocuments({ role: { $in: ['proprietaire', 'agent'] } });
    const totalTransactions = await Transaction.countDocuments();

    const vuesAgg = await Property.aggregate([
      { $group: { _id: null, total: { $sum: '$vues' } } }
    ]);
    const totalVues = vuesAgg[0]?.total || 0;

    const vendeurs = await User.find({ role: { $in: ['proprietaire', 'agent'] } })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const vendeursWithSub = await Promise.all(vendeurs.map(async (v) => {
      const sub = await Subscription.findOne({ user: v._id, statut: 'actif' });
      return { ...v.toObject(), subscription: sub };
    }));

    const biensRecents = await Property.find()
      .populate('proprietaire', 'nom prenom')
      .sort({ createdAt: -1 })
      .limit(10);

    return json({
      stats: { totalBiens, biensPublies, biensVendus, totalVendeurs, totalTransactions, totalVues },
      vendeurs: vendeursWithSub,
      biensRecents
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
