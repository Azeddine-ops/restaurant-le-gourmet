import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChefHat, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface FormErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  telephone?: string;
  adresse?: string;
}

export default function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', telephone: '', adresse: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = (field: string, value: string) => {
    // Pour le téléphone, n'accepter que les chiffres et les espaces
    if (field === 'telephone') {
      value = value.replace(/[^0-9\s]/g, '').slice(0, 14);
    }
    // Pour le nom et prénom, n'accepter que les lettres, espaces et tirets
    if (field === 'nom' || field === 'prenom') {
      value = value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
    }
    setForm(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    // Valider en temps réel
    validateField(field, value);
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'nom':
        if (!value.trim()) newErrors.nom = 'Le nom est obligatoire';
        else if (value.trim().length < 2) newErrors.nom = 'Le nom doit avoir au moins 2 caractères';
        else delete newErrors.nom;
        break;
      case 'prenom':
        if (!value.trim()) newErrors.prenom = 'Le prénom est obligatoire';
        else if (value.trim().length < 2) newErrors.prenom = 'Le prénom doit avoir au moins 2 caractères';
        else delete newErrors.prenom;
        break;
      case 'email':
        if (!value.trim()) newErrors.email = 'L\'email est obligatoire';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = 'Format email invalide (ex: nom@email.com)';
        else delete newErrors.email;
        break;
      case 'password':
        if (!value) newErrors.password = 'Le mot de passe est obligatoire';
        else if (value.length < 6) newErrors.password = 'Le mot de passe doit avoir au moins 6 caractères';
        else if (!/[0-9]/.test(value)) newErrors.password = 'Le mot de passe doit contenir au moins 1 chiffre';
        else if (!/[a-zA-Z]/.test(value)) newErrors.password = 'Le mot de passe doit contenir au moins 1 lettre';
        else delete newErrors.password;
        break;
      case 'telephone':
        const digits = value.replace(/\s/g, '');
        if (!digits) newErrors.telephone = 'Le téléphone est obligatoire';
        else if (digits.length < 10) newErrors.telephone = 'Le numéro doit avoir au moins 10 chiffres';
        else if (!/^0[5-7]/.test(digits)) newErrors.telephone = 'Le numéro doit commencer par 05, 06 ou 07';
        else delete newErrors.telephone;
        break;
      case 'adresse':
        if (!value.trim()) newErrors.adresse = 'L\'adresse est obligatoire';
        else if (value.trim().length < 10) newErrors.adresse = 'L\'adresse doit avoir au moins 10 caractères';
        else delete newErrors.adresse;
        break;
    }

    setErrors(newErrors);
  };

  const validateAll = (): boolean => {
    const allFields = ['nom', 'prenom', 'email', 'password', 'telephone', 'adresse'];
    allFields.forEach(field => {
      validateField(field, form[field as keyof typeof form]);
    });
    setTouched(Object.fromEntries(allFields.map(f => [f, true])));

    // Re-check errors
    const hasErrors = Object.keys(errors).length > 0 ||
      !form.nom.trim() || !form.prenom.trim() || !form.email.trim() ||
      form.password.length < 6 || form.telephone.replace(/\s/g, '').length < 10 ||
      form.adresse.trim().length < 10;
    return !hasErrors;
  };

  const getPasswordStrength = () => {
    const pw = form.password;
    if (!pw) return { level: 0, label: '', color: '' };

    // Calcul sur 5 critères
    const hasMinLength = pw.length >= 6;           // critère 1
    const hasGoodLength = pw.length >= 10;          // critère 2
    const hasLetters = /[a-zA-Z]/.test(pw);        // critère 3
    const hasNumbers = /[0-9]/.test(pw);            // critère 4
    const hasSpecial = /[^a-zA-Z0-9]/.test(pw);    // critère 5

    let score = 0;
    if (hasMinLength) score++;
    if (hasGoodLength) score++;
    if (hasLetters) score++;
    if (hasNumbers) score++;
    if (hasSpecial) score++;

    // Si pas encore 6 caractères → très faible
    if (!hasMinLength) return { level: 1, label: 'Très faible', color: 'bg-red-500' };
    // Seulement lettres OU seulement chiffres → faible
    if (!hasNumbers && !hasSpecial) return { level: 2, label: 'Faible - ajoutez des chiffres', color: 'bg-red-500' };
    if (!hasLetters && !hasSpecial) return { level: 2, label: 'Faible - ajoutez des lettres', color: 'bg-red-500' };
    // Lettres + chiffres mais court → moyen
    if (score <= 3) return { level: 3, label: 'Moyen', color: 'bg-yellow-500' };
    // Lettres + chiffres + long → bien
    if (score === 4) return { level: 4, label: 'Bien', color: 'bg-green-500' };
    // Tout → fort
    return { level: 5, label: 'Très fort 💪', color: 'bg-green-500' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    if (register(form)) {
      navigate('/');
    }
  };

  const pwStrength = getPasswordStrength();
  const isFieldValid = (field: string) => touched[field] && !errors[field as keyof FormErrors] && form[field as keyof typeof form].trim();
  const isFieldError = (field: string) => touched[field] && errors[field as keyof FormErrors];

  const fieldBorder = (field: string) => {
    if (isFieldError(field)) return 'border-red-400 focus:ring-red-400';
    if (isFieldValid(field)) return 'border-green-400 focus:ring-green-400';
    return 'border-gray-200 focus:ring-primary-500';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-dark-light to-primary-950 px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <ChefHat className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Créer un Compte</h1>
          <p className="text-gray-400">Rejoignez la famille Le Gourmet</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom + Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.nom} onChange={e => updateField('nom', e.target.value)}
                    onBlur={() => { setTouched(p => ({...p, nom: true})); validateField('nom', form.nom); }}
                    placeholder="Nom"
                    className={`w-full pl-10 pr-8 py-2.5 border rounded-xl focus:outline-none focus:ring-2 text-sm ${fieldBorder('nom')}`} />
                  {isFieldValid('nom') && <CheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                  {isFieldError('nom') && <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
                </div>
                {isFieldError('nom') && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <div className="relative">
                  <input type="text" value={form.prenom} onChange={e => updateField('prenom', e.target.value)}
                    onBlur={() => { setTouched(p => ({...p, prenom: true})); validateField('prenom', form.prenom); }}
                    placeholder="Prénom"
                    className={`w-full px-3 pr-8 py-2.5 border rounded-xl focus:outline-none focus:ring-2 text-sm ${fieldBorder('prenom')}`} />
                  {isFieldValid('prenom') && <CheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                  {isFieldError('prenom') && <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
                </div>
                {isFieldError('prenom') && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)}
                  onBlur={() => { setTouched(p => ({...p, email: true})); validateField('email', form.email); }}
                  placeholder="votre@email.com"
                  className={`w-full pl-10 pr-8 py-2.5 border rounded-xl focus:outline-none focus:ring-2 text-sm ${fieldBorder('email')}`} />
                {isFieldValid('email') && <CheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                {isFieldError('email') && <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
              </div>
              {isFieldError('email') && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => updateField('password', e.target.value)}
                  onBlur={() => { setTouched(p => ({...p, password: true})); validateField('password', form.password); }}
                  placeholder="Min 6 caractères (lettres + chiffres)"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl focus:outline-none focus:ring-2 text-sm ${fieldBorder('password')}`} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isFieldError('password') && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              {/* Password strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= pwStrength.level ? pwStrength.color : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${pwStrength.color === 'bg-red-500' ? 'text-red-500' : pwStrength.color === 'bg-yellow-500' ? 'text-yellow-600' : 'text-green-600'}`}>
                    Force : {pwStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={form.telephone} onChange={e => updateField('telephone', e.target.value)}
                  onBlur={() => { setTouched(p => ({...p, telephone: true})); validateField('telephone', form.telephone); }}
                  placeholder="0555 000 000"
                  className={`w-full pl-10 pr-8 py-2.5 border rounded-xl focus:outline-none focus:ring-2 text-sm ${fieldBorder('telephone')}`} />
                {isFieldValid('telephone') && <CheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                {isFieldError('telephone') && <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
              </div>
              {isFieldError('telephone') && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
              {!isFieldError('telephone') && touched.telephone && <p className="text-gray-400 text-xs mt-1">Format : 05XX XXX XXX</p>}
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea value={form.adresse} onChange={e => updateField('adresse', e.target.value)}
                  onBlur={() => { setTouched(p => ({...p, adresse: true})); validateField('adresse', form.adresse); }}
                  placeholder="Votre adresse complète (rue, ville...)"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 text-sm resize-none h-20 ${fieldBorder('adresse')}`} />
              </div>
              {isFieldError('adresse') && <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>}
            </div>

            <button type="submit"
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30 mt-2">
              Créer mon compte
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Déjà un compte? {' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
