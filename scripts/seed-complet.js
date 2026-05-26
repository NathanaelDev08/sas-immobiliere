import "dotenv/config";
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sas-immo';
await mongoose.connect(MONGO_URI);
console.log('✅ Connecté à MongoDB\n');

// ============ MODÈLES ============
const User = mongoose.model('User', new mongoose.Schema({
  email: String, phone: String, password: String, role: String,
  nom: String, prenom: String, photo: String, isActive: Boolean
}, { timestamps: true }));

const Subscription = mongoose.model('Subscription', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: String, prix: Number, commission: Number, maxBiens: Number,
  biensCount: Number, statut: String
}, { timestamps: true }));

const Property = mongoose.model('Property', new mongoose.Schema({
  titre: String, description: String, type: String, transaction: String,
  prix: Number, surface: Number, pieces: Number, chambres: Number, douches: Number,
  standing: String, ville: String, quartier: String,
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  statut: String, vues: Number, contacts: Number, photos: [String]
}, { timestamps: true }));

const Locataire = mongoose.model('Locataire', new mongoose.Schema({
  nom: String, prenom: String, email: String, phone: String,
  adresse: String, profession: String, bien: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  loyer: Number, dateDebut: Date, dateFin: Date, statut: String
}, { timestamps: true }));

const Contrat = mongoose.model('Contrat', new mongoose.Schema({
  reference: String, locataireNom: String, locataireEmail: String, locatairePhone: String,
  bienId: String, type: String, dateDebut: String, dateFin: String,
  loyer: Number, caution: Number, statut: String
}, { timestamps: true }));

const Visite = mongoose.model('Visite', new mongoose.Schema({
  bien: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  client: { nom: String, email: String, phone: String },
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateDemandee: Date, heure: String, statut: String
}, { timestamps: true }));

const Paiement = mongoose.model('Paiement', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String, methode: String, montant: Number, telephone: String,
  reference: String, statut: String
}, { timestamps: true }));

const Notification = mongoose.model('Notification', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String, titre: String, message: String, lu: Boolean
}, { timestamps: true }));

// ============ NETTOYAGE ============
await Promise.all([
  User.deleteMany({}), Subscription.deleteMany({}), Property.deleteMany({}),
  Locataire.deleteMany({}), Contrat.deleteMany({}), Visite.deleteMany({}),
  Paiement.deleteMany({}), Notification.deleteMany({})
]);
console.log('🧹 Base nettoyée\n');

// ============ 1. SUPER ADMIN ============
const superAdmin = await User.create({
  email: 'admin@immopro.ci', phone: '0100000000',
  password: await bcrypt.hash('admin123', 10),
  role: 'super_admin', nom: 'Kouassi', prenom: 'Yannick', isActive: true
});

// ============ 2. AGENTS (3) ============
const agentsData = [
  { email: 'cocody@agence.ci', phone: '0701010101', nom: 'Touré', prenom: 'Seydou', role: 'agent', plan: 'business', commission: 5, maxBiens: 30 },
  { email: 'plateau@agence.ci', phone: '0702020202', nom: 'Bakayoko', prenom: 'Kadidiatou', role: 'agent', plan: 'business', commission: 4, maxBiens: 25 },
  { email: 'marcory@agence.ci', phone: '0703030303', nom: 'Koné', prenom: 'Lassina', role: 'agent', plan: 'pro', commission: 6, maxBiens: 20 },
];
const agents = [];
for (const a of agentsData) {
  const u = await User.create({ email: a.email, phone: a.phone, password: await bcrypt.hash('agent123', 10), role: a.role, nom: a.nom, prenom: a.prenom, isActive: true });
  await Subscription.create({ user: u._id, plan: a.plan, commission: a.commission, maxBiens: a.maxBiens, biensCount: 0, statut: 'actif' });
  agents.push(u);
}

// ============ 3. PROPRIÉTAIRES (6) ============
const propriosData = [
  { email: 'kouame.michel@email.ci', phone: '0501000001', nom: 'Kouamé', prenom: 'Michel', plan: 'pro', maxBiens: 15 },
  { email: 'diallo.aissata@email.ci', phone: '0502000002', nom: 'Diallo', prenom: 'Aïssata', plan: 'basic', maxBiens: 8 },
  { email: 'yao.koffi@email.ci', phone: '0503000003', nom: 'Yao', prenom: 'Koffi', plan: 'pro', maxBiens: 12 },
  { email: 'soro.salimata@email.ci', phone: '0504000004', nom: 'Soro', prenom: 'Salimata', plan: 'basic', maxBiens: 5 },
  { email: 'konan.venance@email.ci', phone: '0505000005', nom: 'Konan', prenom: 'Venance', plan: 'pro', maxBiens: 10 },
  { email: 'ouattara.fanta@email.ci', phone: '0506000006', nom: 'Ouattara', prenom: 'Fanta', plan: 'basic', maxBiens: 6 },
];
const proprios = [];
for (const p of propriosData) {
  const u = await User.create({ email: p.email, phone: p.phone, password: await bcrypt.hash('proprio123', 10), role: 'proprietaire', nom: p.nom, prenom: p.prenom, isActive: true });
  await Subscription.create({ user: u._id, plan: p.plan, commission: 5, maxBiens: p.maxBiens, biensCount: 0, statut: 'actif' });
  proprios.push(u);
}

console.log('✅ 1 Super Admin + 3 Agents + 6 Propriétaires créés\n');

// ============ 4. BIENS (45) ============
const allBiens = [
  // Agent Cocody
  { titre: 'Villa Moderne Palmeraie', description: 'Superbe villa 5 chambres avec piscine à débordement, jardin 800m², cuisine équipée, clim centrale, sécurité vidéo.', type: 'residentiel', transaction: 'vente', prix: 350000000, surface: 450, pieces: 8, chambres: 5, douches: 4, standing: 'luxe', ville: 'Abidjan', quartier: 'Cocody Palmeraie', proprietaire: agents[0]._id, statut: 'publie', vues: 245, contacts: 12 },
  { titre: 'Appartement Standing Riviera', description: 'Appartement 3 chambres rénové, salon double, cuisine américaine, balcon vue panoramique, parking sécurisé.', type: 'residentiel', transaction: 'location', prix: 650000, surface: 120, pieces: 4, chambres: 3, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Cocody Riviera', proprietaire: agents[0]._id, statut: 'publie', vues: 180, contacts: 8 },
  { titre: 'Terrain Constructible Angré', description: 'Terrain viabilisé 600m², titre foncier dispo, quartier calme et sécurisé.', type: 'terrain', transaction: 'vente', prix: 85000000, surface: 600, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Cocody Angré', proprietaire: agents[0]._id, statut: 'publie', vues: 90, contacts: 5 },
  { titre: 'Studio Meublé 2 Plateaux', description: 'Studio moderne meublé, eau et électricité inclus, proche commerces.', type: 'residentiel', transaction: 'location', prix: 200000, surface: 35, pieces: 1, chambres: 1, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: '2 Plateaux', proprietaire: agents[0]._id, statut: 'loue', vues: 320, contacts: 18 },
  { titre: 'Duplex Luxe Cocody', description: 'Duplex finitions luxe, 4 chambres suites, piscine privée, garage 3 voitures.', type: 'residentiel', transaction: 'vente', prix: 420000000, surface: 380, pieces: 7, chambres: 4, douches: 4, standing: 'luxe', ville: 'Abidjan', quartier: 'Cocody', proprietaire: agents[0]._id, statut: 'publie', vues: 156, contacts: 7 },
  { titre: 'Boutique Cocody St Jean', description: 'Local commercial 80m² axe passant, idéal commerce ou bureau.', type: 'commercial', transaction: 'location', prix: 350000, surface: 80, pieces: 1, chambres: 0, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Cocody St Jean', proprietaire: agents[0]._id, statut: 'publie', vues: 67, contacts: 3 },
  { titre: 'Résidence Meublée Bonoumin', description: 'Résidence meublée expatriés, 3 chambres, jardin, gardien.', type: 'residentiel', transaction: 'location', prix: 800000, surface: 200, pieces: 5, chambres: 3, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Bonoumin', proprietaire: agents[0]._id, statut: 'publie', vues: 210, contacts: 11 },

  // Agent Plateau
  { titre: 'Bureau Premium Plateau', description: 'Bureau standing au cœur du quartier d\'affaires, étage élevé, vue panoramique.', type: 'commercial', transaction: 'location', prix: 1200000, surface: 150, pieces: 3, chambres: 0, douches: 2, standing: 'luxe', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agents[1]._id, statut: 'publie', vues: 178, contacts: 15 },
  { titre: 'Immeuble de Rapport', description: 'Immeuble R+3 de 12 appartements, entièrement loué, rendement 8%/an.', type: 'commercial', transaction: 'vente', prix: 850000000, surface: 800, pieces: 12, chambres: 24, douches: 12, standing: 'moyen', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agents[1]._id, statut: 'publie', vues: 340, contacts: 22 },
  { titre: 'Penthouse Vue Mer', description: 'Penthouse d\'exception, 3 chambres, terrasse 100m², finitions marbre.', type: 'residentiel', transaction: 'vente', prix: 580000000, surface: 250, pieces: 5, chambres: 3, douches: 3, standing: 'luxe', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agents[1]._id, statut: 'publie', vues: 198, contacts: 9 },
  { titre: 'Coworking Space', description: 'Espace coworking 30 postes, salle réunion, internet fibre, café inclus.', type: 'commercial', transaction: 'location', prix: 1800000, surface: 200, pieces: 3, chambres: 0, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agents[1]._id, statut: 'publie', vues: 145, contacts: 20 },
  { titre: 'Restaurant Plateau', description: 'Fonds de commerce restaurant gastronomique, clientèle affaires établie.', type: 'commercial', transaction: 'vente', prix: 150000000, surface: 180, pieces: 4, chambres: 0, douches: 3, standing: 'haut', ville: 'Abidjan', quartier: 'Plateau', proprietaire: agents[1]._id, statut: 'publie', vues: 230, contacts: 16 },

  // Agent Marcory
  { titre: 'Villa Zone 4C', description: 'Villa moderne quartier prisé, 4 chambres, jardin, piscine, clim.', type: 'residentiel', transaction: 'vente', prix: 280000000, surface: 350, pieces: 6, chambres: 4, douches: 3, standing: 'haut', ville: 'Abidjan', quartier: 'Marcory Zone 4C', proprietaire: agents[2]._id, statut: 'publie', vues: 267, contacts: 14 },
  { titre: 'Showroom Automobile', description: 'Showroom 500m² sur boulevard, grande vitrine, idéal concession.', type: 'commercial', transaction: 'location', prix: 2500000, surface: 500, pieces: 2, chambres: 0, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Marcory', proprietaire: agents[2]._id, statut: 'publie', vues: 89, contacts: 6 },
  { titre: 'Terrain Zone 4', description: 'Terrain résidentiel 700m², quartier calme, idéal construction villa.', type: 'terrain', transaction: 'vente', prix: 120000000, surface: 700, pieces: 0, chambres: 0, douches: 0, standing: 'haut', ville: 'Abidjan', quartier: 'Marcory Zone 4', proprietaire: agents[2]._id, statut: 'vendu', vues: 450, contacts: 35 },
  { titre: 'Entrepôt Stockage', description: 'Entrepôt sécurisé 1000m², quai chargement, accessible camions.', type: 'commercial', transaction: 'location', prix: 1500000, surface: 1000, pieces: 1, chambres: 0, douches: 2, standing: 'standard', ville: 'Abidjan', quartier: 'Marcory', proprietaire: agents[2]._id, statut: 'publie', vues: 56, contacts: 4 },

  // Propriétaires
  { titre: 'Villa Yopougon', description: 'Villa familiale 3 chambres, quartier calme, proche commodités.', type: 'residentiel', transaction: 'vente', prix: 45000000, surface: 200, pieces: 5, chambres: 3, douches: 2, standing: 'standard', ville: 'Abidjan', quartier: 'Yopougon', proprietaire: proprios[0]._id, statut: 'publie', vues: 123, contacts: 8 },
  { titre: 'Studio Treichville', description: 'Studio économique proche gare et commerces.', type: 'residentiel', transaction: 'location', prix: 90000, surface: 28, pieces: 1, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Treichville', proprietaire: proprios[0]._id, statut: 'publie', vues: 200, contacts: 12 },
  { titre: 'Bureau Cocody', description: 'Bureau équipé 40m², idéal freelance, internet inclus.', type: 'commercial', transaction: 'location', prix: 200000, surface: 40, pieces: 1, chambres: 0, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Cocody', proprietaire: proprios[0]._id, statut: 'publie', vues: 78, contacts: 5 },
  { titre: 'Appartement Abobo', description: 'Appartement 2 chambres idéal petit budget.', type: 'residentiel', transaction: 'location', prix: 100000, surface: 65, pieces: 2, chambres: 2, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Abobo', proprietaire: proprios[1]._id, statut: 'publie', vues: 167, contacts: 10 },
  { titre: 'Maison Port-Bouët', description: 'Maison 2 chambres proche aéroport.', type: 'residentiel', transaction: 'location', prix: 250000, surface: 100, pieces: 3, chambres: 2, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Port-Bouët', proprietaire: proprios[1]._id, statut: 'publie', vues: 134, contacts: 7 },
  { titre: 'Appartement Yamoussoukro', description: 'Appartement 3 chambres dans la capitale.', type: 'residentiel', transaction: 'location', prix: 300000, surface: 120, pieces: 4, chambres: 3, douches: 2, standing: 'moyen', ville: 'Yamoussoukro', quartier: 'Centre', proprietaire: proprios[1]._id, statut: 'publie', vues: 45, contacts: 3 },
  { titre: 'Terrain Bingerville', description: 'Grand terrain 1500m², idéal projet immobilier.', type: 'terrain', transaction: 'vente', prix: 65000000, surface: 1500, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Bingerville', proprietaire: proprios[2]._id, statut: 'publie', vues: 112, contacts: 8 },
  { titre: 'Terrain San Pedro', description: 'Terrain bord de mer 3000m², projet touristique.', type: 'terrain', transaction: 'vente', prix: 200000000, surface: 3000, pieces: 0, chambres: 0, douches: 0, standing: 'luxe', ville: 'San Pedro', quartier: 'Bord de mer', proprietaire: proprios[2]._id, statut: 'publie', vues: 78, contacts: 5 },
  { titre: 'Terrain Bouaké', description: 'Terrain constructible 800m² centre-ville.', type: 'terrain', transaction: 'vente', prix: 35000000, surface: 800, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Bouaké', quartier: 'Centre', proprietaire: proprios[2]._id, statut: 'publie', vues: 34, contacts: 2 },
  { titre: 'Boutique Koumassi', description: 'Petite boutique de quartier, commerce proximité.', type: 'commercial', transaction: 'location', prix: 80000, surface: 25, pieces: 1, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Koumassi', proprietaire: proprios[3]._id, statut: 'publie', vues: 89, contacts: 6 },
  { titre: 'Appartement Adjamé', description: 'Appartement rénové 2 chambres proche grand marché.', type: 'residentiel', transaction: 'vente', prix: 25000000, surface: 70, pieces: 3, chambres: 2, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Adjamé', proprietaire: proprios[3]._id, statut: 'publie', vues: 156, contacts: 9 },
  { titre: 'Local Commercial Korhogo', description: 'Local commercial 90m² bien situé.', type: 'commercial', transaction: 'vente', prix: 40000000, surface: 90, pieces: 1, chambres: 0, douches: 1, standing: 'standard', ville: 'Korhogo', quartier: 'Centre', proprietaire: proprios[3]._id, statut: 'publie', vues: 23, contacts: 1 },
  { titre: 'Villa Grand-Bassam', description: 'Villa bord de mer 4 chambres, idéal résidence secondaire.', type: 'residentiel', transaction: 'vente', prix: 180000000, surface: 300, pieces: 6, chambres: 4, douches: 3, standing: 'haut', ville: 'Grand-Bassam', quartier: 'Bord de mer', proprietaire: proprios[4]._id, statut: 'publie', vues: 289, contacts: 18 },
  { titre: 'Villa Assinie', description: 'Villa pieds dans l\'eau 5 chambres, piscine, plage privée.', type: 'residentiel', transaction: 'vente', prix: 450000000, surface: 500, pieces: 8, chambres: 5, douches: 5, standing: 'luxe', ville: 'Assinie', quartier: 'Bord de mer', proprietaire: proprios[4]._id, statut: 'publie', vues: 410, contacts: 28 },
  { titre: 'Résidence Meublée Daloa', description: 'Résidence meublée 2 chambres, climatisée.', type: 'residentiel', transaction: 'location', prix: 180000, surface: 75, pieces: 3, chambres: 2, douches: 1, standing: 'standard', ville: 'Daloa', quartier: 'Résidentiel', proprietaire: proprios[4]._id, statut: 'publie', vues: 31, contacts: 2 },
  { titre: 'Villa Abobo Rénovée', description: 'Villa entièrement rénovée, 3 chambres, grand terrain.', type: 'residentiel', transaction: 'vente', prix: 35000000, surface: 250, pieces: 5, chambres: 3, douches: 2, standing: 'standard', ville: 'Abidjan', quartier: 'Abobo', proprietaire: proprios[5]._id, statut: 'publie', vues: 98, contacts: 6 },
  { titre: 'Studio Cocody', description: 'Studio étudiant proche universités.', type: 'residentiel', transaction: 'location', prix: 130000, surface: 30, pieces: 1, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Cocody', proprietaire: proprios[5]._id, statut: 'publie', vues: 190, contacts: 14 },
  { titre: 'Terrain Yamoussoukro', description: 'Terrain 1000m² quartier administratif.', type: 'terrain', transaction: 'vente', prix: 25000000, surface: 1000, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Yamoussoukro', quartier: 'Administratif', proprietaire: proprios[5]._id, statut: 'publie', vues: 41, contacts: 3 },
];

const createdBiens = await Property.insertMany(allBiens);

// Mise à jour compteurs abonnements
const allUsers = [...agents, ...proprios];
for (const u of allUsers) {
  const count = await Property.countDocuments({ proprietaire: u._id });
  await Subscription.updateOne({ user: u._id }, { biensCount: count });
}

console.log(`✅ ${createdBiens.length} biens créés\n`);

// ============ 5. LOCATAIRES (15) ============
const locatairesData = [
  { nom: 'Camara', prenom: 'Mamadou', email: 'camara@email.ci', phone: '0101010101', adresse: 'Cocody', profession: 'Informaticien', bien: createdBiens[3]._id, loyer: 200000, dateDebut: '2026-01-01', dateFin: '2027-01-01', statut: 'Actif' },
  { nom: 'Bamba', prenom: 'Fatoumata', email: 'bamba@email.ci', phone: '0102020202', adresse: 'Plateau', profession: 'Avocate', bien: createdBiens[6]._id, loyer: 800000, dateDebut: '2026-03-15', dateFin: '2027-03-15', statut: 'Actif' },
  { nom: 'Koffi', prenom: 'Aya', email: 'koffi@email.ci', phone: '0103030303', adresse: 'Marcory', profession: 'Médecin', bien: createdBiens[16]._id, loyer: 90000, dateDebut: '2026-02-01', dateFin: '2027-02-01', statut: 'Actif' },
  { nom: 'Ouédraogo', prenom: 'Issouf', email: 'ouedraogo@email.ci', phone: '0104040404', adresse: 'Yopougon', profession: 'Commerçant', bien: createdBiens[1]._id, loyer: 650000, dateDebut: '2026-04-01', dateFin: '2027-04-01', statut: 'Actif' },
  { nom: 'Koné', prenom: 'Naminata', email: 'kone@email.ci', phone: '0105050505', adresse: 'Abobo', profession: 'Enseignante', bien: createdBiens[19]._id, loyer: 100000, dateDebut: '2026-01-15', dateFin: '2027-01-15', statut: 'Actif' },
  { nom: 'Traoré', prenom: 'Bakary', email: 'traore@email.ci', phone: '0106060606', adresse: 'Port-Bouët', profession: 'Douanier', bien: createdBiens[20]._id, loyer: 250000, dateDebut: '2026-05-01', dateFin: '2027-05-01', statut: 'Actif' },
  { nom: 'Coulibaly', prenom: 'Aminata', email: 'coulibaly@email.ci', phone: '0107070707', adresse: 'Yamoussoukro', profession: 'Fonctionnaire', bien: createdBiens[21]._id, loyer: 300000, dateDebut: '2026-03-01', dateFin: '2027-03-01', statut: 'Actif' },
  { nom: 'Sawadogo', prenom: 'Moussa', email: 'sawadogo@email.ci', phone: '0108080808', adresse: 'Treichville', profession: 'Chauffeur', bien: createdBiens[17]._id, loyer: 90000, dateDebut: '2026-02-15', dateFin: '2027-02-15', statut: 'Actif' },
  { nom: 'Diarra', prenom: 'Salimata', email: 'diarra@email.ci', phone: '0109090909', adresse: 'Daloa', profession: 'Infirmière', bien: createdBiens[29]._id, loyer: 180000, dateDebut: '2026-04-15', dateFin: '2027-04-15', statut: 'Actif' },
  { nom: 'Touré', prenom: 'Siaka', email: 'toure@email.ci', phone: '0110101010', adresse: 'Cocody', profession: 'Étudiant', bien: createdBiens[30]._id, loyer: 130000, dateDebut: '2026-06-01', dateFin: '2027-06-01', statut: 'Actif' },
  { nom: 'Keita', prenom: 'Mariam', email: 'keita@email.ci', phone: '0111111111', adresse: 'Plateau', profession: 'Consultante', bien: createdBiens[7]._id, loyer: 1200000, dateDebut: '2026-01-01', dateFin: '2028-01-01', statut: 'Actif' },
  { nom: 'Barry', prenom: 'Alpha', email: 'barry@email.ci', phone: '0112121212', adresse: 'Cocody', profession: 'Entrepreneur', bien: createdBiens[10]._id, loyer: 1800000, dateDebut: '2026-03-01', dateFin: '2027-03-01', statut: 'Actif' },
  { nom: 'Sylla', prenom: 'Kadiatou', email: 'sylla@email.ci', phone: '0113131313', adresse: 'Marcory', profession: 'Comptable', bien: createdBiens[11]._id, loyer: 2500000, dateDebut: '2026-02-01', dateFin: '2028-02-01', statut: 'Actif' },
  { nom: 'Fofana', prenom: 'Ibrahima', email: 'fofana@email.ci', phone: '0114141414', adresse: 'Koumassi', profession: 'Boutiquier', bien: createdBiens[24]._id, loyer: 80000, dateDebut: '2026-05-15', dateFin: '2027-05-15', statut: 'Actif' },
  { nom: 'Cissé', prenom: 'Djeneba', email: 'cisse@email.ci', phone: '0115151515', adresse: 'Bingerville', profession: 'Retraitée', bien: createdBiens[15]._id, loyer: 200000, dateDebut: '2026-04-01', dateFin: '2027-04-01', statut: 'Actif' },
];
const createdLocataires = await Locataire.insertMany(locatairesData);
console.log(`✅ ${createdLocataires.length} locataires créés\n`);

// ============ 6. CONTRATS (12) ============
const contratsData = [
  { reference: 'CTR-2026-001', locataireNom: 'Camara Mamadou', locataireEmail: 'camara@email.ci', locatairePhone: '0101010101', bienId: createdBiens[3]._id.toString(), type: 'bail_1an', dateDebut: '2026-01-01', dateFin: '2027-01-01', loyer: 200000, caution: 200000, statut: 'Actif' },
  { reference: 'CTR-2026-002', locataireNom: 'Bamba Fatoumata', locataireEmail: 'bamba@email.ci', locatairePhone: '0102020202', bienId: createdBiens[6]._id.toString(), type: 'bail_1an', dateDebut: '2026-03-15', dateFin: '2027-03-15', loyer: 800000, caution: 800000, statut: 'Actif' },
  { reference: 'CTR-2026-003', locataireNom: 'Koffi Aya', locataireEmail: 'koffi@email.ci', locatairePhone: '0103030303', bienId: createdBiens[16]._id.toString(), type: 'bail_1an', dateDebut: '2026-02-01', dateFin: '2027-02-01', loyer: 90000, caution: 90000, statut: 'Actif' },
  { reference: 'CTR-2026-004', locataireNom: 'Ouédraogo Issouf', locataireEmail: 'ouedraogo@email.ci', locatairePhone: '0104040404', bienId: createdBiens[1]._id.toString(), type: 'bail_1an', dateDebut: '2026-04-01', dateFin: '2027-04-01', loyer: 650000, caution: 650000, statut: 'Actif' },
  { reference: 'CTR-2026-005', locataireNom: 'Koné Naminata', locataireEmail: 'kone@email.ci', locatairePhone: '0105050505', bienId: createdBiens[19]._id.toString(), type: 'bail_1an', dateDebut: '2026-01-15', dateFin: '2027-01-15', loyer: 100000, caution: 100000, statut: 'Actif' },
  { reference: 'CTR-2026-006', locataireNom: 'Keita Mariam', locataireEmail: 'keita@email.ci', locatairePhone: '0111111111', bienId: createdBiens[7]._id.toString(), type: 'bail_3ans', dateDebut: '2026-01-01', dateFin: '2029-01-01', loyer: 1200000, caution: 3600000, statut: 'Actif' },
  { reference: 'CTR-2026-007', locataireNom: 'Barry Alpha', locataireEmail: 'barry@email.ci', locatairePhone: '0112121212', bienId: createdBiens[10]._id.toString(), type: 'bail_1an', dateDebut: '2026-03-01', dateFin: '2027-03-01', loyer: 1800000, caution: 1800000, statut: 'Actif' },
  { reference: 'CTR-2026-008', locataireNom: 'Sylla Kadiatou', locataireEmail: 'sylla@email.ci', locatairePhone: '0113131313', bienId: createdBiens[11]._id.toString(), type: 'bail_commercial', dateDebut: '2026-02-01', dateFin: '2029-02-01', loyer: 2500000, caution: 7500000, statut: 'Actif' },
  { reference: 'CTR-2026-009', locataireNom: 'Traoré Bakary', locataireEmail: 'traore@email.ci', locatairePhone: '0106060606', bienId: createdBiens[20]._id.toString(), type: 'bail_1an', dateDebut: '2026-05-01', dateFin: '2027-05-01', loyer: 250000, caution: 250000, statut: 'Actif' },
  { reference: 'CTR-2026-010', locataireNom: 'Coulibaly Aminata', locataireEmail: 'coulibaly@email.ci', locatairePhone: '0107070707', bienId: createdBiens[21]._id.toString(), type: 'bail_1an', dateDebut: '2026-03-01', dateFin: '2027-03-01', loyer: 300000, caution: 300000, statut: 'Actif' },
  { reference: 'CTR-2026-011', locataireNom: 'Diarra Salimata', locataireEmail: 'diarra@email.ci', locatairePhone: '0109090909', bienId: createdBiens[29]._id.toString(), type: 'bail_1an', dateDebut: '2026-04-15', dateFin: '2027-04-15', loyer: 180000, caution: 180000, statut: 'Actif' },
  { reference: 'CTR-2026-012', locataireNom: 'Touré Siaka', locataireEmail: 'toure@email.ci', locatairePhone: '0110101010', bienId: createdBiens[30]._id.toString(), type: 'bail_1an', dateDebut: '2026-06-01', dateFin: '2027-06-01', loyer: 130000, caution: 130000, statut: 'Actif' },
];
const createdContrats = await Contrat.insertMany(contratsData);
console.log(`✅ ${createdContrats.length} contrats créés\n`);

// ============ 7. VISITES (20) ============
const visitesData = [
  { bien: createdBiens[0]._id, client: { nom: 'Koné Ibrahim', email: 'ibrahim@email.ci', phone: '0707070707' }, proprietaire: agents[0]._id, dateDemandee: new Date('2026-06-05'), heure: '10:00', statut: 'confirmee' },
  { bien: createdBiens[0]._id, client: { nom: 'Traoré Aminata', email: 'aminata@email.ci', phone: '0707070708' }, proprietaire: agents[0]._id, dateDemandee: new Date('2026-06-06'), heure: '14:00', statut: 'demande' },
  { bien: createdBiens[1]._id, client: { nom: 'Bamba Moussa', email: 'moussa@email.ci', phone: '0707070709' }, proprietaire: agents[0]._id, dateDemandee: new Date('2026-06-03'), heure: '11:00', statut: 'effectuee' },
  { bien: createdBiens[4]._id, client: { nom: 'Diallo Fatou', email: 'fatou@email.ci', phone: '0707070710' }, proprietaire: agents[0]._id, dateDemandee: new Date('2026-06-08'), heure: '09:00', statut: 'confirmee' },
  { bien: createdBiens[7]._id, client: { nom: 'Yao Kouassi', email: 'kouassi@email.ci', phone: '0707070711' }, proprietaire: agents[1]._id, dateDemandee: new Date('2026-06-07'), heure: '15:00', statut: 'demande' },
  { bien: createdBiens[8]._id, client: { nom: 'Soro Amadou', email: 'amadou@email.ci', phone: '0707070712' }, proprietaire: agents[1]._id, dateDemandee: new Date('2026-06-10'), heure: '10:00', statut: 'demande' },
  { bien: createdBiens[9]._id, client: { nom: 'Konan Adama', email: 'adama@email.ci', phone: '0707070713' }, proprietaire: agents[1]._id, dateDemandee: new Date('2026-06-12'), heure: '16:00', statut: 'demande' },
  { bien: createdBiens[12]._id, client: { nom: 'Ouattara Karim', email: 'karim@email.ci', phone: '0707070714' }, proprietaire: agents[2]._id, dateDemandee: new Date('2026-06-04'), heure: '11:00', statut: 'confirmee' },
  { bien: createdBiens[13]._id, client: { nom: 'Fofana Sékou', email: 'sekou@email.ci', phone: '0707070715' }, proprietaire: agents[2]._id, dateDemandee: new Date('2026-06-09'), heure: '14:00', statut: 'annulee' },
  { bien: createdBiens[15]._id, client: { nom: 'Cissé Mariam', email: 'mariam@email.ci', phone: '0707070716' }, proprietaire: proprios[0]._id, dateDemandee: new Date('2026-06-11'), heure: '10:00', statut: 'demande' },
  { bien: createdBiens[16]._id, client: { nom: 'Keita Boubacar', email: 'boubacar@email.ci', phone: '0707070717' }, proprietaire: proprios[0]._id, dateDemandee: new Date('2026-06-02'), heure: '09:00', statut: 'effectuee' },
  { bien: createdBiens[22]._id, client: { nom: 'Barry Oumou', email: 'oumou@email.ci', phone: '0707070718' }, proprietaire: proprios[2]._id, dateDemandee: new Date('2026-06-15'), heure: '15:00', statut: 'demande' },
  { bien: createdBiens[26]._id, client: { nom: 'Sylla Mory', email: 'mory@email.ci', phone: '0707070719' }, proprietaire: proprios[4]._id, dateDemandee: new Date('2026-06-14'), heure: '11:00', statut: 'confirmee' },
  { bien: createdBiens[27]._id, client: { nom: 'Touré Assetou', email: 'assetou@email.ci', phone: '0707070720' }, proprietaire: proprios[4]._id, dateDemandee: new Date('2026-06-05'), heure: '10:30', statut: 'effectuee' },
  { bien: createdBiens[0]._id, client: { nom: 'Diabaté Vieux', email: 'vieux@email.ci', phone: '0707070721' }, proprietaire: agents[0]._id, dateDemandee: new Date('2026-06-16'), heure: '14:00', statut: 'demande' },
  { bien: createdBiens[4]._id, client: { nom: 'Kouyaté Nana', email: 'nana@email.ci', phone: '0707070722' }, proprietaire: agents[0]._id, dateDemandee: new Date('2026-06-17'), heure: '09:00', statut: 'demande' },
  { bien: createdBiens[7]._id, client: { nom: 'Sangaré Drissa', email: 'drissa@email.ci', phone: '0707070723' }, proprietaire: agents[1]._id, dateDemandee: new Date('2026-06-18'), heure: '16:00', statut: 'demande' },
  { bien: createdBiens[8]._id, client: { nom: 'Doumbia Salif', email: 'salif@email.ci', phone: '0707070724' }, proprietaire: agents[1]._id, dateDemandee: new Date('2026-06-20'), heure: '10:00', statut: 'demande' },
  { bien: createdBiens[12]._id, client: { nom: 'Kaboré Adèle', email: 'adele@email.ci', phone: '0707070725' }, proprietaire: agents[2]._id, dateDemandee: new Date('2026-06-19'), heure: '11:00', statut: 'demande' },
  { bien: createdBiens[15]._id, client: { nom: 'Zongo Pascal', email: 'pascal@email.ci', phone: '0707070726' }, proprietaire: proprios[0]._id, dateDemandee: new Date('2026-06-22'), heure: '15:00', statut: 'demande' },
];
const createdVisites = await Visite.insertMany(visitesData);
console.log(`✅ ${createdVisites.length} visites créées\n`);

// ============ 8. PAIEMENTS (25) ============
const allUserIds = [superAdmin._id, ...agents.map(a => a._id), ...proprios.map(p => p._id)];
const methodes = ['wave', 'orange_money', 'mtn_money', 'carte'];
const paiementsData = [];
for (let i = 0; i < 25; i++) {
  const user = allUserIds[Math.floor(Math.random() * allUserIds.length)];
  const methode = methodes[Math.floor(Math.random() * methodes.length)];
  const type = Math.random() > 0.5 ? 'abonnement' : 'commission';
  const montant = type === 'abonnement' ? [15000, 25000, 50000][Math.floor(Math.random() * 3)] : [15000, 35000, 75000, 150000][Math.floor(Math.random() * 4)];
  paiementsData.push({
    user, type, methode, montant,
    telephone: '01' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
    reference: 'PAY-' + Date.now() + '-' + i,
    statut: Math.random() > 0.2 ? 'complete' : 'en_attente'
  });
}
const createdPaiements = await Paiement.insertMany(paiementsData);
console.log(`✅ ${createdPaiements.length} paiements créés\n`);

// ============ 9. NOTIFICATIONS (30) ============
const notificationsData = [];
for (let i = 0; i < 30; i++) {
  const user = allUserIds[Math.floor(Math.random() * allUserIds.length)];
  const types = ['contact', 'visite', 'transaction', 'systeme'];
  const type = types[Math.floor(Math.random() * types.length)];
  const titres = {
    contact: 'Nouveau contact client',
    visite: 'Visite programmée',
    transaction: 'Paiement reçu',
    systeme: 'Mise à jour système'
  };
  const messages = {
    contact: 'Un client souhaite être mis en relation avec vous.',
    visite: 'Une visite est prévue pour demain à 10h.',
    transaction: 'Un paiement de 25 000 FCFA a été reçu.',
    systeme: 'Votre abonnement a été renouvelé.'
  };
  notificationsData.push({
    user,
    type,
    titre: titres[type],
    message: messages[type],
    lu: Math.random() > 0.5
  });
}
const createdNotifs = await Notification.insertMany(notificationsData);
console.log(`✅ ${createdNotifs.length} notifications créées\n`);

// ============ RÉSUMÉ ============
console.log('═══════════════════════════════════');
console.log('📊 DONNÉES DE TEST CRÉÉES');
console.log('═══════════════════════════════════');
console.log('👤 1  Super Admin');
console.log('🏢 3  Agents immobiliers');
console.log('🏠 6  Propriétaires');
console.log('🏘️  33 Biens immobiliers');
console.log('👥 15 Locataires');
console.log('📄 12 Contrats');
console.log('📅 20 Visites');
console.log('💳 25 Paiements');
console.log('🔔 30 Notifications');
console.log('═══════════════════════════════════');
console.log('\n🔑 COMPTES :');
console.log('  Super Admin : admin@immopro.ci / admin123');
console.log('  Agents      : cocody@agence.ci / agent123');
console.log('               plateau@agence.ci / agent123');
console.log('               marcory@agence.ci / agent123');
console.log('  Proprios    : kouame.michel@email.ci / proprio123');
console.log('               diallo.aissata@email.ci / proprio123');
console.log('               yao.koffi@email.ci / proprio123');
console.log('               ... (voir liste ci-dessus)');

await mongoose.disconnect();
console.log('\n👋 Terminé !');
