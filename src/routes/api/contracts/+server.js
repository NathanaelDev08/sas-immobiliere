import { json } from '@sveltejs/kit';
import { Contract } from '$lib/server/models/Contract.js';

export async function GET({ locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const contracts = await Contract.find()
    .populate('property', 'title city price')
    .populate('tenant', 'name phone')
    .populate('agent', 'name')
    .sort({ createdAt: -1 });
  return json({ contracts });
}

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const data = await request.json();
  const contract = await Contract.create({ ...data, agent: locals.user._id });
  return json({ contract }, { status: 201 });
}
