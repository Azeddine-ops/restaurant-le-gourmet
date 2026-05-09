import { User, Category, Plat, TableRestaurant, CommandeLivraison, Reservation, Avis, PromoCode } from './types';

// ===== MOCK DATA =====
export const categories: Category[] = [
  { id: 'cat1', nom: 'Entrées', image: '🥗', icon: '🥗' },
  { id: 'cat2', nom: 'Plats Principaux', image: '🍖', icon: '🍖' },
  { id: 'cat3', nom: 'Pizzas', image: '🍕', icon: '🍕' },
  { id: 'cat4', nom: 'Burgers', image: '🍔', icon: '🍔' },
  { id: 'cat5', nom: 'Pâtes', image: '🍝', icon: '🍝' },
  { id: 'cat6', nom: 'Desserts', image: '🍰', icon: '🍰' },
  { id: 'cat7', nom: 'Boissons', image: '🥤', icon: '🥤' },
  { id: 'cat8', nom: 'Grillades', image: '🥩', icon: '🥩' },
];

export const plats: Plat[] = [
  { id: 'p1', nom: 'Salade César', description: 'Laitue romaine fraîche, croûtons croustillants, parmesan et sauce César maison', prix: 850, image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat1', disponible: true, rating: 4.5, totalRatings: 128, popular: true, tempsPreparation: 10 },
  { id: 'p2', nom: 'Soupe à l\'Oignon', description: 'Soupe traditionnelle à l\'oignon gratinée au fromage Gruyère', prix: 650, image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat1', disponible: true, rating: 4.3, totalRatings: 85, tempsPreparation: 15 },
  { id: 'p3', nom: 'Bruschetta Tomates', description: 'Pain grillé garni de tomates fraîches, basilic et huile d\'olive extra vierge', prix: 550, image: 'https://images.pexels.com/photos/7432991/pexels-photo-7432991.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat1', disponible: true, rating: 4.2, totalRatings: 64, tempsPreparation: 8 },
  { id: 'p4', nom: 'Steak Frites', description: 'Entrecôte grillée à point accompagnée de frites maison et sauce au poivre', prix: 2200, image: 'https://images.pexels.com/photos/1352264/pexels-photo-1352264.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat2', disponible: true, rating: 4.8, totalRatings: 256, popular: true, tempsPreparation: 25 },
  { id: 'p5', nom: 'Poulet Rôti aux Herbes', description: 'Poulet fermier rôti avec thym, romarin et légumes de saison', prix: 1800, image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat2', disponible: true, rating: 4.6, totalRatings: 189, tempsPreparation: 30 },
  { id: 'p6', nom: 'Tajine d\'Agneau', description: 'Tajine traditionnel d\'agneau aux pruneaux et amandes, parfumé au safran', prix: 2500, image: 'https://images.pexels.com/photos/6546428/pexels-photo-6546428.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat2', disponible: true, rating: 4.9, totalRatings: 312, popular: true, promotion: 15, tempsPreparation: 35 },
  { id: 'p7', nom: 'Pizza Margherita', description: 'Base tomate, mozzarella di bufala, basilic frais et huile d\'olive', prix: 1200, image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat3', disponible: true, rating: 4.4, totalRatings: 203, tempsPreparation: 18 },
  { id: 'p8', nom: 'Pizza 4 Fromages', description: 'Mozzarella, gorgonzola, parmesan et chèvre sur base crème', prix: 1400, image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat3', disponible: true, rating: 4.6, totalRatings: 178, popular: true, tempsPreparation: 20 },
  { id: 'p9', nom: 'Burger Classic', description: 'Steak haché 180g, cheddar, laitue, tomate, oignon et sauce spéciale', prix: 1100, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat4', disponible: true, rating: 4.5, totalRatings: 234, popular: true, tempsPreparation: 15 },
  { id: 'p10', nom: 'Burger Double Smash', description: 'Double steak smashé, double cheddar, bacon croustillant et sauce BBQ maison', prix: 1500, image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat4', disponible: true, rating: 4.7, totalRatings: 156, promotion: 10, tempsPreparation: 18 },
  { id: 'p11', nom: 'Spaghetti Bolognaise', description: 'Spaghetti al dente avec sauce bolognaise maison mijotée 4 heures', prix: 1000, image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat5', disponible: true, rating: 4.3, totalRatings: 145, tempsPreparation: 15 },
  { id: 'p12', nom: 'Penne Carbonara', description: 'Penne à la crème, lardons fumés, parmesan et poivre noir', prix: 1100, image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat5', disponible: true, rating: 4.4, totalRatings: 112, tempsPreparation: 15 },
  { id: 'p13', nom: 'Tiramisu', description: 'Tiramisu classique au mascarpone et café espresso', prix: 650, image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat6', disponible: true, rating: 4.7, totalRatings: 198, popular: true, tempsPreparation: 5 },
  { id: 'p14', nom: 'Crème Brûlée', description: 'Crème onctueuse à la vanille de Madagascar caramélisée', prix: 550, image: 'https://images.pexels.com/photos/4040694/pexels-photo-4040694.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat6', disponible: true, rating: 4.5, totalRatings: 134, tempsPreparation: 5 },
  { id: 'p15', nom: 'Mojito Frais', description: 'Menthe fraîche, citron vert, sucre de canne et eau gazeuse', prix: 450, image: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat7', disponible: true, rating: 4.6, totalRatings: 167, tempsPreparation: 3 },
  { id: 'p16', nom: 'Smoothie Tropical', description: 'Mangue, ananas, fruit de la passion et lait de coco', prix: 500, image: 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat7', disponible: true, rating: 4.4, totalRatings: 89, tempsPreparation: 5 },
  { id: 'p17', nom: 'Côtes d\'Agneau Grillées', description: 'Côtes d\'agneau marinées aux herbes, grillées sur charbon de bois', prix: 2800, image: 'https://images.pexels.com/photos/13304044/pexels-photo-13304044.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat8', disponible: true, rating: 4.8, totalRatings: 201, popular: true, tempsPreparation: 30 },
  { id: 'p18', nom: 'Brochettes Mixtes', description: 'Assortiment de brochettes: poulet, agneau et kefta avec légumes grillés', prix: 1900, image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=600', categorieId: 'cat8', disponible: true, rating: 4.6, totalRatings: 176, tempsPreparation: 25 },
];

export const tables: TableRestaurant[] = [
  { id: 't1', numero: 1, capacite: 2, statut: 'disponible', emplacement: 'Terrasse' },
  { id: 't2', numero: 2, capacite: 2, statut: 'disponible', emplacement: 'Terrasse' },
  { id: 't3', numero: 3, capacite: 4, statut: 'disponible', emplacement: 'Intérieur' },
  { id: 't4', numero: 4, capacite: 4, statut: 'disponible', emplacement: 'Intérieur' },
  { id: 't5', numero: 5, capacite: 6, statut: 'disponible', emplacement: 'Intérieur' },
  { id: 't6', numero: 6, capacite: 6, statut: 'disponible', emplacement: 'Salon privé' },
  { id: 't7', numero: 7, capacite: 8, statut: 'disponible', emplacement: 'Salon privé' },
  { id: 't8', numero: 8, capacite: 10, statut: 'disponible', emplacement: 'Grande salle' },
];

export const users: User[] = [
  { id: 'u1', nom: 'Admin', prenom: 'System', email: 'admin@legourmet.com', password: 'admin123', telephone: '0555000001', adresse: 'Restaurant Le Gourmet', role: 'admin' },
  { id: 'u2', nom: 'Benali', prenom: 'Ahmed', email: 'ahmed@email.com', password: 'client123', telephone: '0555123456', adresse: '12 Rue Didouche Mourad, Alger', role: 'client' },
  { id: 'u3', nom: 'Kaci', prenom: 'Youcef', email: 'youcef@livreur.com', password: 'livreur123', telephone: '0555789012', adresse: 'Alger Centre', role: 'livreur' },
  { id: 'u4', nom: 'Boudia', prenom: 'Karim', email: 'karim@livreur.com', password: 'livreur123', telephone: '0555789013', adresse: 'Bab El Oued', role: 'livreur' },
];

export const promoCodes: PromoCode[] = [
  { id: 'promo1', code: 'BIENVENUE', reduction: 20, type: 'pourcentage', actif: true, dateExpiration: '2026-12-31' },
  { id: 'promo2', code: 'GRATUIT200', reduction: 200, type: 'fixe', actif: true, dateExpiration: '2026-06-30' },
];

export const initialCommandes: CommandeLivraison[] = [
  {
    id: 'cmd1', clientId: 'u2', livreurId: 'u3', adresseLivraison: '12 Rue Didouche Mourad, Alger',
    telephone: '0555123456', total: 3850, statut: 'livree', modePaiement: 'cash',
    dateCommande: '2026-01-15T14:30:00', note: 'Sans oignon svp',
    items: [{ platId: 'p4', quantite: 1, prixUnitaire: 2200 }, { platId: 'p1', quantite: 1, prixUnitaire: 850 }],
    fraisLivraison: 300, estimationLivraison: '35 min'
  },
  {
    id: 'cmd2', clientId: 'u2', adresseLivraison: '12 Rue Didouche Mourad, Alger',
    telephone: '0555123456', total: 2700, statut: 'en_preparation', modePaiement: 'carte',
    dateCommande: '2026-01-20T18:00:00', note: '',
    items: [{ platId: 'p7', quantite: 1, prixUnitaire: 1200 }, { platId: 'p9', quantite: 1, prixUnitaire: 1100 }],
    fraisLivraison: 300, estimationLivraison: '40 min'
  },
];

export const initialReservations: Reservation[] = [
  {
    id: 'res1', clientId: 'u2', tableId: 't4', dateReservation: '2026-01-22',
    heure: '20:00', nombrePersonnes: 4, statut: 'confirmee', note: 'Anniversaire'
  },
];

export const initialAvis: Avis[] = [
  { id: 'a1', clientId: 'u2', platId: 'p6', note: 5, commentaire: 'Excellent tajine, comme chez grand-mère!', date: '2026-01-16' },
  { id: 'a2', clientId: 'u2', platId: 'p4', note: 4, commentaire: 'Très bon steak, cuisson parfaite.', date: '2026-01-16' },
];

// Helper to format price in DA
export function formatPrice(prix: number): string {
  return `${prix.toLocaleString('fr-FR')} DA`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
