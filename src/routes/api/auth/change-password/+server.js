import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import User from '$lib/server/models/User.js';

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });

  const { currentPassword, newPassword } = await request.json();

  const user = await User.findById(locals.user._id);
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return json({ success: true });
}
