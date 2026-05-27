import { json } from '@sveltejs/kit';
const JWT_SECRET = process.env.JWT_SECRET || "MaCleSecrete2026";
import { Property } from '$lib/server/models/Property';
import jwt from 'jsonwebtoken';

export async function GET({ url, cookies }) {
  try {
    const type = url.searchParams.get('type');
    const ville = url.searchParams.get('ville');
    const transaction = url.searchParams.get('transaction');
    const limit = parseInt(url.searchParams.get('limit')) || 50;

    const token = cookies.get('token');
    let isAdmin = false;
    if (token) {
      try { const d = jwt.verify(token, JWT_SECRET); isAdmin = ['admin','super_admin'].includes(d.role); } catch(e) {}
    }

    const filter = {};
    if (!isAdmin) filter.statut = 'publie';
    if (type) filter.type = type;
    if (ville) filter.ville = new RegExp(ville, 'i');
    if (transaction) filter.transaction = transaction;

    const properties = await Property.find(filter)
      .populate('proprietaire', 'nom prenom email phone')
      .sort({ createdAt: -1 })
      .limit(limit);

    return json({ properties, pagination: { total: properties.length, limit } });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request, cookies }) {
  console.log('📥 POST /api/properties');
  
  try {
    const token = cookies.get('token');
    if (!token) return json({ error: 'Non autorisé - connectez-vous' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Toujours utiliser JSON (pas FormData pour éviter les problèmes)
    const body = await request.json();
    console.log('Body reçu:', body.titre);

    const property = await Property.create({
      titre: body.titre || 'Sans titre',
      description: body.description || '',
      type: body.type || 'residentiel',
      transaction: body.transaction || 'vente',
      prix: parseInt(body.prix) || 0,
      surface: parseInt(body.surface) || 0,
      pieces: parseInt(body.pieces) || 0,
      chambres: parseInt(body.chambres) || 0,
      douches: parseInt(body.douches) || 0,
      standing: body.standing || 'standard',
      ville: body.ville || 'Abidjan',
      quartier: body.quartier || '',
      statut: body.statut || 'publie',
      proprietaire: decoded.userId,
      photos: body.photos || []
    });

    console.log('✅ Bien créé:', property._id);
    return json({ message: 'Bien créé', property }, { status: 201 });

  } catch (error) {
    console.error('❌ Erreur POST property:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
