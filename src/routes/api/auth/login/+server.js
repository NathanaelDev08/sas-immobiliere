import { json } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sasAdmin:SasImmo2026@cluster0.gumgfbu.mongodb.net/sas-immobiliere?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'MaCleSecrete2026!';

const client = new MongoClient(MONGODB_URI);
let db;

async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db();
  }
  return db;
}

export async function POST({ request, cookies }) {
  try {
    const database = await getDb();
    const { email, password } = await request.json();
    
    const user = await database.collection('users').findOne({ email });
    if (!user) return json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, nom: user.nom, prenom: user.prenom, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 86400, sameSite: 'lax' });

    return json({
      message: 'Connexion réussie',
      user: { nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
