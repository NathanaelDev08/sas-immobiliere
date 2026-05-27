import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User.js';

export async function GET({ locals }) {
  if (!locals.user || locals.user.role !== 'superadmin') {
    return json({ error: 'Accès refusé' }, { status: 403 });
  }
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return json({ users });
}
