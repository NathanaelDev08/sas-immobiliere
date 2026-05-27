import { json } from '@sveltejs/kit';
import { COOKIE_NAME } from '$lib/server/session.js';

export async function POST({ cookies }) {
  cookies.delete(COOKIE_NAME, { path: '/' });
  return json({ success: true });
}
