import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User';

export async function PUT({ params, request }) {
  const { isActive } = await request.json();
  await User.findByIdAndUpdate(params.id, { isActive });
  return json({ message: 'Statut mis à jour' });
}
