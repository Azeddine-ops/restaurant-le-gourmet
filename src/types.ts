export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
  adresse: string;
  role: 'client' | 'admin' | 'livreur' | 'chef';
  avatar?: string;
}

export interface Category {
  id: string;
  nom: string;
  image: string;
  icon: string;
}

export interface Plat {
  id: string;
  nom: string;
  description: string;
  prix: number;
  image: string;
  categorieId: string;
  disponible: boolean;
  rating: number;
  totalRatings: number;
  popular?: boolean;
  promotion?: number;
  tempsPreparation: number;
}

export interface TableRestaurant {
  id: string;
  numero: number;
  capacite: number;
  statut: 'disponible' | 'indisponible';
  emplacement: string;
}

export interface CartItem {
  plat: Plat;
  quantite: number;
}

export interface CommandeLivraison {
  id: string;
  clientId: string;
  livreurId?: string;
  adresseLivraison: string;
  telephone: string;
  total: number;
  statut: 'en_attente' | 'confirmee' | 'en_preparation' | 'en_livraison' | 'livree' | 'annulee';
  modePaiement: 'cash' | 'carte';
  dateCommande: string;
  note: string;
  items: { platId: string; quantite: number; prixUnitaire: number }[];
  fraisLivraison: number;
  estimationLivraison?: string;
}

export interface Reservation {
  id: string;
  clientId: string;
  tableId: string;
  dateReservation: string;
  heure: string;
  nombrePersonnes: number;
  statut: 'en_attente' | 'confirmee' | 'refusee' | 'terminee' | 'annulee';
  note: string;
  platsPrecommandes?: { platId: string; quantite: number }[];
}

export interface Avis {
  id: string;
  clientId: string;
  platId: string;
  note: number;
  commentaire: string;
  date: string;
}

export interface PromoCode {
  id: string;
  code: string;
  reduction: number;
  type: 'pourcentage' | 'fixe';
  actif: boolean;
  dateExpiration: string;
}

export interface Rapport {
  id: string;
  clientId: string;
  sujet: 'commande' | 'livraison' | 'qualite' | 'service' | 'autre';
  message: string;
  statut: 'nouveau' | 'en_cours' | 'resolu';
  date: string;
  reponseAdmin?: string;
}
