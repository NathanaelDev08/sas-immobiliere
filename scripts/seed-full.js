import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sas-immo';
await mongoose.connect(MONGO_URI);
console.log('✅ Connecté');

// Modèles
const userSchema = new mongoose.Schema({
  email: String, phone: String, password: String, role: String,
  nom: String, prenom: String, isActive: { type: Boolean, default: true }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const subSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: String, prix: Number, commission: Number, maxBiens: Number,
  biensCount: Number, statut: String
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

// Nettoyer
await User.deleteMany({ email: /@vendeur\.ci$/ });
await Subscription.deleteMany({});
await Property.deleteMany({});
console.log('🧹 Nettoyé');

// Créer 3 vendeurs
const vendeursData = [
  { email: 'kone@vendeur.ci', phone: '0100000101', nom: 'Koné', prenom: 'Ibrahim', plan: 'pro', commission: 5, maxBiens: 15 },
  { email: 'traore@vendeur.ci', phone: '0100000102', nom: 'Traoré', prenom: 'Aminata', plan: 'business', commission: 3, maxBiens: 20 },
  { email: 'bamba@vendeur.ci', phone: '0100000103', nom: 'Bamba', prenom: 'Moussa', plan: 'basic', commission: 7, maxBiens: 8 },
];

const vendeurs = [];
for (const v of vendeursData) {
  const user = await User.create({
    email: v.email, phone: v.phone,
    password: await bcrypt.hash('vendeur123', 10),
    role: 'proprietaire', nom: v.nom, prenom: v.prenom
  });
  await Subscription.create({
    user: user._id, plan: v.plan, commission: v.commission,
    maxBiens: v.maxBiens, biensCount: 0, statut: 'actif'
  });
  vendeurs.push(user);
}
console.log('✅ 3 vendeurs créés');

// 35 biens
const biens = [
  // Résidences meublées location (15) - Vendeur 1
  { titre: 'Résidence Meublée Cocody', description: 'Appartement meublé haut standing', type: 'residentiel', transaction: 'location', prix: 350000, surface: 90, pieces: 3, chambres: 2, douches: 1, standing: 'haut', ville: 'Abidjan', quartier: 'Cocody', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Studio Meublé Plateau', description: 'Studio moderne équipé', type: 'residentiel', transaction: 'location', prix: 250000, surface: 45, pieces: 1, chambres: 1, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Plateau', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Appartement Meublé Marcory', description: 'Bel appartement avec vue', type: 'residentiel', transaction: 'location', prix: 400000, surface: 110, pieces: 4, chambres: 3, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Marcory', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Résidence Meublée Yopougon', description: 'Maison meublée familiale', type: 'residentiel', transaction: 'location', prix: 200000, surface: 80, pieces: 3, chambres: 2, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Yopougon', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Duplex Meublé Bingerville', description: 'Duplex avec piscine', type: 'residentiel', transaction: 'location', prix: 600000, surface: 200, pieces: 5, chambres: 4, douches: 3, standing: 'luxe', ville: 'Abidjan', quartier: 'Bingerville', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Appartement Meublé Koumassi', description: 'Appartement rénové', type: 'residentiel', transaction: 'location', prix: 180000, surface: 65, pieces: 2, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Koumassi', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Résidence Meublée Abobo', description: 'Villa meublée spacieuse', type: 'residentiel', transaction: 'location', prix: 300000, surface: 130, pieces: 4, chambres: 3, douches: 2, standing: 'moyen', ville: 'Abidjan', quartier: 'Abobo', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Studio Meublé Treichville', description: 'Studio centre-ville', type: 'residentiel', transaction: 'location', prix: 220000, surface: 40, pieces: 1, chambres: 1, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Treichville', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Résidence Meublée Port-Bouët', description: 'Belle résidence proche aéroport', type: 'residentiel', transaction: 'location', prix: 450000, surface: 150, pieces: 4, chambres: 3, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Port-Bouët', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Appartement Meublé Zone 4', description: 'Appartement luxueux', type: 'residentiel', transaction: 'location', prix: 550000, surface: 120, pieces: 3, chambres: 2, douches: 2, standing: 'luxe', ville: 'Abidjan', quartier: 'Zone 4', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Résidence Meublée Grand-Bassam', description: 'Villa en bord de mer', type: 'residentiel', transaction: 'location', prix: 700000, surface: 250, pieces: 6, chambres: 5, douches: 3, standing: 'luxe', ville: 'Grand-Bassam', quartier: 'Centre', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Studio Meublé Adjamé', description: 'Studio pratique', type: 'residentiel', transaction: 'location', prix: 150000, surface: 35, pieces: 1, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Adjamé', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Résidence Meublée Cocody 2', description: 'Appartement moderne', type: 'residentiel', transaction: 'location', prix: 380000, surface: 95, pieces: 3, chambres: 2, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Cocody', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Appartement Meublé Plateau 2', description: 'Appartement business', type: 'residentiel', transaction: 'location', prix: 500000, surface: 100, pieces: 3, chambres: 2, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Plateau', proprietaire: vendeurs[0]._id, statut: 'publie' },
  { titre: 'Résidence Meublée Yamoussoukro', description: 'Villa meublée capitale', type: 'residentiel', transaction: 'location', prix: 280000, surface: 160, pieces: 4, chambres: 3, douches: 2, standing: 'moyen', ville: 'Yamoussoukro', quartier: 'Centre', proprietaire: vendeurs[0]._id, statut: 'publie' },
  // Biens vente (10) - Vendeur 2
  { titre: 'Villa Cocody Palmeraie', description: 'Magnifique villa avec piscine', type: 'residentiel', transaction: 'vente', prix: 250000000, surface: 400, pieces: 7, chambres: 5, douches: 4, standing: 'luxe', ville: 'Abidjan', quartier: 'Cocody', proprietaire: vendeurs[1]._id, statut: 'publie' },
  { titre: 'Terrain Bingerville 500m²', description: 'Terrain prêt à construire', type: 'terrain', transaction: 'vente', prix: 35000000, surface: 500, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Bingerville', proprietaire: vendeurs[1]._id, statut: 'publie' },
  { titre: 'Appartement Plateau Luxe', description: 'Appartement au cœur des affaires', type: 'residentiel', transaction: 'vente', prix: 180000000, surface: 180, pieces: 4, chambres: 3, douches: 2, standing: 'luxe', ville: 'Abidjan', quartier: 'Plateau', proprietaire: vendeurs[1]._id, statut: 'publie' },
  { titre: 'Boutique Marcory', description: 'Local commercial bien situé', type: 'commercial', transaction: 'vente', prix: 45000000, surface: 80, pieces: 1, chambres: 0, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Marcory', proprietaire: vendeurs[1]._id, statut: 'publie' },
  { titre: 'Terrain Yopougon 1000m²', description: 'Grand terrain pour projet', type: 'terrain', transaction: 'vente', prix: 50000000, surface: 1000, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Abidjan', quartier: 'Yopougon', proprietaire: vendeurs[1]._id, statut: 'publie' },
  { titre: 'Villa Grand-Bassam', description: 'Villa pieds dans l\'eau', type: 'residentiel', transaction: 'vente', prix: 320000000, surface: 500, pieces: 8, chambres: 6, douches: 5, standing: 'luxe', ville: 'Grand-Bassam', quartier: 'Bord de mer', proprietaire: vendeurs[1]._id, statut: 'publie' },
  { titre: 'Duplex Zone 4C', description: 'Duplex moderne', type: 'residentiel', transaction: 'vente', prix: 150000000, surface: 250, pieces: 5, chambres: 4, douches: 3, standing: 'haut', ville: 'Abidjan', quartier: 'Zone 4C', proprietaire: vendeurs[1]._id, statut: 'publie' },
  { titre: 'Entrepôt Yopougon', description: 'Entrepôt industriel', type: 'commercial', transaction: 'vente', prix: 75000000, surface: 600, pieces: 1, chambres: 0, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Yopougon', proprietaire: vendeurs[1]._id, statut: 'publie' },
  { titre: 'Appartement Koumassi', description: 'Appartement familial', type: 'residentiel', transaction: 'vente', prix: 35000000, surface: 90, pieces: 3, chambres: 2, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Koumassi', proprietaire: vendeurs[1]._id, statut: 'publie' },
  { titre: 'Terrain Assinie', description: 'Terrain paradisiaque', type: 'terrain', transaction: 'vente', prix: 120000000, surface: 2000, pieces: 0, chambres: 0, douches: 0, standing: 'luxe', ville: 'Assinie', quartier: 'Bord de mer', proprietaire: vendeurs[1]._id, statut: 'publie' },
  // Biens variés (10) - Vendeur 3
  { titre: 'Studio Abobo', description: 'Studio économique', type: 'residentiel', transaction: 'location', prix: 80000, surface: 30, pieces: 1, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Abobo', proprietaire: vendeurs[2]._id, statut: 'publie' },
  { titre: 'Magasin Treichville', description: 'Magasin centre commercial', type: 'commercial', transaction: 'location', prix: 300000, surface: 120, pieces: 1, chambres: 0, douches: 1, standing: 'moyen', ville: 'Abidjan', quartier: 'Treichville', proprietaire: vendeurs[2]._id, statut: 'publie' },
  { titre: 'Appartement Port-Bouët', description: 'Appartement proche plage', type: 'residentiel', transaction: 'vente', prix: 28000000, surface: 75, pieces: 2, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Port-Bouët', proprietaire: vendeurs[2]._id, statut: 'publie' },
  { titre: 'Terrain San Pedro', description: 'Terrain agricole', type: 'terrain', transaction: 'vente', prix: 15000000, surface: 3000, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'San Pedro', quartier: 'Zone rurale', proprietaire: vendeurs[2]._id, statut: 'publie' },
  { titre: 'Villa Korhogo', description: 'Belle villa au nord', type: 'residentiel', transaction: 'vente', prix: 45000000, surface: 200, pieces: 4, chambres: 3, douches: 2, standing: 'moyen', ville: 'Korhogo', quartier: 'Résidentiel', proprietaire: vendeurs[2]._id, statut: 'publie' },
  { titre: 'Bureau Plateau', description: 'Bureau professionnel', type: 'commercial', transaction: 'location', prix: 400000, surface: 60, pieces: 1, chambres: 0, douches: 1, standing: 'haut', ville: 'Abidjan', quartier: 'Plateau', proprietaire: vendeurs[2]._id, statut: 'publie' },
  { titre: 'Appartement Adjamé', description: 'Appartement rénové', type: 'residentiel', transaction: 'location', prix: 120000, surface: 55, pieces: 2, chambres: 1, douches: 1, standing: 'standard', ville: 'Abidjan', quartier: 'Adjamé', proprietaire: vendeurs[2]._id, statut: 'publie' },
  { titre: 'Villa Bouaké', description: 'Grande villa centre-ville', type: 'residentiel', transaction: 'vente', prix: 65000000, surface: 280, pieces: 5, chambres: 4, douches: 2, standing: 'haut', ville: 'Bouaké', quartier: 'Centre', proprietaire: vendeurs[2]._id, statut: 'publie' },
  { titre: 'Terrain Daloa', description: 'Terrain constructible', type: 'terrain', transaction: 'vente', prix: 8000000, surface: 600, pieces: 0, chambres: 0, douches: 0, standing: 'standard', ville: 'Daloa', quartier: 'Extension', proprietaire: vendeurs[2]._id, statut: 'publie' },
  { titre: 'Restaurant Cocody', description: 'Fonds de commerce restaurant', type: 'commercial', transaction: 'vente', prix: 85000000, surface: 200, pieces: 3, chambres: 0, douches: 2, standing: 'haut', ville: 'Abidjan', quartier: 'Cocody', proprietaire: vendeurs[2]._id, statut: 'publie' },
];

await Property.insertMany(biens);

// Mettre à jour compteurs
for (const v of vendeurs) {
  const count = await Property.countDocuments({ proprietaire: v._id });
  await Subscription.updateOne({ user: v._id }, { biensCount: count });
}

console.log(`✅ ${biens.length} biens créés`);
console.log('📧 Comptes vendeurs (mot de passe: vendeur123) :');
console.log('   kone@vendeur.ci - pro (15 biens location meublée)');
console.log('   traore@vendeur.ci - business (10 biens vente)');
console.log('   bamba@vendeur.ci - basic (10 biens variés)');

await mongoose.disconnect();
console.log('👋 Terminé');
