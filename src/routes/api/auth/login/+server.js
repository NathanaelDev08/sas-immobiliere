import { json } from '@sveltejs/kit';
const JWT_SECRET = process.env.JWT_SECRET || "MaCleSecrete2026";
import { User } from '$lib/server/models/User';
import jwt from 'jsonwebtoken';

export async function POST({ request, cookies }) {
  try {
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) return json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });

    const valid = await user.comparePassword(password);
    if (!valid) return json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });

    const token = jwt.sign(
      { userId: user._id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role },
      process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo',
      { expiresIn: '24h' }
    );

    cookies.set('token', token, {
      httpOnly: true, path: '/', maxAge: 86400, sameSite: 'lax'
    });

    return json({
      message: 'Connexion réussie',
      user: { nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, photo: user.photo }
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
