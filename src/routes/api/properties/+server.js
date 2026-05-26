import { json } from '@sveltejs/kit';
import { Property } from '$lib/server/models/Property';
import { User } from '$lib/server/models/User';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET({ url, cookies }) {
  try {
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const type = url.searchParams.get('type');
    const ville = url.searchParams.get('ville');
    const transaction = url.searchParams.get('transaction');

    const token = cookies.get('token');
    let isAdmin = false;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
        isAdmin = ['admin', 'super_admin'].includes(decoded.role);
      } catch (e) {}
    }

    const filter = {};
    if (!isAdmin) filter.statut = 'publie';
    if (type) filter.type = type;
    if (ville) filter.ville = new RegExp(ville, 'i');
    if (transaction) filter.transaction = transaction;

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .populate('proprietaire', 'nom prenom email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return json({ properties, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GET properties error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request, cookies }) {
  console.log('📥 POST /api/properties - Début');
  
  try {
    const token = cookies.get('token');
    console.log('Token présent:', !!token);
    
    if (!token) {
      return json({ error: 'Non autorisé - connectez-vous' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
      console.log('Token décodé:', decoded.userId);
    } catch (e) {
      return json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }

    // Gérer FormData ou JSON
    const contentType = request.headers.get('content-type') || '';
    
    let body = {};
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
      
      // Gérer les photos
      const photos = formData.getAll('photos');
      const urls = [];
      for (const file of photos) {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const filename = Date.now() + '-' + Math.random().toString(36).substr(2, 5) + '-' + file.name;
          await mkdir('static/uploads', { recursive: true });
          await writeFile(join('static', 'uploads', filename), buffer);
          urls.push('/uploads/' + filename);
        }
      }
      body.photos = urls;
    } else {
      body = await request.json();
    }

    console.log('Body reçu:', body.titre);

    const property = await Property.create({
      titre: body.titre,
      description: body.description || '',
      type: body.type || 'residentiel',
      transaction: body.transaction || 'vente',
      prix: parseInt(body.prix) || 0,
      surface: parseInt(body.surface) || 0,
      pieces: parseInt(body.pieces) || 0,
      chambres: parseInt(body.chambres) || 0,
      douches: parseInt(body.douches) || 0,
      standing: body.standing || 'standard',
      ville: body.ville || '',
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
