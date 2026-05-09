import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Send, CheckCircle, Clock, MessageSquare, ArrowLeft } from 'lucide-react';

const sujets = [
  { value: 'commande' as const, label: '📦 Problème de commande', desc: 'Commande incorrecte, manquante ou en retard' },
  { value: 'livraison' as const, label: '🛵 Problème de livraison', desc: 'Livreur, adresse, état du colis' },
  { value: 'qualite' as const, label: '🍽️ Qualité du plat', desc: 'Goût, fraîcheur, présentation' },
  { value: 'service' as const, label: '👤 Service client', desc: 'Accueil, comportement, réservation' },
  { value: 'autre' as const, label: '💬 Autre', desc: 'Suggestion, question, autre problème' },
];

const statusMap: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  nouveau: { label: 'Nouveau', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  en_cours: { label: 'En cours', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  resolu: { label: 'Résolu', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

export default function RapportPage() {
  const { currentUser, rapports, addRapport } = useApp();
  const [sujet, setSujet] = useState<'commande' | 'livraison' | 'qualite' | 'service' | 'autre'>('commande');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [messageError, setMessageError] = useState('');
  const messageCount = message.length;

  const handleMessageChange = (value: string) => {
    setMessage(value.slice(0, 500));
    setMessageError('');
  };

  if (!currentUser || currentUser.role !== 'client') {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès réservé aux clients</h2>
          <p className="text-gray-500 mb-6">Connectez-vous avec un compte client pour envoyer un rapport</p>
          <Link to="/login" className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const myRapports = rapports.filter(r => r.clientId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setMessageError('Le message doit avoir au moins 10 caractères');
      return;
    }
    setMessageError('');
    addRapport({ clientId: currentUser.id, sujet, message: message.trim() });
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour au profil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            Envoyer un Rapport
          </h1>
          <p className="text-gray-500 mt-2">Signalez un problème ou partagez vos remarques avec l'administration</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          {submitted && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Rapport envoyé avec succès!</p>
                <p className="text-sm text-green-600">L'administration va traiter votre rapport sous peu.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Sujet du rapport *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sujets.map(s => (
                  <button key={s.value} type="button" onClick={() => setSujet(s.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      sujet === s.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <p className="font-semibold text-sm">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-500" />
                Votre message *
              </label>
              <textarea
                value={message}
                onChange={e => handleMessageChange(e.target.value)}
                onInput={e => handleMessageChange((e.target as HTMLTextAreaElement).value)}
                maxLength={500}
                placeholder="Décrivez votre problème ou remarque en détail..."
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-36 ${
                  messageError ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {messageError && <p className="text-red-500 text-xs mt-1">{messageError}</p>}
              <div className="mt-2 flex items-center justify-between text-xs">
                <p className="text-gray-400">Minimum 10 caractères</p>
                <p className={`${messageCount >= 500 ? 'text-red-500 font-medium' : messageCount >= 450 ? 'text-yellow-600 font-medium' : 'text-gray-400'}`}>
                  {messageCount}/500 caractères
                </p>
              </div>
            </div>

            <button type="submit"
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Envoyer le rapport
            </button>
          </form>
        </div>

        {/* Mes rapports */}
        {myRapports.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mes Rapports ({myRapports.length})</h2>
            <div className="space-y-4">
              {myRapports.map(rapport => {
                const st = statusMap[rapport.statut];
                const sujetInfo = sujets.find(s => s.value === rapport.sujet);
                return (
                  <div key={rapport.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{sujetInfo?.label.split(' ')[0]}</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{sujetInfo?.label.split(' ').slice(1).join(' ')}</p>
                          <p className="text-xs text-gray-400">{rapport.date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${st.color}`}>
                        <st.icon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl">{rapport.message}</p>
                    {rapport.reponseAdmin && (
                      <div className="mt-3 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                        <p className="text-xs text-blue-500 font-medium mb-1">👨‍💼 Réponse de l'administration :</p>
                        <p className="text-sm text-blue-800">{rapport.reponseAdmin}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
