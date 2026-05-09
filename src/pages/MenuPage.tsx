import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories, formatPrice } from '../store';
import { Search, Star, Clock, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';

export default function MenuPage() {
  const { platsList, addToCart, currentUser } = useApp();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(3000);

  const filteredPlats = useMemo(() => {
    let result = platsList.filter(p => p.disponible);

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categorieId === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.nom.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    result = result.filter(p => p.prix <= maxPrice);

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.prix - b.prix); break;
      case 'price-desc': result.sort((a, b) => b.prix - a.prix); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    }

    return result;
  }, [platsList, selectedCategory, searchQuery, sortBy, maxPrice]);

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark to-dark-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Notre Menu</h1>
          <p className="text-gray-400">Découvrez notre sélection de plats préparés avec passion</p>

          {/* Search bar */}
          <div className="mt-6 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un plat..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 glass text-white rounded-xl hover:bg-white/20 transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-4 p-4 glass rounded-xl animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Trier par</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none">
                    <option value="default" className="text-gray-900">Par défaut</option>
                    <option value="price-asc" className="text-gray-900">Prix croissant</option>
                    <option value="price-desc" className="text-gray-900">Prix décroissant</option>
                    <option value="rating" className="text-gray-900">Meilleures notes</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Prix max: {formatPrice(maxPrice)}</label>
                  <input type="range" min={200} max={3000} step={100} value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Categories chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
          <button onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
            }`}>
            🍽️ Tous les plats
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
              }`}>
              {cat.icon} {cat.nom}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">{filteredPlats.length} plat{filteredPlats.length > 1 ? 's' : ''} trouvé{filteredPlats.length > 1 ? 's' : ''}</p>

        {/* Grid */}
        {filteredPlats.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🍽️</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun plat trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlats.map((plat, idx) => (
              <div key={plat.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all card-hover border border-gray-100 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={plat.image} alt={plat.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-yellow-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {plat.rating} ({plat.totalRatings})
                  </div>
                  {plat.promotion && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      -{plat.promotion}%
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {plat.tempsPreparation} min
                  </div>
                  {plat.popular && (
                    <div className="absolute bottom-3 right-3 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      ⭐ Populaire
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{plat.nom}</h3>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{plat.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      {plat.promotion ? (
                        <div>
                          <span className="text-primary-600 font-bold">
                            {formatPrice(Math.round(plat.prix * (1 - plat.promotion / 100)))}
                          </span>
                          <span className="text-gray-400 line-through text-xs ml-1">{formatPrice(plat.prix)}</span>
                        </div>
                      ) : (
                        <span className="text-primary-600 font-bold">{formatPrice(plat.prix)}</span>
                      )}
                    </div>
                    {currentUser ? (
                      <button onClick={() => addToCart(plat)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-xl text-xs font-medium hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/20">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Ajouter
                      </button>
                    ) : (
                      <Link to="/login" className="text-primary-500 text-xs font-medium hover:underline">
                        Connectez-vous
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
