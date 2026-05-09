import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../store';
import {
  ShoppingBag, CalendarDays, Star, Clock, MapPin, Phone,
  Package, CheckCircle, XCircle, Truck as TruckIcon,
  AlertCircle, Trash2
} from 'lucide-react';

const statusMap: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmee: { label: 'Confirmée', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  en_preparation: { label: 'En préparation', color: 'bg-orange-100 text-orange-700', icon: Package },
  en_livraison: { label: 'En livraison', color: 'bg-purple-100 text-purple-700', icon: TruckIcon },
  livree: { label: 'Livrée', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  annulee: { label: 'Annulée', color: 'bg-red-100 text-red-700', icon: XCircle },
  refusee: { label: 'Refusée', color: 'bg-red-100 text-red-700', icon: XCircle },
  terminee: { label: 'Terminée', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

export default function ProfilePage() {
  const { currentUser, commandes, reservations, platsList, avis, addAvis, deleteAvis, tablesList } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'reviews'>('orders');
  const [reviewPlat, setReviewPlat] = useState('');
  const [reviewNote, setReviewNote] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!currentUser) return null;

  const myOrders = commandes.filter(c => c.clientId === currentUser.id).sort((a, b) =>
    new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime()
  );
  const myReservations = reservations.filter(r => r.clientId === currentUser.id);
  const myReviews = avis.filter(a => a.clientId === currentUser.id);

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewPlat) return;
    addAvis({ clientId: currentUser.id, platId: reviewPlat, note: reviewNote, commentaire: reviewComment });
    setReviewPlat('');
    setReviewComment('');
    setReviewNote(5);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold">
              {currentUser.prenom[0]}{currentUser.nom[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentUser.prenom} {currentUser.nom}</h1>
              <p className="text-primary-100 flex items-center gap-2 mt-1"><Phone className="w-4 h-4" /> {currentUser.telephone}</p>
              <p className="text-primary-100 flex items-center gap-2"><MapPin className="w-4 h-4" /> {currentUser.adresse}</p>
            </div>
          </div>
          <div className="relative flex gap-6 mt-6">
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">{myOrders.length}</p>
              <p className="text-xs text-primary-200">Commandes</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">{myReservations.length}</p>
              <p className="text-xs text-primary-200">Réservations</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">{myReviews.length}</p>
              <p className="text-xs text-primary-200">Avis</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {[
            { key: 'orders' as const, label: 'Mes Commandes', icon: ShoppingBag },
            { key: 'reservations' as const, label: 'Mes Réservations', icon: CalendarDays },
            { key: 'reviews' as const, label: 'Mes Avis', icon: Star },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune commande pour le moment</p>
              </div>
            ) : myOrders.map(order => {
              const st = statusMap[order.statut];
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Commande #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.dateCommande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${st.color}`}>
                      <st.icon className="w-3 h-3" />
                      {st.label}
                    </span>
                  </div>

                  {/* Order Tracking */}
                  {order.statut !== 'annulee' && (
                    <div className="mb-4 bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        {[
                          { key: 'en_attente', label: 'Reçue', icon: '📋' },
                          { key: 'confirmee', label: 'Confirmée', icon: '✅' },
                          { key: 'en_preparation', label: 'En cuisine', icon: '👨‍🍳' },
                          { key: 'en_livraison', label: 'En route', icon: '🛵' },
                          { key: 'livree', label: 'Livrée', icon: '🎉' },
                        ].map((stepItem, idx) => {
                          const steps = ['en_attente', 'confirmee', 'en_preparation', 'en_livraison', 'livree'];
                          const currentIdx = steps.indexOf(order.statut);
                          const isActive = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          return (
                            <div key={stepItem.key} className="flex flex-col items-center flex-1 relative">
                              {idx > 0 && (
                                <div className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                                  isActive ? 'bg-primary-500' : 'bg-gray-200'
                                }`} />
                              )}
                              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                isCurrent ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/40 ring-4 ring-primary-100' :
                                isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                {isActive ? stepItem.icon : idx + 1}
                              </div>
                              <span className={`text-[10px] mt-1.5 font-medium text-center ${
                                isCurrent ? 'text-primary-600 font-bold' :
                                isActive ? 'text-primary-500' : 'text-gray-400'
                              }`}>
                                {stepItem.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {order.items.map((item, idx) => {
                      const plat = platsList.find(p => p.id === item.platId);
                      return (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          {plat && <img src={plat.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                          <span className="flex-1 text-gray-700">{plat?.nom || 'Plat'} × {item.quantite}</span>
                          <span className="text-gray-500">{formatPrice(item.prixUnitaire * item.quantite)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {order.adresseLivraison}
                    </div>
                    <p className="font-bold text-primary-600">{formatPrice(order.total)}</p>
                  </div>
                  {order.estimationLivraison && order.statut !== 'livree' && order.statut !== 'annulee' && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                      <AlertCircle className="w-3 h-3" /> Temps estimé: {order.estimationLivraison}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Reservations */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            {myReservations.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow">
                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune réservation pour le moment</p>
              </div>
            ) : myReservations.map(res => {
              const st = statusMap[res.statut];
              const table = tablesList.find(t => t.id === res.tableId);
              return (
                <div key={res.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Réservation #{res.id.slice(0, 8).toUpperCase()}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${st.color}`}>
                      <st.icon className="w-3 h-3" />
                      {st.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Date</p>
                      <p className="font-medium">{res.dateReservation}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Heure</p>
                      <p className="font-medium">{res.heure}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Personnes</p>
                      <p className="font-medium">{res.nombrePersonnes}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Table</p>
                      <p className="font-medium">Table {table?.numero} ({table?.emplacement})</p>
                    </div>
                  </div>
                  {res.note && <p className="mt-3 text-sm text-gray-500 italic">Note: {res.note}</p>}
                </div>
              );
            })}
          </div>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Add review form */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" /> Donner un avis
              </h3>
              <form onSubmit={handleReview} className="space-y-4">
                <select value={reviewPlat} onChange={e => setReviewPlat(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Choisir un plat</option>
                  {platsList.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                </select>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Note</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setReviewNote(n)}
                        className={`text-2xl transition-transform ${n <= reviewNote ? 'text-yellow-400 scale-110' : 'text-gray-300'}`}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                  placeholder="Votre commentaire..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-24" />

                <button type="submit" className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                  Publier mon avis
                </button>
              </form>
            </div>

            {/* My reviews */}
            {myReviews.map(review => {
              const plat = platsList.find(p => p.id === review.platId);
              return (
                <div key={review.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    {plat && <img src={plat.image} alt="" className="w-12 h-12 rounded-xl object-cover" />}
                    <div>
                      <h4 className="font-semibold text-gray-900">{plat?.nom}</h4>
                      <div className="flex text-yellow-400 text-sm">
                        {Array.from({ length: review.note }).map((_, i) => <span key={i}>★</span>)}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm flex-1">{review.commentaire}</p>
                    <button onClick={() => deleteAvis(review.id)}
                      className="ml-3 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Supprimer cet avis">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
