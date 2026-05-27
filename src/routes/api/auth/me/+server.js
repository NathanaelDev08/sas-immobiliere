import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'MaCleSecrete2026!';

export async function GET({ cookies }) {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return json({ user: decoded });
  } catch (e) {
    return json({ error: 'Token invalide' }, { status: 401 });
  }
}
