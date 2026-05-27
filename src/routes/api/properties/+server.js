import { json } from '@sveltejs/kit';
import Property from '$lib/server/models/Property.js';

export async function GET({ url, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const type = url.searchParams.get('type');
  const city = url.searchParams.get('city');
  const transaction = url.searchParams.get('transaction');
  const status = url.searchParams.get('status');
  const filter = {};
  if (type) filter.type = type;
  if (city) filter.city = city;
  if (transaction) filter.transaction = transaction;
  if (status) filter.status = status;
  const properties = await Property.find(filter).populate('owner', 'name email').sort({ createdAt: -1 });
  return json({ properties });
}

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const data = await request.json();
  const property = await Property.create({ ...data, owner: locals.user._id });
  return json({ property }, { status: 201 });
}
