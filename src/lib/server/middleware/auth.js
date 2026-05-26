import { verifyAccessToken } from '$lib/server/utils/jwt';
import { User } from '$lib/server/models/User';

export async function authenticate(event) {
  const token = event.cookies.get('accessToken');
  
  if (!token) {
    return null;
  }

  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    return null;
  }

  const user = await User.findById(decoded.userId).select('-password');
  
  if (!user || !user.isActive) {
    return null;
  }

  return {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    nom: user.nom,
    prenom: user.prenom
  };
}

export function requireAuth(role = null) {
  return async (event) => {
    const user = await authenticate(event);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (role && user.role !== role && user.role !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Accès interdit' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    event.locals.user = user;
    return null; // Continue
  };
}
