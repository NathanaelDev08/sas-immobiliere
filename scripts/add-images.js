import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sasAdmin:SasImmo2026@cluster0.gumgfbu.mongodb.net/sas-immobiliere?retryWrites=true&w=majority';
await mongoose.connect(MONGODB_URI);
console.log('✅ Connecté à MongoDB Atlas\n');

const Property = mongoose.model('Property', new mongoose.Schema({ photos: [String] }, { timestamps: true }));

const images = {
  luxe: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  ],
  villa: [
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    'https://images.unsplash.com/photo-1600566753086-00f18f6b0056?w=800',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
  ],
  appart: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
  ],
  terrain: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=800',
  ],
  commerce: [
    'https://images.unsplash.com/photo-1497366754270-2d7e5d9b6b37?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  ],
  bureau: [
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800',
  ],
};

const allProperties = await Property.find({});

for (const p of allProperties) {
  let set = images.villa;
  const t = (p.titre || '').toLowerCase();
  const d = (p.description || '').toLowerCase();

  if (d.includes('luxe') || d.includes('piscine') || p.standing === 'luxe') set = images.luxe;
  else if (p.type === 'terrain') set = images.terrain;
  else if (p.type === 'commercial' && (t.includes('bureau') || t.includes('coworking'))) set = images.bureau;
  else if (p.type === 'commercial') set = images.commerce;
  else if (p.surface && p.surface < 80) set = images.appart;

  const n = 2 + Math.floor(Math.random() * 2);
  const selected = set.sort(() => Math.random() - 0.5).slice(0, n);

  await Property.findByIdAndUpdate(p._id, { photos: selected });
}

console.log(`✅ Images ajoutées à ${allProperties.length} biens`);
await mongoose.disconnect();
