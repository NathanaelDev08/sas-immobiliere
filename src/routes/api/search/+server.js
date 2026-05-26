import { json } from '@sveltejs/kit';
import { Property } from '$lib/server/models/Property';

export async function GET({ url }) {
  const q = url.searchParams.get('q') || '';
  const ville = url.searchParams.get('ville');
  const type = url.searchParams.get('type');
  const transaction = url.searchParams.get('transaction');
  const prixMin = parseInt(url.searchParams.get('prixMin')) || 0;
  const prixMax = parseInt(url.searchParams.get('prixMax')) || 999999999;
  const surfaceMin = parseInt(url.searchParams.get('surfaceMin')) || 0;
  const surfaceMax = parseInt(url.searchParams.get('surfaceMax')) || 99999;
  const pieces = parseInt(url.searchParams.get('pieces')) || 0;
  const chambres = parseInt(url.searchParams.get('chambres')) || 0;
  const standing = url.searchParams.get('standing');
  const lat = parseFloat(url.searchParams.get('lat'));
  const lng = parseFloat(url.searchParams.get('lng'));
  const rayon = parseInt(url.searchParams.get('rayon')) || 0;
  const sort = url.searchParams.get('sort') || 'date';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 12;

  const filter = { statut: 'publie' };

  // Recherche texte
  if (q) {
    filter.$or = [
      { titre: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { ville: new RegExp(q, 'i') },
      { quartier: new RegExp(q, 'i') }
    ];
  }

  // Filtres
  if (ville) filter.ville = new RegExp(ville, 'i');
  if (type) filter.type = type;
  if (transaction) filter.transaction = transaction;
  if (standing) filter.standing = standing;
  
  filter.prix = { $gte: prixMin, $lte: prixMax };
  if (surfaceMin > 0 || surfaceMax < 99999) {
    filter.surface = { $gte: surfaceMin, $lte: surfaceMax };
  }
  if (pieces > 0) filter.pieces = { $gte: pieces };
  if (chambres > 0) filter.chambres = { $gte: chambres };

  // Géolocalisation (recherche par rayon)
  if (lat && lng && rayon > 0) {
    filter.coordonnees = {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: rayon * 1000 // km en mètres
      }
    };
  }

  // Tri
  let sortOption = { createdAt: -1 };
  if (sort === 'prix_asc') sortOption = { prix: 1 };
  if (sort === 'prix_desc') sortOption = { prix: -1 };
  if (sort === 'surface_desc') sortOption = { surface: -1 };

  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter)
    .populate('proprietaire', 'nom prenom email phone')
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  return json({
    properties,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    filters: { q, ville, type, transaction, prixMin, prixMax, surfaceMin, surfaceMax, pieces, chambres, standing, lat, lng, rayon, sort }
  });
}
