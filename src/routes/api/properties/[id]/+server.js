import { json } from '@sveltejs/kit';
import { Property } from '$lib/server/models/Property';
import jwt from 'jsonwebtoken';

export async function GET({ params }) {
  try {
    const property = await Property.findById(params.id)
      .populate('proprietaire', 'nom prenom email phone photo');
    if (!property) return json({ error: 'Bien non trouvé' }, { status: 404 });
    property.vues += 1;
    await property.save();
    return json({ property });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function PUT({ params, request, cookies }) {
  try {
    const token = cookies.get('token');
    if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
    const body = await request.json();

    // Vérifier propriété ou admin
    const property = await Property.findById(params.id);
    if (!property) return json({ error: 'Non trouvé' }, { status: 404 });

    const isOwner = property.proprietaire.toString() === decoded.userId;
    const isAdmin = ['admin', 'super_admin'].includes(decoded.role);

    if (!isOwner && !isAdmin) {
      return json({ error: 'Non autorisé' }, { status: 403 });
    }

    const updated = await Property.findByIdAndUpdate(params.id, body, { new: true });
    return json({ property: updated });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params, cookies }) {
  try {
    const token = cookies.get('token');
    if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
    const property = await Property.findById(params.id);
    if (!property) return json({ error: 'Non trouvé' }, { status: 404 });

    const isOwner = property.proprietaire.toString() === decoded.userId;
    const isAdmin = ['admin', 'super_admin'].includes(decoded.role);

    if (!isOwner && !isAdmin) {
      return json({ error: 'Non autorisé' }, { status: 403 });
    }

    await Property.findByIdAndDelete(params.id);
    return json({ message: 'Bien supprimé' });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
