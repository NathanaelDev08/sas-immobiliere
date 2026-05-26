import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sas-immo';
await mongoose.connect(MONGO_URI);
console.log('✅ Connecté à MongoDB');

// ============ MODÈLES ============
const userSchema = new mongoose.Schema({
  email: String, phone: String, password: String, role: String,
  nom: String, prenom: String, photo: String, isActive: Boolean
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const subSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: String, commission: Number, maxBiens: Number, biensCount: Number, statut: String
}, { timestamps: true });
const Subscription = mongoose.model('Subscription', subSchema);

const propSchema = new mongoose.Schema({
  titre: String, description: String, type: String, transaction: String,
  prix: Number, surface: Number, pieces: Number, chambres: Number, douches: Number,
  standing: String, ville: String, quartier: String,
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  statut: String, vues: Number, contacts: Number, photos: [String]
}, { timestamps: true });
const Property = mongoose.model('Property', propSchema);

// ============ NETTOYAGE ============
await User.deleteMany({});
await Subscription.deleteMany({});
await Property.deleteMany({});
console.log('🧹 Base nettoyée');

// ============ SUPER ADMIN ============
const superAdmin = await User.create({
  email: 'admin@immopro.ci',
  phone: '0100000000',
  password: await bcrypt.hash('admin123', 10),
  role: 'super_admin',
  nom: 'Kouassi',
  prenom: 'Yannick',
  isActive: true
});
console.log('✅ Super Admin créé : admin@immopro.ci / admin123');

// ============ AGENTS IMMOBILIERS ============
const agents = [
  { email: 'agence.cocody@immopro.ci', phone: '0708000101', nom: 'Agence', prenom: 'Cocody Immo', role: 'agent' },
  { email: 'agence.plateau@immopro.ci', phone: '0708000102', nom: 'Agence', prenom: 'Plateau Immo', role: 'agent' },
  { email: 'agence.marcory@immopro.ci', phone: '0708000103', nom: 'Agence', prenom: 'Marcory Immo', role: 'agent' },
];

const agentsCreated = [];
for (const a of agents) {
  const user = await User.create({
    ...a,
    password: await bcrypt.hash('agent123', 10),
    isActive: true
  });
  await Subscription.create({
    user: user._id, plan: 'business', commission: 5,
    maxBiens: 50, biensCount: 0, statut: 'actif'
  });
  agentsCreated.push(user);
}
console.log('✅ 3 agents créés (mot de passe: agent123)');

// ============ PROPRIÉTAIRES ============
const proprietaires = [
  { email: 'kouame@email.ci', phone: '0505000101', nom: 'Kouamé', prenom: 'Michel', role: 'proprietaire' },
  { email: 'diallo@email.ci', phone: '0505000102', nom: 'Diallo', prenom: 'Aïssata', role: 'proprietaire' },
  { email: 'yao@email.ci', phone: '0505000103', nom: 'Yao', prenom: 'Koffi', role: 'proprietaire' },
  { email: 'soro@email.ci', phone: '0505000104', nom: 'Soro', prenom: 'Salimata', role: 'proprietaire' },
  { email: 'konan@email.ci', phone: '0505000105', nom: 'Konan', prenom: 'Venance', role: 'proprietaire' },
];

const propriosCreated = [];
for (const p of proprietaires) {
  const user = await User.create({
    ...p,
    password: await bcrypt.hash('proprio123', 10),
    isActive: true
  });
  await Subscription.create({
    user: user._id, plan: 'pro', commission: 5,
    maxBiens: 20, biensCount: 0, statut: 'actif'
  });
  propriosCreated.push(user);
}
console.log('✅ 5 propriétaires créés (mot de passe: proprio123)');

// ============ BIENS IMMOBILIERS ============
const allBiens = [
  // Agent Cocody (12 biens)
  { titre: 'Villa Moderne Palmeraie', description: 'Superbe villa 5 chambres avec piscine à débordement, jardin paysager de 800m², cuisine équipée, climatisation centrale, système de sécurité vidéo.', type: 'residentiel', transaction: 'vente', prix: 350000000, surface: 450, pieces: 8, chambres: 5, douches: 4, standing: 'luxe', ville: 'Abidjan', quartier: 'Cocody Palmeraie', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Appartement Standing Riviera', description: 'Appartement 3 chambres entièrement rénové, salon double, cuisine américaine, balcon avec vue panoramique, parking sécurisé.', type: 'residentiel', transaction: 'location', prix: 650000, surface: 120, pieces: 4, chambres: 3, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Cocody Riviera', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Terrain Constructible Angré', description: 'Terrain viabilisé de 600m², titre foncier disponible, idéal pour projet résidentiel, quartier calme et sécurisé.', type: 'terrain', transaction: 'vente', prix: 85000000, surface: 600, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Cocody Angré', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Studio Meublé 2 Plateaux', description: 'Studio moderne entièrement meublé, idéal jeune actif, eau et électricité inclus, proche des commerces.', type: 'residentiel', transaction: 'location', prix: 200000, surface: 35, pieces: 1, chambres: 1, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: '2 Plateaux', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Duplex Luxe Cocody', description: 'Duplex haut standing avec finitions de luxe, 4 chambres suites, piscine privée, garage 3 voitures.', type: 'residentiel', transaction: 'vente', prix: 420000000, surface: 380, pieces: 7, chambres: 4, douches: 4, standing: 'luxe', ville: 'Abidjan', quartier: 'Cocody', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Appartement Familial Angré', description: 'Grand appartement familial 4 chambres, idéal pour famille, proche des écoles et universités.', type: 'residentiel', transaction: 'location', prix: 450000, surface: 150, pieces: 5, chambres: 4, douches: 2, standing: 'moyen', ville: 'Abidjan', quartier: 'Cocody Angré', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Boutique Cocody St Jean', description: 'Local commercial de 80m² sur axe passant, idéal pour commerce, restaurant ou bureau.', type: 'commercial', transaction: 'location', prix: 350000, surface: 80, pieces: 1, chambres: 0, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Cocody St Jean', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Terrain Lotissement Angré', description: 'Terrain en lotissement de 450m², quartier résidentiel, tous les réseaux disponibles.', type: 'terrain', transaction: 'vente', prix: 55000000, surface: 450, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Angré', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Villa à Rénover Palmeraie', description: 'Ancienne villa à rénover, grand potentiel, 800m² de terrain, idéal investisseur.', type: 'residentiel', transaction: 'vente', prix: 180000000, surface: 800, pieces: 6, chambres: 4, douches: 2, standing: 'standard', ville: 'Abidjan', quartier: 'Palmeraie', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Résidence Meublée Bonoumin', description: 'Résidence entièrement meublée, idéale expatriés, 3 chambres, jardin, gardien.', type: 'residentiel', transaction: 'location', prix: 800000, surface: 200, pieces: 5, chambres: 3, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Bonoumin', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Magasin Rue des Jardins', description: 'Magasin de 120m², vitrine sur rue, idéal showroom ou superette.', type: 'commercial', transaction: 'vente', prix: 65000000, surface: 120, pieces: 1, chambres: 0, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: '2 Plateaux', proprietaire: agentsCreated[0]._id, statut: 'publie' },
  { titre: 'Appartement Vue Lagune', description: 'Appartement avec vue imprenable sur la lagune, 2 chambres, résidence sécurisée avec piscine.', type: 'residentiel', transaction: 'vente', prix: 120000000, surface: 95, pieces: 3, chambres: 2, douches: 1, standing: 'haut', ville: 'Abidjan', quartier: 'Cocody', proprietaire: agentsCreated[0]._id, statut: 'publie' },

  // Agent Plateau (10 biens)
  { titre: 'Bureau Premium Plateau', description: 'Bureau de standing au cœur du quartier d\'affaires, étage élevé, vue panoramique, salle de conférence.', type: 'commercial', transaction: 'location', prix: 1200000, surface: 150, pieces: 3, chambres: 0, douches: 2, standing: 'luxe', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agentsCreated[1]._id, statut: 'publie' },
  { titre: 'Appartement Centre-Ville', description: 'Appartement 2 chambres rénové, idéal professionnel, proche banques et administrations.', type: 'residentiel', transaction: 'location', prix: 400000, surface: 85, pieces: 3, chambres: 2, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agentsCreated[1]._id, statut: 'publie' },
  { titre: 'Immeuble de Rapport', description: 'Immeuble R+3 de 12 appartements, entièrement loué, rendement locatif 8%/an, idéal investisseur.', type: 'commercial', transaction: 'vente', prix: 850000000, surface: 800, pieces: 12, chambres: 24, douches: 12, standing: 'moyen', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agentsCreated[1]._id, statut: 'publie' },
  { titre: 'Studio Centre Affaires', description: 'Studio fonctionnel au cœur du plateau, parfait pour bureau ou pied-à-terre.', type: 'residentiel', transaction: 'location', prix: 250000, surface: 30, pieces: 1, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agentsCreated[1]._id, statut: 'publie' },
  { titre: 'Boutique Avenue Chardy', description: 'Boutique sur l\'avenue la plus commerçante du Plateau, 50m², bail 3/6/9.', type: 'commercial', transaction: 'location', prix: 500000, surface: 50, pieces: 1, chambres: 0, douches: 1, standing: 'haut', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agentsCreated[1]._id, statut: 'publie' },
  { titre: 'Penthouse Vue Mer', description: 'Penthouse d\'exception au dernier étage, 3 chambres, terrasse 100m², finitions marbre et bois précieux.', type: 'residentiel', transaction: 'vente', prix: 580000000, surface: 250, pieces: 5, chambres: 3, douches: 3, standing: 'luxe', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agentsCreated[1]._id, statut: 'publie' },
  { titre: 'Coworking Space', description: 'Espace de coworking moderne, 30 postes de travail, salle de réunion, internet fibre, café.', type: 'commercial', transaction: 'location', prix: 1800000, surface: 200, pieces: 3, chambres: 0, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agentsCreated[1]._id, statut: 'publie' },
  { titre: 'Restaurant Plateau', description: 'Fonds de commerce restaurant gastronomique, clientèle d\'affaires établie, matériel inclus.', type: 'commercial', transaction: 'vente', prix: 150000000, surface: 180, pieces: 4, chambres: 0, douches: 3, standing: 'haut', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agentsCreated[1]._id, statut: 'publie' },
  { titre: 'Appartement Vue Cathédrale', description: 'Bel appartement avec vue sur la Cathédrale St Paul, 2 chambres, climatisé, gardien.', type: 'residentiel', transaction: 'vente', prix: 95000000, surface: 90, pieces: 3, chambres: 2, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agentsCreated[1]._id, statut: 'publie' },
  { titre: 'Terrain Zone Portuaire', description: 'Terrain industriel 2000m² proche du port autonome, idéal entrepôt ou logistique.', type: 'terrain', transaction: 'vente', prix: 250000000, surface: 2000, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Zone Portuaire', proprietaire: agentsCreated[1]._id, statut: 'publie' },

  // Agent Marcory (8 biens)
  { titre: 'Villa Zone 4C', description: 'Villa moderne dans quartier prisé, 4 chambres, grand jardin, piscine, climatisation.', type: 'residentiel', transaction: 'vente', prix: 280000000, surface: 350, pieces: 6, chambres: 4, douches: 3, standing: 'haut', ville: 'Abidjan', quartier: 'Marcory Zone 4C', proprietaire: agentsCreated[2]._id, statut: 'publie' },
  { titre: 'Appartement Résidentiel', description: 'Appartement 3 chambres dans résidence sécurisée, parking, salle de sport, piscine.', type: 'residentiel', transaction: 'location', prix: 500000, surface: 110, pieces: 4, chambres: 3, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Marcory', proprietaire: agentsCreated[2]._id, statut: 'publie' },
  { titre: 'Showroom Automobile', description: 'Showroom de 500m² sur boulevard, parfait pour concession automobile, grande vitrine.', type: 'commercial', transaction: 'location', prix: 2500000, surface: 500, pieces: 2, chambres: 0, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Marcory', proprietaire: agentsCreated[2]._id, statut: 'publie' },
  { titre: 'Terrain Zone 4', description: 'Terrain résidentiel de 700m², quartier calme, idéal construction villa.', type: 'terrain', transaction: 'vente', prix: 120000000, surface: 700, pieces: 0, chambres: 0, douches: 0, standing: 'haut', ville: 'Abidjan', quartier: 'Marcory Zone 4', proprietaire: agentsCreated[2]._id, statut: 'publie' },
  { titre: 'Duplex Résidentiel', description: 'Duplex avec 4 chambres, double salon, cuisine équipée, jardin, garage 2 voitures.', type: 'residentiel', transaction: 'vente', prix: 220000000, surface: 280, pieces: 6, chambres: 4, douches: 3, standing: 'haut', ville: 'Abidjan', quartier: 'Marcory', proprietaire: agentsCreated[2]._id, statut: 'publie' },
  { titre: 'Bureau Professionnel', description: 'Bureau équipé de 60m², idéal professions libérales, climatisation, parking.', type: 'commercial', transaction: 'location', prix: 300000, surface: 60, pieces: 2, chambres: 0, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Marcory', proprietaire: agentsCreated[2]._id, statut: 'publie' },
  { titre: 'Studio Meublé Étudiant', description: 'Studio meublé proche universités, idéal étudiant, charges incluses.', type: 'residentiel', transaction: 'location', prix: 120000, surface: 28, pieces: 1, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Marcory', proprietaire: agentsCreated[2]._id, statut: 'publie' },
  { titre: 'Entrepôt Stockage', description: 'Entrepôt sécurisé de 1000m², quai de chargement, accessible camions.', type: 'commercial', transaction: 'location', prix: 1500000, surface: 1000, pieces: 1, chambres: 0, douches: 2, standing: 'standard', ville: 'Abidjan', quartier: 'Marcory', proprietaire: agentsCreated[2]._id, statut: 'publie' },

  // Propriétaires individuels (15 biens supplémentaires)
  { titre: 'Villa Yopougon', description: 'Villa familiale 3 chambres, quartier calme, proche commodités.', type: 'residentiel', transaction: 'vente', prix: 45000000, surface: 200, pieces: 5, chambres: 3, douches: 2, standing: 'standard', ville: 'Abidjan', quartier: 'Yopougon', proprietaire: propriosCreated[0]._id, statut: 'publie' },
  { titre: 'Appartement Abobo', description: 'Appartement 2 chambres, idéal petit budget, bien entretenu.', type: 'residentiel', transaction: 'location', prix: 100000, surface: 65, pieces: 2, chambres: 2, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Abobo', proprietaire: propriosCreated[1]._id, statut: 'publie' },
  { titre: 'Terrain Bingerville', description: 'Grand terrain de 1500m², idéal projet immobilier, prix négociable.', type: 'terrain', transaction: 'vente', prix: 65000000, surface: 1500, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Bingerville', proprietaire: propriosCreated[2]._id, statut: 'publie' },
  { titre: 'Boutique Koumassi', description: 'Petite boutique de quartier, idéal commerce de proximité.', type: 'commercial', transaction: 'location', prix: 80000, surface: 25, pieces: 1, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Koumassi', proprietaire: propriosCreated[3]._id, statut: 'publie' },
  { titre: 'Villa Grand-Bassam', description: 'Villa en bord de mer, 4 chambres, idéal résidence secondaire ou location saisonnière.', type: 'residentiel', transaction: 'vente', prix: 180000000, surface: 300, pieces: 6, chambres: 4, douches: 3, standing: 'haut', ville: 'Grand-Bassam', quartier: 'Bord de mer', proprietaire: propriosCreated[4]._id, statut: 'publie' },
  { titre: 'Studio Treichville', description: 'Studio économique, proche gare et commerces.', type: 'residentiel', transaction: 'location', prix: 90000, surface: 28, pieces: 1, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Treichville', proprietaire: propriosCreated[0]._id, statut: 'publie' },
  { titre: 'Maison Port-Bouët', description: 'Maison 2 chambres proche aéroport, idéale pour personnel navigant.', type: 'residentiel', transaction: 'location', prix: 250000, surface: 100, pieces: 3, chambres: 2, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Port-Bouët', proprietaire: propriosCreated[1]._id, statut: 'publie' },
  { titre: 'Terrain San Pedro', description: 'Terrain en bord de mer, 3000m², idéal projet touristique.', type: 'terrain', transaction: 'vente', prix: 200000000, surface: 3000, pieces: 0, chambres: 0, douches: 0, standing: 'luxe', ville: 'San Pedro', quartier: 'Bord de mer', proprietaire: propriosCreated[2]._id, statut: 'publie' },
  { titre: 'Appartement Adjamé', description: 'Appartement rénové 2 chambres, proche du grand marché.', type: 'residentiel', transaction: 'vente', prix: 25000000, surface: 70, pieces: 3, chambres: 2, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Adjamé', proprietaire: propriosCreated[3]._id, statut: 'publie' },
  { titre: 'Villa Assinie', description: 'Magnifique villa pieds dans l\'eau, 5 chambres, piscine, plage privée.', type: 'residentiel', transaction: 'vente', prix: 450000000, surface: 500, pieces: 8, chambres: 5, douches: 5, standing: 'luxe', ville: 'Assinie', quartier: 'Bord de mer', proprietaire: propriosCreated[4]._id, statut: 'publie' },
  { titre: 'Bureau Cocody', description: 'Bureau équipé 40m², idéal freelance, internet inclus.', type: 'commercial', transaction: 'location', prix: 200000, surface: 40, pieces: 1, chambres: 0, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Cocody', proprietaire: propriosCreated[0]._id, statut: 'publie' },
  { titre: 'Appartement Yamoussoukro', description: 'Appartement 3 chambres dans la capitale, quartier administratif.', type: 'residentiel', transaction: 'location', prix: 300000, surface: 120, pieces: 4, chambres: 3, douches: 2, standing: 'moyen', ville: 'Yamoussoukro', quartier: 'Centre', proprietaire: propriosCreated[1]._id, statut: 'publie' },
  { titre: 'Terrain Bouaké', description: 'Terrain constructible 800m², centre-ville, tous réseaux.', type: 'terrain', transaction: 'vente', prix: 35000000, surface: 800, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Bouaké', quartier: 'Centre', proprietaire: propriosCreated[2]._id, statut: 'publie' },
  { titre: 'Local Commercial Korhogo', description: 'Local commercial bien situé, 90m², idéal boutique.', type: 'commercial', transaction: 'vente', prix: 40000000, surface: 90, pieces: 1, chambres: 0, douches: 1, standing: 'standard', ville: 'Korhogo', quartier: 'Centre', proprietaire: propriosCreated[3]._id, statut: 'publie' },
  { titre: 'Résidence Meublée Daloa', description: 'Résidence meublée pour travailleurs, 2 chambres, climatisée.', type: 'residentiel', transaction: 'location', prix: 180000, surface: 75, pieces: 3, chambres: 2, douches: 1, standing: 'standard', ville: 'Daloa', quartier: 'Résidentiel', proprietaire: propriosCreated[4]._id, statut: 'publie' },
];

const createdBiens = await Property.insertMany(allBiens);

// Mise à jour compteurs
for (const user of [...agentsCreated, ...propriosCreated]) {
  const count = await Property.countDocuments({ proprietaire: user._id });
  await Subscription.updateOne({ user: user._id }, { biensCount: count });
}

console.log(`\n✅ ${createdBiens.length} biens créés !`);
console.log('\n📊 RÉSUMÉ :');
console.log('  👤 1 Super Admin');
console.log('  🏢 3 Agences immobilières');
console.log('  🏠 5 Propriétaires');
console.log('  🏘️  45 Biens immobiliers');
console.log('\n🔑 COMPTES :');
console.log('  admin@immopro.ci / admin123 (Super Admin)');
console.log('  agence.cocody@immopro.ci / agent123');
console.log('  agence.plateau@immopro.ci / agent123');
console.log('  agence.marcory@immopro.ci / agent123');
console.log('  kouame@email.ci / proprio123');
console.log('  diallo@email.ci / proprio123');
console.log('  yao@email.ci / proprio123');
console.log('  soro@email.ci / proprio123');
console.log('  konan@email.ci / proprio123');

await mongoose.disconnect();
console.log('\n👋 Terminé !');
