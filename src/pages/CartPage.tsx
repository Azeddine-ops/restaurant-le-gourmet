import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, promoCodes } from '../store';
import { Minus, Plus, Trash2, ShoppingCart, Truck, MapPin, CreditCard, Banknote, ArrowLeft, Tag, Clock } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, placeOrder, currentUser } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [adresse, setAdresse] = useState(currentUser?.adresse || '');
  const [telephone, setTelephone] = useState(currentUser?.telephone || '');
  const [modePaiement, setModePaiement] = useState<'cash' | 'carte'>('cash');
  const [note, setNote] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof promoCodes[0] | null>(null);
  const [promoError, setPromoError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const subtotal = getCartTotal();
  const fraisLivraison = 300;

  const getDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'pourcentage') return Math.round(subtotal * appliedPromo.reduction / 100);
    return appliedPromo.reduction;
  };

  const discount = getDiscount();
  const total = subtotal + fraisLivraison - discount;

  const applyPromo = () => {
    const code = promoCodes.find(c => c.code.toLowerCase() === promoCode.toLowerCase() && c.actif);
    if (code) {
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError('Code promo invalide');
      setAppliedPromo(null);
    }
  };

  const isCheckoutValid = () => {
    const phoneDigits = telephone.replace(/\s/g, '');
    if (!adresse || adresse.length < 10) return false;
    if (!phoneDigits || phoneDigits.length < 10 || !/^0[5-7]/.test(phoneDigits)) return false;
    if (modePaiement === 'carte' && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) return false;
    return true;
  };

  const handleOrder = () => {
    if (!isCheckoutValid()) return;
    placeOrder({
      clientId: currentUser!.id,
      adresseLivraison: adresse,
      telephone,
      total,
      statut: 'en_attente',
      modePaiement,
      note,
      items: cart.map(item => ({
        platId: item.plat.id,
        quantite: item.quantite,
        prixUnitaire: item.plat.promotion
          ? Math.round(item.plat.prix * (1 - item.plat.promotion / 100))
          : item.plat.prix
      })),
      fraisLivraison,
      estimationLivraison: '35-45 min'
    });
    navigate('/profile');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
          <p className="text-gray-500 mb-6">Ajoutez des plats délicieux depuis notre menu</p>
          <Link to="/menu" className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors inline-flex items-center gap-2">
            Voir le menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === 'cart' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            <ShoppingCart className="w-4 h-4" /> Panier
          </div>
          <div className="w-8 h-0.5 bg-gray-300" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === 'checkout' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            <Truck className="w-4 h-4" /> Livraison
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items / Checkout */}
          <div className="lg:col-span-2">
            {step === 'cart' ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Votre Panier ({cart.length})</h2>
                  <button onClick={clearCart} className="text-red-500 text-sm hover:text-red-600 flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Vider
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.map(item => {
                    const effectivePrice = item.plat.promotion
                      ? Math.round(item.plat.prix * (1 - item.plat.promotion / 100))
                      : item.plat.prix;
                    return (
                      <div key={item.plat.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <img src={item.plat.image} alt={item.plat.nom} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.plat.nom}</h3>
                          <p className="text-primary-600 font-bold text-sm">{formatPrice(effectivePrice)}</p>
                          {item.plat.promotion && (
                            <span className="text-xs text-red-500 font-medium">-{item.plat.promotion}%</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCartQuantity(item.plat.id, item.quantite - 1)}
                            className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantite}</span>
                          <button onClick={() => updateCartQuantity(item.plat.id, item.quantite + 1)}
                            className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="font-bold text-gray-900">{formatPrice(effectivePrice * item.quantite)}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.plat.id)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code */}
                <div className="mt-6 flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Code promo" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <button onClick={applyPromo} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">
                    Appliquer
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
                {appliedPromo && <p className="text-accent-600 text-sm mt-2 font-medium">✅ Code "{appliedPromo.code}" appliqué: -{appliedPromo.reduction}{appliedPromo.type === 'pourcentage' ? '%' : ' DA'}</p>}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
                  <ArrowLeft className="w-4 h-4" /> Retour au panier
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de Livraison</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={adresse} onChange={e => setAdresse(e.target.value)}
                        placeholder="Entrez votre adresse complète"
                        minLength={10}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    {adresse && adresse.length < 10 && (
                      <p className="text-red-500 text-xs mt-1">L'adresse doit avoir au moins 10 caractères</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input type="tel" value={telephone}
                      onChange={e => setTelephone(e.target.value.replace(/[^0-9\s]/g, '').slice(0, 14))}
                      placeholder="0555 000 000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    {telephone && telephone.replace(/\s/g, '').length < 10 && (
                      <p className="text-red-500 text-xs mt-1">Le numéro doit avoir au moins 10 chiffres</p>
                    )}
                    {telephone && telephone.replace(/\s/g, '').length >= 10 && !/^0[5-7]/.test(telephone.replace(/\s/g, '')) && (
                      <p className="text-red-500 text-xs mt-1">Le numéro doit commencer par 05, 06 ou 07</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note (optionnel)</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)}
                      placeholder="Instructions spéciales, allergies..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-24" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Mode de paiement</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setModePaiement('cash')}
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                          modePaiement === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <Banknote className="w-6 h-6 text-accent-600" />
                        <div className="text-left">
                          <p className="font-semibold text-sm">Cash</p>
                          <p className="text-xs text-gray-500">Paiement à la livraison</p>
                        </div>
                      </button>
                      <button onClick={() => setModePaiement('carte')}
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                          modePaiement === 'carte' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <CreditCard className="w-6 h-6 text-blue-500" />
                        <div className="text-left">
                          <p className="font-semibold text-sm">Carte</p>
                          <p className="text-xs text-gray-500">Paiement en ligne</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Formulaire carte bancaire */}
                  {modePaiement === 'carte' && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 animate-fade-in">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                        Informations de la carte
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte *</label>
                          <input type="text" value={cardNumber}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                              const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                              setCardNumber(formatted);
                            }}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wider" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte *</label>
                          <input type="text" value={cardName} onChange={e => setCardName(e.target.value)}
                            placeholder="AZEDDINE BENALI"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration *</label>
                            <input type="text" value={cardExpiry}
                              onChange={e => {
                                let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
                                setCardExpiry(val);
                              }}
                              placeholder="MM/AA"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                            <input type="password" value={cardCvv}
                              onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              placeholder="•••"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Paiement 100% sécurisé — Vos données sont cryptées
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Temps de livraison estimé</p>
                      <p className="text-sm text-blue-600">35-45 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Résumé</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total ({cart.reduce((s, i) => s + i.quantite, 0)} articles)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> Livraison</span>
                  <span>{formatPrice(fraisLivraison)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent-600 font-medium">
                    <span>Réduction</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button onClick={() => setStep('checkout')}
                  className="w-full mt-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2">
                  <Truck className="w-5 h-5" />
                  Passer la commande
                </button>
              ) : (
                <button onClick={handleOrder} disabled={!isCheckoutValid()}
                  className="w-full mt-6 py-3 bg-accent-600 text-white rounded-xl font-semibold hover:bg-accent-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {modePaiement === 'carte' ? '💳' : '✅'} Confirmer la commande
                </button>
              )}

              <Link to="/menu" className="block text-center mt-3 text-sm text-primary-500 hover:text-primary-600">
                ← Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
