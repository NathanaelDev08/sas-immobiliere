import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { User } from '$lib/server/models/User';

export async function GET({ cookies }) {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-2024-sas-immo');
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    
    if (!user) return json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    return json({
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo,
        userId: user._id
      }
    });
  } catch (error) {
    return json({ error: 'Token invalide' }, { status: 401 });
  }
}
