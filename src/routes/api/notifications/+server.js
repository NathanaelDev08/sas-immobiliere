import { json } from '@sveltejs/kit';
const JWT_SECRET = process.env.JWT_SECRET || "MaCleSecrete2026";
import { Notification } from '$lib/server/models/Notification';
import jwt from 'jsonwebtoken';

export async function GET({ cookies }) {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
  const notifications = await Notification.find({ user: decoded.userId })
    .sort({ createdAt: -1 })
    .limit(20);

  const nonLu = await Notification.countDocuments({ user: decoded.userId, lu: false });

  return json({ notifications, nonLu });
}

export async function PUT({ request, cookies }) {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
  const { id, all } = await request.json();

  if (all) {
    await Notification.updateMany({ user: decoded.userId }, { lu: true });
  } else if (id) {
    await Notification.findByIdAndUpdate(id, { lu: true });
  }

  return json({ message: 'OK' });
}
