import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  try {
    const data = url.searchParams.get('data') || 'https://sas-immo.ci';
    
    // Utiliser l'API Google Charts pour générer le QR Code (gratuit, pas de librairie)
    const qrcodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
    
    return json({ qrcode: qrcodeUrl });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
