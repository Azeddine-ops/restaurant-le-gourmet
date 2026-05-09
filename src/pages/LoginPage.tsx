import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChefHat, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showLivreurHint, setShowLivreurHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-dark-light to-primary-950 px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <ChefHat className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-gray-400">Accédez à votre espace personnel</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit"
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30">
              Se connecter
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte? {' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600">
              Créer un compte
            </Link>
          </p>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <button onClick={() => setShowLivreurHint(!showLivreurHint)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              🛵 Vous êtes livreur ?
            </button>
            {showLivreurHint && (
              <div className="mt-3 bg-blue-50 rounded-xl p-4 text-left animate-fade-in">
                <p className="text-sm text-blue-800 font-medium mb-1">📧 Format de votre email :</p>
                <p className="text-sm text-blue-600 font-mono">votre-prenom@livreur.com</p>
                <p className="text-xs text-blue-500 mt-2">Contactez l'admin si vous avez oublié vos identifiants.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
