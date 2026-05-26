import { json } from '@sveltejs/kit';
import { Property } from '$lib/server/models/Property';

export async function POST({ request }) {
  try {
    const { bienId, nom, email, phone, message } = await request.json();
    const property = await Property.findById(bienId);
    if (!property) return json({ error: 'Bien non trouvé' }, { status: 404 });

    property.contacts += 1;
    await property.save();

    return json({ message: 'Message envoyé au propriétaire' }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
