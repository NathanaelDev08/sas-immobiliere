import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User.js';

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });

  const { name, email, phone, avatar } = await request.json();

  const user = await User.findByIdAndUpdate(
    locals.user._id,
    { name, email, phone, avatar },
    { new: true }
  ).select('-password');

  return json({ user });
}
