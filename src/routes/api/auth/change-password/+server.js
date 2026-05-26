import { json } from '@sveltejs/kit';

export async function PUT({ request, cookies }) {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const jwt = await import('jsonwebtoken');
    const bcrypt = await import('bcryptjs');
    const { User } = await import('$lib/server/models/User');
    
    const decoded = jwt.default.verify(token, 'dev-secret');
    const { currentPassword, newPassword } = await request.json();

    const user = await User.findById(decoded.userId);
    if (!user) return json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    const valid = await user.comparePassword(currentPassword);
    if (!valid) return json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });

    user.password = newPassword;
    await user.save();

    return json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
