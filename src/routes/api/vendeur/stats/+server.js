import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { Property } from '$lib/server/models/Property';
import { Transaction } from '$lib/server/models/Transaction';
import { Subscription } from '$lib/server/models/Subscription';
import jwt from 'jsonwebtoken';

export async function GET({ cookies }) {
  try {
    const token = cookies.get('token');
    if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
    const userId = new mongoose.Types.ObjectId(decoded.userId);

    const totalBiens = await Property.countDocuments({ proprietaire: userId });
    const biensPublies = await Property.countDocuments({ proprietaire: userId, statut: 'publie' });
    const biensVendus = await Property.countDocuments({ proprietaire: userId, statut: { $in: ['vendu', 'loue'] } });
    
    const vuesAgg = await Property.aggregate([
      { $match: { proprietaire: userId } },
      { $group: { _id: null, total: { $sum: '$vues' } } }
    ]);
    const totalVues = vuesAgg[0]?.total || 0;

    const transactionsEnCours = await Transaction.countDocuments({
      proprietaire: userId,
      statut: { $in: ['contact', 'negociation', 'visite', 'accord'] }
    });
    const transactionsFinalisees = await Transaction.countDocuments({
      proprietaire: userId,
      statut: 'finalise'
    });

    const subscription = await Subscription.findOne({ user: userId, statut: 'actif' });

    const biensRecents = await Property.find({ proprietaire: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const transactionsRecentes = await Transaction.find({ proprietaire: userId })
      .populate('bien', 'titre prix')
      .sort({ createdAt: -1 })
      .limit(10);

    return json({
      stats: { totalBiens, biensPublies, biensVendus, totalVues, transactionsEnCours, transactionsFinalisees },
      subscription,
      biensRecents,
      transactionsRecentes
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
