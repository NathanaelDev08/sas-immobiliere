import { json } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sasAdmin:SasImmo2026@cluster0.gumgfbu.mongodb.net/sas-immobiliere?retryWrites=true&w=majority';

const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000
});

let db;

async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db();
    console.log('✅ MongoDB connecté (properties)');
  }
  return db;
}

export async function GET({ url }) {
  try {
    const database = await getDb();
    const collection = database.collection('properties');
    
    const type = url.searchParams.get('type');
    const ville = url.searchParams.get('ville');
    const transaction = url.searchParams.get('transaction');
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    
    const filter = { statut: 'publie' };
    if (type) filter.type = type;
    if (ville) filter.ville = new RegExp(ville, 'i');
    if (transaction) filter.transaction = transaction;
    
    const properties = await collection.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
      
    // Peupler les propriétaires (jointure manuelle)
    const usersCollection = database.collection('users');
    for (const p of properties) {
      if (p.proprietaire) {
        const user = await usersCollection.findOne(
          { _id: p.proprietaire },
          { projection: { nom: 1, prenom: 1, email: 1, phone: 1 } }
        );
        p.proprietaire = user;
      }
    }
    
    return json({ properties, pagination: { total: properties.length, limit } });
  } catch (error) {
    console.error('Erreur properties:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
