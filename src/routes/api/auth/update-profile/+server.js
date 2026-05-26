import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';
import { User } from '$lib/server/models/User';

export async function PUT({ request, cookies }) {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
    const formData = await request.formData();
    
    const nom = formData.get('nom');
    const prenom = formData.get('prenom');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const photoFile = formData.get('photo');

    const updateData = { nom, prenom, email, phone };

    // Gérer la photo
    if (photoFile && photoFile.size > 0) {
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      const filename = 'profile-' + decoded.userId + '-' + Date.now() + '.jpg';
      const filepath = join('static', 'uploads', filename);
      
      await mkdir('static/uploads', { recursive: true });
      await writeFile(filepath, buffer);
      
      updateData.photo = '/uploads/' + filename;
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true }
    ).select('-password -refreshToken');

    if (!user) return json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    return json({
      message: 'Profil mis à jour',
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo
      }
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
