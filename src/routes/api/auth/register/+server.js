import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User';
import jwt from 'jsonwebtoken';

export async function POST({ request, cookies }) {
  try {
    const body = await request.json();
    const { email, phone, password, nom, prenom, role } = body;

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return json({ error: 'Cet email ou téléphone existe déjà' }, { status: 400 });
    }

    const user = await User.create({ email, phone, password, nom, prenom, role: role || 'client' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role },
      process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo',
      { expiresIn: '24h' }
    );

    cookies.set('token', token, {
      httpOnly: true, path: '/', maxAge: 86400, sameSite: 'lax'
    });

    return json({
      message: 'Inscription réussie',
      user: { nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, photo: user.photo }
    }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
