import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';

export async function POST({ request, cookies }) {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const formData = await request.formData();
    const files = formData.getAll('photos');
    const urls = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '-' + file.name;
      const filepath = join('static', 'uploads', filename);
      
      await mkdir('static/uploads', { recursive: true });
      await writeFile(filepath, buffer);
      
      urls.push('/uploads/' + filename);
    }

    return json({ urls }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
