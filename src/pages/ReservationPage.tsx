import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CalendarDays, Clock, Users, MessageSquare, CheckCircle, MapPin } from 'lucide-react';

export default function ReservationPage() {
  const { currentUser, tablesList, reservations, makeReservation } = useApp();
  const [form, setForm] = useState({
    dateReservation: '',
    heure: '',
    nombrePersonnes: 2,
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const reservedTableIdsForSlot = reservations
    .filter(r =>
      r.dateReservation === form.dateReservation &&
      r.heure === form.heure &&
      ['en_attente', 'confirmee'].includes(r.statut)
    )
    .map(r => r.tableId);

  const availableTables = tablesList.filter(t =>
    t.statut === 'disponible' &&
    t.capacite >= form.nombrePersonnes &&
    (!form.dateReservation || !form.heure || !reservedTableIdsForSlot.includes(t.id))
  );

  const [selectedTable, setSelectedTable] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedTable) return;
    const success = makeReservation({
      clientId: currentUser.id,
      tableId: selectedTable,
      dateReservation: form.dateReservation,
      heure: form.heure,
      nombrePersonnes: form.nombrePersonnes,
      statut: 'en_attente',
      note: form.note,
    });
    if (success) {
      setSubmitted(true);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connectez-vous pour réserver</h2>
          <p className="text-gray-500 mb-6">Créez un compte ou connectez-vous pour réserver une table</p>
          <Link to="/login" className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Réservation envoyée!</h2>
          <p className="text-gray-500 mb-6">
            Votre demande de réservation a été envoyée avec succès. Vous recevrez une confirmation sous peu.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-medium">{form.dateReservation}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Heure:</span><span className="font-medium">{form.heure}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Personnes:</span><span className="font-medium">{form.nombrePersonnes}</span></div>
          </div>
          <div className="flex gap-3">
            <Link to="/profile" className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
              Mes réservations
            </Link>
            <Link to="/menu" className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Voir le menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <div className="relative bg-dark py-24 overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.pexels.com/videos/31631562/pexels-photo-31631562.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=1200"
            className="w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/31631562/13476222_3840_2160_25fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Réserver une Table</h1>
          <p className="text-gray-300 text-lg">Une soirée inoubliable vous attend</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary-500" /> Date
                </label>
                <input type="date" value={form.dateReservation}
                  onChange={e => { setForm(prev => ({ ...prev, dateReservation: e.target.value })); setSelectedTable(''); }}
                  min={new Date().toISOString().split('T')[0]} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-500" /> Heure
                </label>
                <select value={form.heure} onChange={e => { setForm(prev => ({ ...prev, heure: e.target.value })); setSelectedTable(''); }} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Choisir l'heure</option>
                  {['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" /> Nombre de personnes
              </label>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <button key={n} type="button"
                    onClick={() => { setForm(prev => ({ ...prev, nombrePersonnes: n })); setSelectedTable(''); }}
                    className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                      form.nombrePersonnes === n
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Tables */}
            {form.nombrePersonnes > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" /> Choisir votre table
                </label>
                {availableTables.length === 0 ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                    {form.dateReservation && form.heure
                      ? `Aucune table disponible pour ${form.nombrePersonnes} personne(s) à ce créneau. Essayez une autre heure ou une autre table.`
                      : `Aucune table disponible pour ${form.nombrePersonnes} personne(s). Sélectionnez une date et une heure pour voir les tables libres.`}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableTables.map(table => (
                      <button key={table.id} type="button" onClick={() => setSelectedTable(table.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedTable === table.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <p className="font-bold text-gray-900">Table {table.numero}</p>
                        <p className="text-xs text-gray-500">{table.capacite} places • {table.emplacement}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-500" /> Note (optionnel)
              </label>
              <textarea value={form.note} onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Occasion spéciale, allergies, préférences..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-24" />
            </div>

            <button type="submit" disabled={!selectedTable || !form.dateReservation || !form.heure}
              className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors shadow-xl shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Confirmer la réservation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
