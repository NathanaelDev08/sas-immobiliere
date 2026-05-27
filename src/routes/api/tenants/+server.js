import { json } from '@sveltejs/kit';
import Tenant from '$lib/server/models/Tenant.js';

export async function GET({ locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const tenants = await Tenant.find().sort({ createdAt: -1 });
  return json({ tenants });
}

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const data = await request.json();
  const tenant = await Tenant.create({ ...data, createdBy: locals.user._id });
  return json({ tenant }, { status: 201 });
}
