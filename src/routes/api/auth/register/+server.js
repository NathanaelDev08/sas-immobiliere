import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { User } from '$lib/server/models/User.js';

export async function POST({ request, locals }) {
  if (!locals.user || locals.user.role !== 'superadmin') {
    return json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { name, email, phone, password, role, category, commission } = await request.json();

  const exists = await User.findOne({ email });
  if (exists) return json({ error: 'Email déjà utilisé' }, { status: 409 });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name, email, phone, role, category, commission,
    password: hashed,
  });

  return json({ user: { id: user._id, name: user.name, role: user.role } }, { status: 201 });
}
