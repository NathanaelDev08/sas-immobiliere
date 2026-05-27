import { json } from '@sveltejs/kit';
import { Visit } from '$lib/server/models/Visit.js';

export async function GET({ locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const visits = await Visit.find()
    .populate('property', 'title city')
    .populate('tenant', 'name phone')
    .populate('agent', 'name')
    .sort({ date: -1 });
  return json({ visits });
}

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const data = await request.json();
  const visit = await Visit.create({ ...data, agent: locals.user._id });
  return json({ visit }, { status: 201 });
}
