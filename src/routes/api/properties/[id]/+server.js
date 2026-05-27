import { json } from '@sveltejs/kit';
import { Property } from '$lib/server/models/Property.js';

export async function GET({ params, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const property = await Property.findById(params.id).populate('owner', 'name email');
  if (!property) return json({ error: 'Bien introuvable' }, { status: 404 });
  return json({ property });
}

export async function PUT({ params, request, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const data = await request.json();
  const property = await Property.findByIdAndUpdate(params.id, data, { new: true });
  if (!property) return json({ error: 'Bien introuvable' }, { status: 404 });
  return json({ property });
}

export async function DELETE({ params, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  await Property.findByIdAndDelete(params.id);
  return json({ success: true });
}
