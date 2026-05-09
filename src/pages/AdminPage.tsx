import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice, categories } from '../store';
import {
  LayoutDashboard, ShoppingBag, CalendarDays, UtensilsCrossed,
  Users, Truck, DollarSign, CheckCircle, XCircle,
  Plus, Trash2, Eye, Package, BarChart3, Star,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';

type Tab = 'dashboard' | 'orders' | 'reservations' | 'menu' | 'tables' | 'livreurs' | 'clients' | 'avis' | 'rapports';

const statusColors: Record<string, string> = {
  en_attente: 'bg-yellow-100 text-yellow-700',
  confirmee: 'bg-blue-100 text-blue-700',
  indisponible: 'bg-red-100 text-red-700',
  en_preparation: 'bg-orange-100 text-orange-700',
  en_livraison: 'bg-purple-100 text-purple-700',
  livree: 'bg-green-100 text-green-700',
  annulee: 'bg-red-100 text-red-700',
  refusee: 'bg-red-100 text-red-700',
  terminee: 'bg-green-100 text-green-700',
  disponible: 'bg-green-100 text-green-700',
  reservee: 'bg-blue-100 text-blue-700',
  occupee: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  indisponible: 'Indisponible',
  en_preparation: 'En préparation',
  en_livraison: 'En livraison',
  livree: 'Livrée',
  annulee: 'Annulée',
  refusee: 'Refusée',
  terminee: 'Terminée',
  disponible: 'Disponible',
  reservee: 'Réservée',
  occupee: 'Occupée',
};

export default function AdminPage() {
  const {
    commandes, reservations, users, platsList, tablesList,
    updateOrderStatus, assignLivreur, updateReservationStatus,
    addPlat, updatePlat, deletePlat, addTable, updateTable, deleteTable,
    addLivreur, deleteLivreur,
    avis, deleteAvis,
    rapports, updateRapportStatus, deleteRapport,
  } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showAddPlat, setShowAddPlat] = useState(false);
  const [newPlat, setNewPlat] = useState({
    nom: '', description: '', prix: 0, image: '', categorieId: 'cat1',
    disponible: true, rating: 4.0, totalRatings: 0, tempsPreparation: 15
  });
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTable, setNewTable] = useState({ numero: 0, capacite: 2, statut: 'disponible' as const, emplacement: 'Intérieur' });
  const [showAddLivreur, setShowAddLivreur] = useState(false);
  const [newLivreur, setNewLivreur] = useState({ nom: '', prenom: '', email: '', password: '', telephone: '', adresse: '' });
  const [livreurErrors, setLivreurErrors] = useState<Record<string, string>>({});
  const [reponseText, setReponseText] = useState<Record<string, string>>({});
  const newRapports = rapports.filter(r => r.statut === 'nouveau').length;

  const livreurs = users.filter(u => u.role === 'livreur');
  const clients = users.filter(u => u.role === 'client');
  const totalRevenue = commandes.filter(c => c.statut === 'livree').reduce((s, c) => s + c.total, 0);
  const pendingOrders = commandes.filter(c => c.statut === 'en_attente').length;
  const pendingReservations = reservations.filter(r => r.statut === 'en_attente').length;

  const tabs: { key: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'orders', label: 'Commandes', icon: ShoppingBag, badge: pendingOrders },
    { key: 'reservations', label: 'Réservations', icon: CalendarDays, badge: pendingReservations },
    { key: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { key: 'tables', label: 'Tables', icon: BarChart3 },
    { key: 'livreurs', label: 'Livreurs', icon: Truck },
    { key: 'clients', label: 'Clients', icon: Users },
    { key: 'avis', label: 'Avis', icon: Star },
    { key: 'rapports', label: 'Rapports', icon: LayoutDashboard, badge: newRapports },
  ];

  const handleAddPlat = () => {
    if (!newPlat.nom || !newPlat.prix) return;
    addPlat({ ...newPlat, image: newPlat.image || 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600' });
    setNewPlat({ nom: '', description: '', prix: 0, image: '', categorieId: 'cat1', disponible: true, rating: 4.0, totalRatings: 0, tempsPreparation: 15 });
    setShowAddPlat(false);
  };

  const handleAddTable = () => {
    if (!newTable.numero) return;
    addTable(newTable);
    setNewTable({ numero: 0, capacite: 2, statut: 'disponible', emplacement: 'Intérieur' });
    setShowAddTable(false);
  };

  const updateLivreurField = (field: string, value: string) => {
    if (field === 'telephone') {
      value = value.replace(/[^0-9\s]/g, '').slice(0, 14);
    }
    if (field === 'nom' || field === 'prenom') {
      value = value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
    }
    setNewLivreur(prev => ({ ...prev, [field]: value }));
  };

  const validateLivreur = () => {
    const errors: Record<string, string> = {};
    if (!newLivreur.prenom.trim() || newLivreur.prenom.trim().length < 2) errors.prenom = 'Prénom invalide';
    if (!newLivreur.nom.trim() || newLivreur.nom.trim().length < 2) errors.nom = 'Nom invalide';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newLivreur.email)) errors.email = 'Email invalide';
    if (newLivreur.password.length < 6) errors.password = 'Min 6 caractères';
    else if (!/[0-9]/.test(newLivreur.password) || !/[a-zA-Z]/.test(newLivreur.password)) errors.password = 'Doit contenir lettres + chiffres';
    const phoneDigits = newLivreur.telephone.replace(/\s/g, '');
    if (phoneDigits.length < 10) errors.telephone = 'Min 10 chiffres';
    else if (!/^0[5-7]/.test(phoneDigits)) errors.telephone = 'Doit commencer par 05, 06 ou 07';
    if (!newLivreur.adresse.trim() || newLivreur.adresse.trim().length < 5) errors.adresse = 'Adresse invalide';
    setLivreurErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] fixed left-0 top-16">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 px-3 mb-4">Administration</h2>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <span className="flex items-center gap-2"><tab.icon className="w-4 h-4" />{tab.label}</span>
                  {tab.badge ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b overflow-x-auto no-scrollbar">
          <div className="flex px-4 py-2 gap-1">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === tab.key ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}>
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.badge ? <span className="bg-red-500 text-white text-xs px-1 rounded-full">{tab.badge}</span> : null}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 lg:ml-64 p-6 mt-12 lg:mt-0">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Revenus Total', value: formatPrice(totalRevenue), icon: DollarSign, color: 'from-green-500 to-emerald-600', change: '+12%', up: true },
                  { label: 'Commandes', value: commandes.length.toString(), icon: ShoppingBag, color: 'from-blue-500 to-indigo-600', change: '+8%', up: true },
                  { label: 'Réservations', value: reservations.length.toString(), icon: CalendarDays, color: 'from-purple-500 to-violet-600', change: '+5%', up: true },
                  { label: 'Clients', value: clients.length.toString(), icon: Users, color: 'from-primary-500 to-orange-600', change: '+15%', up: true },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Commandes récentes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 border-b">
                        <th className="pb-3 font-medium">ID</th>
                        <th className="pb-3 font-medium">Client</th>
                        <th className="pb-3 font-medium">Total</th>
                        <th className="pb-3 font-medium">Statut</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commandes.slice(0, 5).map(cmd => {
                        const client = users.find(u => u.id === cmd.clientId);
                        return (
                          <tr key={cmd.id} className="border-b last:border-0">
                            <td className="py-3 font-mono text-xs">#{cmd.id.slice(0, 8)}</td>
                            <td className="py-3">{client?.prenom} {client?.nom}</td>
                            <td className="py-3 font-medium">{formatPrice(cmd.total)}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[cmd.statut]}`}>
                                {statusLabels[cmd.statut]}
                              </span>
                            </td>
                            <td className="py-3 text-gray-500">{new Date(cmd.dateCommande).toLocaleDateString('fr-FR')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top dishes */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" /> Plats les plus populaires
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platsList.filter(p => p.popular).slice(0, 6).map(plat => (
                    <div key={plat.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <img src={plat.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{plat.nom}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-primary-600 text-sm font-bold">{formatPrice(plat.prix)}</span>
                          <span className="text-yellow-500 text-xs flex items-center gap-0.5">★ {plat.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
              {commandes.map(cmd => {
                const client = users.find(u => u.id === cmd.clientId);
                const livreur = users.find(u => u.id === cmd.livreurId);
                return (
                  <div key={cmd.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="font-bold text-gray-900">#{cmd.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{client?.prenom} {client?.nom} • {cmd.telephone}</p>
                        <p className="text-xs text-gray-400">{new Date(cmd.dateCommande).toLocaleString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[cmd.statut]}`}>
                          {statusLabels[cmd.statut]}
                        </span>
                        <span className="text-sm text-gray-500">{cmd.modePaiement === 'cash' ? '💵 Cash' : '💳 Carte'}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {cmd.items.map((item, idx) => {
                        const plat = platsList.find(p => p.id === item.platId);
                        return (
                          <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                            {plat && <img src={plat.image} alt="" className="w-8 h-8 rounded object-cover" />}
                            <span className="flex-1">{plat?.nom} × {item.quantite}</span>
                            <span>{formatPrice(item.prixUnitaire * item.quantite)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-500 flex items-center gap-1">📍 {cmd.adresseLivraison}</span>
                      <span className="font-bold text-primary-600 text-lg">{formatPrice(cmd.total)}</span>
                    </div>

                    {cmd.note && <p className="text-sm text-gray-500 italic mb-4">Note: {cmd.note}</p>}

                    <div className="flex flex-wrap gap-2 border-t pt-4">
                      {cmd.statut === 'en_attente' && (
                        <>
                          <button onClick={() => updateOrderStatus(cmd.id, 'confirmee')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Confirmer
                          </button>
                          <button onClick={() => updateOrderStatus(cmd.id, 'annulee')}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Refuser
                          </button>
                        </>
                      )}
                      {cmd.statut === 'confirmee' && (
                        <button onClick={() => updateOrderStatus(cmd.id, 'en_preparation')}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1">
                          <Package className="w-4 h-4" /> En préparation
                        </button>
                      )}
                      {cmd.statut === 'en_preparation' && (
                        <div className="flex items-center gap-2">
                          <select onChange={e => { if (e.target.value) assignLivreur(cmd.id, e.target.value); }}
                            defaultValue=""
                            className="px-3 py-2 border rounded-lg text-sm">
                            <option value="">Assigner livreur</option>
                            {livreurs.map(l => (
                              <option key={l.id} value={l.id}>{l.prenom} {l.nom}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {cmd.livreurId && (
                        <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 flex items-center gap-1">
                          <Truck className="w-4 h-4" /> Livreur: {livreur?.prenom} {livreur?.nom}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Reservations */}
          {activeTab === 'reservations' && (
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Réservations</h1>
              {reservations.map(res => {
                const client = users.find(u => u.id === res.clientId);
                const table = tablesList.find(t => t.id === res.tableId);
                return (
                  <div key={res.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900">#{res.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{client?.prenom} {client?.nom}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[res.statut]}`}>
                        {statusLabels[res.statut]}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                      <div><p className="text-gray-400 text-xs">Date</p><p className="font-medium">{res.dateReservation}</p></div>
                      <div><p className="text-gray-400 text-xs">Heure</p><p className="font-medium">{res.heure}</p></div>
                      <div><p className="text-gray-400 text-xs">Personnes</p><p className="font-medium">{res.nombrePersonnes}</p></div>
                      <div><p className="text-gray-400 text-xs">Table</p><p className="font-medium">N°{table?.numero} ({table?.emplacement})</p></div>
                    </div>
                    {res.note && <p className="text-sm text-gray-500 italic mb-4">Note: {res.note}</p>}

                    {res.statut === 'en_attente' && (
                      <div className="flex gap-2 border-t pt-4">
                        <button onClick={() => updateReservationStatus(res.id, 'confirmee')}
                          className="px-4 py-2 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Confirmer
                        </button>
                        <button onClick={() => updateReservationStatus(res.id, 'refusee')}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Refuser
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Menu Management */}
          {activeTab === 'menu' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gestion du Menu</h1>
                <button onClick={() => setShowAddPlat(true)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 flex items-center gap-2 shadow-lg">
                  <Plus className="w-4 h-4" /> Ajouter un plat
                </button>
              </div>

              {/* Add plat modal */}
              {showAddPlat && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-200">
                  <h3 className="font-bold mb-4">Nouveau plat</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nom du plat" value={newPlat.nom}
                      onChange={e => setNewPlat(p => ({ ...p, nom: e.target.value }))}
                      className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    <input type="number" placeholder="Prix (DA)" value={newPlat.prix || ''}
                      onChange={e => setNewPlat(p => ({ ...p, prix: Number(e.target.value) }))}
                      className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    <textarea placeholder="Description" value={newPlat.description}
                      onChange={e => setNewPlat(p => ({ ...p, description: e.target.value }))}
                      className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none sm:col-span-2 resize-none h-20" />
                    <select value={newPlat.categorieId} onChange={e => setNewPlat(p => ({ ...p, categorieId: e.target.value }))}
                      className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                    <input type="text" placeholder="URL de l'image" value={newPlat.image}
                      onChange={e => setNewPlat(p => ({ ...p, image: e.target.value }))}
                      className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={handleAddPlat} className="px-6 py-2 bg-accent-600 text-white rounded-xl font-medium hover:bg-accent-700">Ajouter</button>
                    <button onClick={() => setShowAddPlat(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">Annuler</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {platsList.map(plat => (
                  <div key={plat.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <div className="relative h-36 overflow-hidden">
                      <img src={plat.image} alt={plat.nom} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => updatePlat(plat.id, { disponible: !plat.disponible })}
                          className={`p-1.5 rounded-lg text-xs font-medium ${plat.disponible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                          {plat.disponible ? <Eye className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        </button>
                        <button onClick={() => deletePlat(plat.id)}
                          className="p-1.5 rounded-lg bg-red-500 text-white">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm">{plat.nom}</h3>
                        <span className="text-primary-600 font-bold text-sm">{formatPrice(plat.prix)}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{plat.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{categories.find(c => c.id === plat.categorieId)?.nom}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${plat.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {plat.disponible ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tables */}
          {activeTab === 'tables' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Tables</h1>
                <button onClick={() => setShowAddTable(true)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 flex items-center gap-2 shadow-lg">
                  <Plus className="w-4 h-4" /> Ajouter une table
                </button>
              </div>

              {showAddTable && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-200">
                  <h3 className="font-bold mb-4">Nouvelle table</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input type="number" placeholder="Numéro" value={newTable.numero || ''}
                      onChange={e => setNewTable(t => ({ ...t, numero: Number(e.target.value) }))}
                      className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    <input type="number" placeholder="Capacité" value={newTable.capacite}
                      onChange={e => setNewTable(t => ({ ...t, capacite: Number(e.target.value) }))}
                      className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    <select value={newTable.emplacement} onChange={e => setNewTable(t => ({ ...t, emplacement: e.target.value }))}
                      className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none">
                      <option>Intérieur</option><option>Terrasse</option><option>Salon privé</option><option>Grande salle</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={handleAddTable} className="px-6 py-2 bg-accent-600 text-white rounded-xl font-medium hover:bg-accent-700">Ajouter</button>
                    <button onClick={() => setShowAddTable(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">Annuler</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tablesList.map(table => {
                  const tableReservations = reservations.filter(r =>
                    r.tableId === table.id && ['en_attente', 'confirmee'].includes(r.statut)
                  );
                  return (
                    <div key={table.id} className={`bg-white rounded-2xl shadow-md p-5 border text-center ${
                      table.statut === 'indisponible' ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                    }`}>
                      <div className="text-4xl mb-3">{table.statut === 'indisponible' ? '🚫' : '🪑'}</div>
                      <h3 className="font-bold text-lg">Table {table.numero}</h3>
                      <p className="text-sm text-gray-500">{table.capacite} places</p>
                      <p className="text-xs text-gray-400 mb-2">{table.emplacement}</p>

                      {/* Bouton basculer disponible / indisponible */}
                      <button onClick={() => updateTable(table.id, {
                        statut: table.statut === 'disponible' ? 'indisponible' : 'disponible'
                      })}
                        className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all mb-2 ${
                          table.statut === 'disponible'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}>
                        {table.statut === 'disponible' ? '✅ Disponible' : '🚫 Indisponible'}
                      </button>

                      {/* Réservations actives */}
                      {tableReservations.length > 0 && (
                        <div className="mt-2 text-xs text-blue-600 bg-blue-50 rounded-lg p-2">
                          📅 {tableReservations.length} réservation{tableReservations.length > 1 ? 's' : ''} active{tableReservations.length > 1 ? 's' : ''}
                        </div>
                      )}

                      <button onClick={() => deleteTable(table.id)}
                        className="block mx-auto mt-3 text-red-500 hover:text-red-600 text-xs flex items-center gap-1 justify-center">
                        <Trash2 className="w-3 h-3" /> Supprimer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Livreurs */}
          {activeTab === 'livreurs' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Livreurs</h1>
                <button onClick={() => setShowAddLivreur(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 flex items-center gap-2 shadow-lg">
                  <Plus className="w-4 h-4" /> Ajouter un livreur
                </button>
              </div>

              {/* Formulaire ajout livreur */}
              {showAddLivreur && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200 animate-fade-in">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-500" /> Nouveau livreur
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                      <input type="text" placeholder="Prénom" value={newLivreur.prenom}
                        onChange={e => updateLivreurField('prenom', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${livreurErrors.prenom ? 'border-red-400' : 'border-gray-200'}`} />
                      {livreurErrors.prenom && <p className="text-red-500 text-xs mt-1">{livreurErrors.prenom}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input type="text" placeholder="Nom" value={newLivreur.nom}
                        onChange={e => updateLivreurField('nom', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${livreurErrors.nom ? 'border-red-400' : 'border-gray-200'}`} />
                      {livreurErrors.nom && <p className="text-red-500 text-xs mt-1">{livreurErrors.nom}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" placeholder="prenom@livreur.com" value={newLivreur.email}
                        onChange={e => updateLivreurField('email', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${livreurErrors.email ? 'border-red-400' : 'border-gray-200'}`} />
                      {livreurErrors.email && <p className="text-red-500 text-xs mt-1">{livreurErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                      <input type="text" placeholder="Min 6 caractères, lettres + chiffres" value={newLivreur.password}
                        onChange={e => updateLivreurField('password', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${livreurErrors.password ? 'border-red-400' : 'border-gray-200'}`} />
                      {livreurErrors.password && <p className="text-red-500 text-xs mt-1">{livreurErrors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                      <input type="tel" placeholder="0555 000 000" value={newLivreur.telephone}
                        onChange={e => updateLivreurField('telephone', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${livreurErrors.telephone ? 'border-red-400' : 'border-gray-200'}`} />
                      {livreurErrors.telephone && <p className="text-red-500 text-xs mt-1">{livreurErrors.telephone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                      <input type="text" placeholder="Adresse" value={newLivreur.adresse}
                        onChange={e => updateLivreurField('adresse', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${livreurErrors.adresse ? 'border-red-400' : 'border-gray-200'}`} />
                      {livreurErrors.adresse && <p className="text-red-500 text-xs mt-1">{livreurErrors.adresse}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => {
                      if (!validateLivreur()) return;
                      if (addLivreur(newLivreur)) {
                        setNewLivreur({ nom: '', prenom: '', email: '', password: '', telephone: '', adresse: '' });
                        setLivreurErrors({});
                        setShowAddLivreur(false);
                      }
                    }} className="px-6 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600">
                      Ajouter
                    </button>
                    <button onClick={() => setShowAddLivreur(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {livreurs.map(l => {
                  const activeOrders = commandes.filter(c => c.livreurId === l.id && c.statut === 'en_livraison').length;
                  const deliveredOrders = commandes.filter(c => c.livreurId === l.id && c.statut === 'livree').length;
                  return (
                    <div key={l.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {l.prenom[0]}{l.nom[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold">{l.prenom} {l.nom}</h3>
                          <p className="text-sm text-gray-500">{l.telephone}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mb-3 space-y-1">
                        <p>📧 {l.email}</p>
                        <p>📍 {l.adresse || 'Non renseignée'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center mb-3">
                        <div className="bg-blue-50 p-3 rounded-xl">
                          <p className="text-lg font-bold text-blue-600">{activeOrders}</p>
                          <p className="text-xs text-blue-500">En cours</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl">
                          <p className="text-lg font-bold text-green-600">{deliveredOrders}</p>
                          <p className="text-xs text-green-500">Livrées</p>
                        </div>
                      </div>
                      <button onClick={() => deleteLivreur(l.id)}
                        className="w-full py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                        <Trash2 className="w-3 h-3" /> Supprimer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clients */}
          {activeTab === 'clients' && (
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-gray-500">
                        <th className="px-6 py-3 font-medium">Client</th>
                        <th className="px-6 py-3 font-medium">Email</th>
                        <th className="px-6 py-3 font-medium">Téléphone</th>
                        <th className="px-6 py-3 font-medium">Commandes</th>
                        <th className="px-6 py-3 font-medium">Adresse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map(c => (
                        <tr key={c.id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xs font-bold">
                                {c.prenom[0]}{c.nom[0]}
                              </div>
                              <span className="font-medium">{c.prenom} {c.nom}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{c.email}</td>
                          <td className="px-6 py-4 text-gray-500">{c.telephone}</td>
                          <td className="px-6 py-4 font-medium">{commandes.filter(cmd => cmd.clientId === c.id).length}</td>
                          <td className="px-6 py-4 text-gray-500 text-xs">{c.adresse}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Avis */}
          {activeTab === 'avis' && (
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Avis</h1>
              {avis.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun avis pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {avis.map(review => {
                    const client = users.find(u => u.id === review.clientId);
                    const plat = platsList.find(p => p.id === review.platId);
                    return (
                      <div key={review.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                            {client?.prenom?.[0]}{client?.nom?.[0]}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{client?.prenom} {client?.nom}</h4>
                            <p className="text-xs text-gray-400">{review.date}</p>
                          </div>
                          {plat && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                              <img src={plat.image} alt="" className="w-8 h-8 rounded object-cover" />
                              <span className="text-sm font-medium text-gray-700">{plat.nom}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex text-yellow-400 text-sm mb-2">
                          {Array.from({ length: review.note }).map((_, i) => <span key={i}>★</span>)}
                          {Array.from({ length: 5 - review.note }).map((_, i) => <span key={i} className="text-gray-200">★</span>)}
                          <span className="ml-2 text-gray-500 text-xs">{review.note}/5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600 text-sm flex-1">{review.commentaire}</p>
                          <button onClick={() => deleteAvis(review.id)}
                            className="ml-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium flex items-center gap-1 transition-colors">
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Rapports */}
          {activeTab === 'rapports' && (
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Rapports</h1>
              {rapports.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow">
                  <LayoutDashboard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun rapport pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rapports.map(rapport => {
                    const client = users.find(u => u.id === rapport.clientId);
                    const sujetLabels: Record<string, string> = {
                      commande: '📦 Problème de commande',
                      livraison: '🛵 Problème de livraison',
                      qualite: '🍽️ Qualité du plat',
                      service: '👤 Service client',
                      autre: '💬 Autre',
                    };
                    const statusRapport: Record<string, { label: string; color: string }> = {
                      nouveau: { label: '🔴 Nouveau', color: 'bg-red-100 text-red-700' },
                      en_cours: { label: '🟡 En cours', color: 'bg-yellow-100 text-yellow-700' },
                      resolu: { label: '✅ Résolu', color: 'bg-green-100 text-green-700' },
                    };
                    const st = statusRapport[rapport.statut];
                    return (
                      <div key={rapport.id} className={`bg-white rounded-2xl shadow-md p-6 border ${
                        rapport.statut === 'nouveau' ? 'border-red-200' : 'border-gray-100'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                              {client?.prenom?.[0]}{client?.nom?.[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{client?.prenom} {client?.nom}</p>
                              <p className="text-xs text-gray-400">{rapport.date} • {client?.email}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${st.color}`}>
                            {st.label}
                          </span>
                        </div>

                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">{sujetLabels[rapport.sujet]}</span>
                        </div>

                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl mb-4">{rapport.message}</p>

                        {rapport.reponseAdmin && (
                          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-4">
                            <p className="text-xs text-blue-500 font-medium mb-1">👨‍💼 Votre réponse :</p>
                            <p className="text-sm text-blue-800">{rapport.reponseAdmin}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3 border-t pt-4">
                          {rapport.statut !== 'resolu' && (
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Répondre au client</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Votre réponse..."
                                  value={reponseText[rapport.id] || ''}
                                  onChange={e => setReponseText(prev => ({ ...prev, [rapport.id]: e.target.value }))}
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <button
                                  onClick={() => {
                                    const txt = reponseText[rapport.id]?.trim();
                                    if (txt) {
                                      updateRapportStatus(rapport.id, 'en_cours', txt);
                                      setReponseText(prev => ({ ...prev, [rapport.id]: '' }));
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
                                  Répondre
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2 flex-wrap">
                            {rapport.statut === 'nouveau' && (
                              <button onClick={() => updateRapportStatus(rapport.id, 'en_cours')}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 flex items-center gap-1">
                                🟡 Marquer en cours
                              </button>
                            )}
                            {rapport.statut !== 'resolu' && (
                              <button onClick={() => updateRapportStatus(rapport.id, 'resolu')}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center gap-1">
                                ✅ Marquer résolu
                              </button>
                            )}
                            <button onClick={() => deleteRapport(rapport.id)}
                              className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                              <Trash2 className="w-3 h-3" /> Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
