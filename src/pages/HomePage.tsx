import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories } from '../store';
import { formatPrice } from '../store';
import {
  Truck, CalendarDays, Star, Clock, ArrowRight, ShoppingCart,
  ChefHat, Users, Award, Flame
} from 'lucide-react';

export default function HomePage() {
  const { platsList, addToCart, currentUser } = useApp();
  const popularPlats = platsList.filter(p => p.popular).slice(0, 6);
  const promoPlats = platsList.filter(p => p.promotion);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.pexels.com/videos/3209765/free-video-3209765.jpg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
            className="w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/3209765/3209765-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
          <div className="hero-gradient absolute inset-0" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary-300 text-sm mb-6 animate-fade-in-up">
              <Award className="w-4 h-4" />
              <span>Meilleur Restaurant 2025 - Guide Culinaire</span>
            </div>

            <h1 className="font-display text-5xl sm:text-7xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Savourez<br />
              <span className="text-gradient">l'Excellence</span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Découvrez une cuisine raffinée préparée avec des ingrédients frais et de qualité.
              Commandez en livraison ou réservez votre table pour une soirée inoubliable.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/menu"
                className="flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-1">
                <Truck className="w-5 h-5" />
                Commander en ligne
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/reservation"
                className="flex items-center gap-2 px-8 py-4 glass text-white rounded-2xl font-semibold hover:bg-white/20 transition-all">
                <CalendarDays className="w-5 h-5" />
                Réserver une table
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">4.8</p>
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                <p className="text-xs text-gray-400 mt-1">2,450+ avis</p>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">30</p>
                <p className="text-xs text-gray-400 mt-1">min livraison</p>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">18</p>
                <p className="text-xs text-gray-400 mt-1">plats signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating card */}
        <div className="hidden lg:block absolute right-12 bottom-20 z-10 animate-float">
          <div className="glass rounded-3xl p-6 w-72 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Plat du jour</p>
                <p className="text-primary-300 text-sm">Tajine d'Agneau</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">Tajine traditionnel aux pruneaux et amandes</p>
            <div className="flex items-center justify-between">
              <span className="text-primary-400 font-bold text-lg">{formatPrice(2500)}</span>
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">-15%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Livraison Rapide', desc: 'Livraison en 30-45 min dans tout Alger. Frais de livraison à partir de 200 DA.', color: 'from-primary-500 to-orange-600' },
              { icon: CalendarDays, title: 'Réservation Facile', desc: 'Réservez votre table en quelques clics. Confirmation instantanée garantie.', color: 'from-blue-500 to-indigo-600' },
              { icon: ChefHat, title: 'Cuisine d\'Exception', desc: 'Des chefs passionnés qui préparent chaque plat avec amour et créativité.', color: 'from-accent-500 to-emerald-600' },
            ].map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all card-hover border border-gray-100">
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explorez nos <span className="text-primary-500">Catégories</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Des entrées aux desserts, trouvez votre bonheur parmi notre large sélection</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <Link to={`/menu?category=${cat.id}`} key={cat.id}
                className="group bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all card-hover border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">{cat.icon}</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">{cat.nom}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {platsList.filter(p => p.categorieId === cat.id).length} plats
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      {promoPlats.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-primary-950 via-dark to-dark-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">
                  🔥 Offres Spéciales
                </h2>
                <p className="text-gray-400">Profitez de nos réductions exclusives</p>
              </div>
              <Link to="/menu" className="text-primary-400 hover:text-primary-300 flex items-center gap-1 text-sm font-medium">
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoPlats.map(plat => (
                <div key={plat.id} className="glass rounded-2xl overflow-hidden group card-hover">
                  <div className="relative h-48 overflow-hidden">
                    <img src={plat.image} alt={plat.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{plat.promotion}%
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-1">{plat.nom}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{plat.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-primary-400 font-bold text-lg">
                          {formatPrice(Math.round(plat.prix * (1 - (plat.promotion || 0) / 100)))}
                        </span>
                        <span className="text-gray-500 line-through text-sm ml-2">{formatPrice(plat.prix)}</span>
                      </div>
                      {currentUser && (
                        <button onClick={() => addToCart(plat)}
                          className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Dishes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Les Plus <span className="text-primary-500">Populaires</span>
              </h2>
              <p className="text-gray-500">Les plats préférés de nos clients</p>
            </div>
            <Link to="/menu" className="text-primary-500 hover:text-primary-600 flex items-center gap-1 font-medium">
              Voir le menu <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPlats.map((plat, idx) => (
              <div key={plat.id} className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover border border-gray-100 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative h-52 overflow-hidden">
                  <img src={plat.image} alt={plat.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-yellow-600 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {plat.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {plat.tempsPreparation} min
                  </div>
                  {plat.promotion && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{plat.promotion}%
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{plat.nom}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{plat.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      {plat.promotion ? (
                        <>
                          <span className="text-primary-600 font-bold text-lg">
                            {formatPrice(Math.round(plat.prix * (1 - plat.promotion / 100)))}
                          </span>
                          <span className="text-gray-400 line-through text-sm ml-2">{formatPrice(plat.prix)}</span>
                        </>
                      ) : (
                        <span className="text-primary-600 font-bold text-lg">{formatPrice(plat.prix)}</span>
                      )}
                    </div>
                    {currentUser ? (
                      <button onClick={() => addToCart(plat)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/30">
                        <ShoppingCart className="w-4 h-4" />
                        Ajouter
                      </button>
                    ) : (
                      <Link to="/login" className="text-primary-500 text-sm font-medium hover:text-primary-600">
                        Connectez-vous
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos <span className="text-primary-500">Clients</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', text: 'Le tajine d\'agneau est absolument divin! La livraison était rapide et le plat encore chaud. Je recommande vivement!', rating: 5 },
              { name: 'Karim B.', text: 'Excellente expérience de réservation en ligne. Le restaurant est magnifique et la nourriture exceptionnelle.', rating: 5 },
              { name: 'Amira L.', text: 'Mes pizzas préférées à Alger! La pâte est parfaite et les ingrédients sont toujours frais. Service impeccable.', rating: 4 },
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover">
                <div className="flex text-yellow-400 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                    <p className="text-xs text-gray-400">Client fidèle</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à commander?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Inscrivez-vous et profitez de <strong>20% de réduction</strong> sur votre première commande avec le code <strong>BIENVENUE</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/menu" className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-bold hover:bg-primary-50 transition-colors shadow-xl flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5" />
              Voir le Menu
            </Link>
            <Link to={currentUser ? '/reservation' : '/register'} className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
              <Users className="w-5 h-5" />
              {currentUser ? 'Réserver' : 'Créer un Compte'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function UtensilsCrossed(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c1.7 1.7 4.3 1.7 6 0"/><path d="m2 22 5.5-1.5L21.17 6.83a2.82 2.82 0 0 0-4-4L3.5 16.5Z"/><path d="m18 16 4 4"/><path d="m17 21 2-2"/>
    </svg>
  );
}
