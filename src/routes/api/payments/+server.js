import { json } from '@sveltejs/kit';
import Payment from '$lib/server/models/Payment.js';

export async function GET({ locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const payments = await Payment.find()
    .populate('contract')
    .sort({ createdAt: -1 });
  const total = payments.reduce((sum, p) => sum + (p.status === 'Payé' ? p.amount : 0), 0);
  return json({ payments, total });
}

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const data = await request.json();
  const payment = await Payment.create(data);
  return json({ payment }, { status: 201 });
}
