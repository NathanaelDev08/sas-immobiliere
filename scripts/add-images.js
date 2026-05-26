import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sas-immo';
await mongoose.connect(MONGO_URI);
console.log('✅ Connecté\n');

const Property = mongoose.model('Property', new mongoose.Schema({
  photos: [String]
}, { timestamps: true }));

// Images Unsplash par type de bien
const images = {
  residentiel_luxe: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  ],
  residentiel_moderne: [
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    'https://images.unsplash.com/photo-1600566753086-00f18f6b0056?w=800',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
  ],
  appartement: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  ],
  studio: [
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800',
  ],
  terrain: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=800',
    'https://images.unsplash.com/photo-1416339684178-3a239570f315?w=800',
  ],
  commercial: [
    'https://images.unsplash.com/photo-1497366754270-2d7e5d9b6b37?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=800',
  ],
  bureau: [
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800',
  ],
  resto: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
  ],
  immeuble: [
    'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800',
    'https://images.unsplash.com/photo-1472222119889-3f7e2e2e8b0f?w=800',
  ],
  entrepot: [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',
  ],
};

// Associer les images aux biens
const allProperties = await Property.find({});

for (const p of allProperties) {
  let photoSet = images.residentiel_moderne;
  
  const titre = (p.titre || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const type = (p.type || '').toLowerCase();
  const standing = (p.standing || '').toLowerCase();

  if (standing === 'luxe' || desc.includes('luxe') || desc.includes('piscine')) {
    photoSet = images.residentiel_luxe;
  } else if (type === 'terrain') {
    photoSet = images.terrain;
  } else if (type === 'commercial' && (titre.includes('bureau') || titre.includes('coworking'))) {
    photoSet = images.bureau;
  } else if (type === 'commercial' && (titre.includes('restaurant') || desc.includes('restaurant'))) {
    photoSet = images.resto;
  } else if (type === 'commercial' && (titre.includes('entrepôt') || titre.includes('stockage'))) {
    photoSet = images.entrepot;
  } else if (type === 'commercial' && titre.includes('immeuble')) {
    photoSet = images.immeuble;
  } else if (type === 'commercial') {
    photoSet = images.commercial;
  } else if (desc.includes('studio') || titre.includes('studio')) {
    photoSet = images.studio;
  } else if (p.surface < 80) {
    photoSet = images.appartement;
  }

  // Prendre 2-3 photos aléatoires
  const numPhotos = 2 + Math.floor(Math.random() * 2); // 2 ou 3 photos
  const selected = photoSet.sort(() => Math.random() - 0.5).slice(0, numPhotos);

  await Property.findByIdAndUpdate(p._id, { photos: selected });
}

console.log(`✅ Images ajoutées à ${allProperties.length} biens`);

// Compter par type d'image
const counts = {};
for (const p of allProperties) {
  const p2 = await Property.findById(p._id);
  counts[p2.titre] = p2.photos.length;
}

console.log('📸 Résumé :');
console.log(`   Total biens mis à jour : ${allProperties.length}`);

await mongoose.disconnect();
console.log('\n👋 Terminé');
