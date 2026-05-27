import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { Notification } from '$lib/server/models/Notification';

export async function PUT({ cookies }) {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Non autorisé' }, { status: 401 });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MaCleSecrete2026!');
    await Notification.updateMany({ user: decoded.userId }, { lu: true });
    return json({ message: 'Tout marqué lu' });
  } catch (e) {
    return json({ error: e.message }, { status: 500 });
  }
}
