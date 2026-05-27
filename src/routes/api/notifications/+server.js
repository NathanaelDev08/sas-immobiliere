import { json } from '@sveltejs/kit';
import Notification from '$lib/server/models/Notification.js';

export async function GET({ locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const notifications = await Notification.find({ user: locals.user._id }).sort({ createdAt: -1 });
  const unread = notifications.filter(n => !n.isRead).length;
  return json({ notifications, unread });
}

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: 'Non authentifié' }, { status: 401 });
  const data = await request.json();
  const notification = await Notification.create({ ...data, user: locals.user._id });
  return json({ notification }, { status: 201 });
}
