import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Home, UtensilsCrossed, ShoppingCart, CalendarDays, User, LogOut,
  Menu as MenuIcon, X, ChefHat, Truck, LayoutDashboard, Star,
  Bell, Clock, MapPin, AlertTriangle
} from 'lucide-react';

export function Navbar() {
  const { currentUser, logout, getCartCount, notification, commandes } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const pendingOrders = commandes.filter(c =>
    currentUser?.role === 'livreur' ? c.livreurId === currentUser.id && c.statut === 'en_livraison' :
    currentUser?.role === 'admin' ? c.statut === 'en_attente' : false
  ).length;

  const navLinks = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
    { to: '/reservation', label: 'Réservation', icon: CalendarDays },
    ...(currentUser?.role === 'client' ? [{ to: '/rapport', label: 'Rapport', icon: AlertTriangle }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-2xl animate-slide-in-right flex items-center gap-2 text-white font-medium ${
          notification.type === 'success' ? 'bg-accent-600' :
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
          {notification.message}
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 glass-light shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-dark hidden sm:block">Le Gourmet</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}>
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentUser && (
                <Link to="/cart" className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {currentUser && pendingOrders > 0 && (
                <div className="relative p-2">
                  <Bell className="w-5 h-5 text-primary-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {pendingOrders}
                  </span>
                </div>
              )}

              {currentUser ? (
                <div className="hidden md:flex items-center gap-2">
                  {(currentUser.role === 'admin' || currentUser.role === 'livreur') && (
                    <Link
                      to={currentUser.role === 'admin' ? '/admin' : '/livreur'}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary-50 transition-colors text-sm text-gray-700"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{currentUser.role === 'admin' ? 'Administration' : 'Mes livraisons'}</span>
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary-50 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {currentUser.prenom[0]}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">{currentUser.prenom}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                    </div>
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30">
                  <User className="w-4 h-4" />
                  Connexion
                </Link>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100">
                {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive(link.to) ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-primary-50'
                  }`}>
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {currentUser ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-primary-50">
                    <User className="w-5 h-5" />
                    Mon Profil
                  </Link>
                  {(currentUser.role === 'admin' || currentUser.role === 'livreur') && (
                    <Link
                      to={currentUser.role === 'admin' ? '/admin' : '/livreur'}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-primary-50"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      {currentUser.role === 'admin' ? 'Administration' : 'Mes Livraisons'}
                    </Link>
                  )}
                  <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full">
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-primary-500 text-white">
                  <User className="w-5 h-5" />
                  Connexion
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold">Le Gourmet</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Une expérience culinaire exceptionnelle avec des plats préparés avec passion et des ingrédients frais de qualité.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary-400">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Accueil</Link></li>
              <li><Link to="/menu" className="hover:text-primary-400 transition-colors">Menu</Link></li>
              <li><Link to="/reservation" className="hover:text-primary-400 transition-colors">Réservation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary-400">Horaires</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> Lun-Ven: 11h - 23h</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> Sam-Dim: 10h - 00h</li>
              <li className="flex items-center gap-2"><Truck className="w-4 h-4" /> Livraison: 11h - 22h30</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary-400">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 15 Rue Didouche Mourad, Alger</li>
              <li>📞 +213 555 000 001</li>
              <li>✉️ contact@legourmet.dz</li>
              <li className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> 4.8/5 (2,450 avis)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2026 Le Gourmet. Tous droits réservés. Fait avec ❤️ en Algérie</p>
        </div>
      </div>
    </footer>
  );
}
