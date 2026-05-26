import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const body = await request.json();
    console.log('📩 Message contact reçu:', body);
    
    // Ici on pourrait envoyer un email ou sauvegarder en base
    // Pour le moment on simule le succès
    
    return json({ message: 'Message reçu avec succès' }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
