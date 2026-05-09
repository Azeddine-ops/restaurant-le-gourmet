import { useApp } from '../context/AppContext';
import { formatPrice } from '../store';
import {
  Truck, Package, CheckCircle, MapPin, Phone, Clock,
  User
} from 'lucide-react';

export default function LivreurPage() {
  const { currentUser, commandes, updateOrderStatus, users, platsList } = useApp();

  if (!currentUser || currentUser.role !== 'livreur') return null;

  const myOrders = commandes.filter(c => c.livreurId === currentUser.id);
  const activeOrders = myOrders.filter(c => c.statut === 'en_livraison');
  const completedOrders = myOrders.filter(c => c.statut === 'livree');

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bonjour {currentUser.prenom}!</h1>
              <p className="text-blue-200">Espace Livreur</p>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{activeOrders.length}</p>
              <p className="text-xs text-blue-200">En cours</p>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{completedOrders.length}</p>
              <p className="text-xs text-blue-200">Livrées</p>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{myOrders.length}</p>
              <p className="text-xs text-blue-200">Total</p>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-500" /> Livraisons en cours
            </h2>
            <div className="space-y-4">
              {activeOrders.map(order => {
                const client = users.find(u => u.id === order.clientId);
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 animate-pulse-glow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.dateCommande).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        🚚 En livraison
                      </span>
                    </div>

                    {/* Client Info */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{client?.prenom} {client?.nom}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{order.telephone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                        <span className="text-sm font-medium text-gray-800">{order.adresseLivraison}</span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => {
                        const plat = platsList.find(p => p.id === item.platId);
                        return (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {plat && <img src={plat.image} alt="" className="w-8 h-8 rounded object-cover" />}
                            <span className="flex-1">{plat?.nom} × {item.quantite}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">{order.modePaiement === 'cash' ? '💵 Cash à récupérer' : '💳 Déjà payé'}</span>
                      <span className="font-bold text-lg text-primary-600">{formatPrice(order.total)}</span>
                    </div>

                    {order.note && <p className="text-sm text-gray-500 italic mb-4">📝 {order.note}</p>}

                    <button onClick={() => updateOrderStatus(order.id, 'livree')}
                      className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/30">
                      <CheckCircle className="w-5 h-5" />
                      Confirmer la livraison
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Orders */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" /> Livraisons terminées
          </h2>
          {completedOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune livraison terminée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedOrders.map(order => {
                const client = users.find(u => u.id === order.clientId);
                return (
                  <div key={order.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{client?.prenom} {client?.nom} • {order.adresseLivraison}</p>
                    </div>
                    <span className="font-bold text-sm text-gray-900">{formatPrice(order.total)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
