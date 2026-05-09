import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { User, CartItem, CommandeLivraison, Reservation, Avis, Plat, Rapport } from '../types';
import { initialCommandes, initialReservations, initialAvis, users as initialUsers, plats as initialPlats, tables as initialTables, generateId } from '../store';
import type { TableRestaurant } from '../types';
import { supabase, testSupabaseConnection } from '../lib/supabase';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

const forcedPlatImageFixes: Record<string, string> = {
  p3: 'https://images.pexels.com/photos/7432991/pexels-photo-7432991.jpeg?auto=compress&cs=tinysrgb&w=600',
};

function applyPlatImageFixes(plats: Plat[]): Plat[] {
  return plats.map((plat) =>
    forcedPlatImageFixes[plat.id]
      ? { ...plat, image: forcedPlatImageFixes[plat.id] }
      : plat,
  );
}

interface AppState {
  currentUser: User | null;
  cart: CartItem[];
  commandes: CommandeLivraison[];
  reservations: Reservation[];
  avis: Avis[];
  rapports: Rapport[];
  users: User[];
  platsList: Plat[];
  tablesList: TableRestaurant[];
  lang: 'fr' | 'ar';
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  register: (user: Omit<User, 'id' | 'role'>) => boolean;
  logout: () => void;
  addToCart: (plat: Plat, quantite?: number) => void;
  removeFromCart: (platId: string) => void;
  updateCartQuantity: (platId: string, quantite: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  placeOrder: (order: Omit<CommandeLivraison, 'id' | 'dateCommande'>) => void;
  updateOrderStatus: (orderId: string, statut: CommandeLivraison['statut']) => void;
  assignLivreur: (orderId: string, livreurId: string) => void;
  makeReservation: (res: Omit<Reservation, 'id'>) => boolean;
  updateReservationStatus: (resId: string, statut: Reservation['statut']) => void;
  addAvis: (avis: Omit<Avis, 'id' | 'date'>) => void;
  setLang: (lang: 'fr' | 'ar') => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  addPlat: (plat: Omit<Plat, 'id'>) => void;
  updatePlat: (id: string, plat: Partial<Plat>) => void;
  deletePlat: (id: string) => void;
  addTable: (table: Omit<TableRestaurant, 'id'>) => void;
  updateTable: (id: string, table: Partial<TableRestaurant>) => void;
  deleteTable: (id: string) => void;
  addLivreur: (livreur: Omit<User, 'id' | 'role'>) => boolean;
  deleteLivreur: (id: string) => void;
  deleteAvis: (id: string) => void;
  addRapport: (rapport: Omit<Rapport, 'id' | 'date' | 'statut'>) => void;
  updateRapportStatus: (id: string, statut: Rapport['statut'], reponseAdmin?: string) => void;
  deleteRapport: (id: string) => void;
  reloadData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage('lg_currentUser', null));
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('lg_cart', []));
  const [commandes, setCommandes] = useState<CommandeLivraison[]>(() => loadFromStorage('lg_commandes', initialCommandes));
  const [reservations, setReservations] = useState<Reservation[]>(() => loadFromStorage('lg_reservations', initialReservations));
  const [avis, setAvis] = useState<Avis[]>(() => loadFromStorage('lg_avis', initialAvis));
  const [rapports, setRapports] = useState<Rapport[]>(() => loadFromStorage('lg_rapports', []));
  const [usersState, setUsers] = useState<User[]>(() => loadFromStorage('lg_users', initialUsers));
  const [platsList, setPlatsList] = useState<Plat[]>(() => applyPlatImageFixes(loadFromStorage('lg_plats', initialPlats)));
  const [tablesList, setTablesList] = useState<TableRestaurant[]>(() => loadFromStorage('lg_tables', initialTables));
  const [lang, setLang] = useState<'fr' | 'ar'>('fr');
  const [notification, setNotification] = useState<AppState['notification']>(null);
  const dbReady = useRef(false);

  useEffect(() => { saveToStorage('lg_currentUser', currentUser); }, [currentUser]);
  useEffect(() => { saveToStorage('lg_cart', cart); }, [cart]);
  useEffect(() => { saveToStorage('lg_commandes', commandes); }, [commandes]);
  useEffect(() => { saveToStorage('lg_reservations', reservations); }, [reservations]);
  useEffect(() => { saveToStorage('lg_avis', avis); }, [avis]);
  useEffect(() => { saveToStorage('lg_rapports', rapports); }, [rapports]);
  useEffect(() => { saveToStorage('lg_users', usersState); }, [usersState]);
  useEffect(() => { saveToStorage('lg_plats', platsList); }, [platsList]);
  useEffect(() => { saveToStorage('lg_tables', tablesList); }, [tablesList]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // DB helper: write to supabase if connected
  const dbWrite = useCallback(async (
    table: string,
    action: 'insert' | 'update' | 'delete' | 'upsert',
    data?: Record<string, unknown>,
    match?: Record<string, unknown>,
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!dbReady.current) return { ok: true };
    try {
      let error: { message?: string } | null = null;

      if (action === 'insert') {
        const res = await supabase.from(table).insert(data!);
        error = res.error;
      } else if (action === 'upsert') {
        const res = await supabase.from(table).upsert(data!);
        error = res.error;
      } else if (action === 'update' && match) {
        const [key, val] = Object.entries(match)[0];
        const res = await supabase.from(table).update(data!).eq(key, val);
        error = res.error;
      } else if (action === 'delete' && match) {
        const [key, val] = Object.entries(match)[0];
        const res = await supabase.from(table).delete().eq(key, val);
        error = res.error;
      }

      if (error) {
        console.warn(`[Supabase] Write failed for ${table}:`, error.message);
        return { ok: false, error: error.message || 'Unknown database error' };
      }

      return { ok: true };
    } catch (e) {
      console.warn(`[Supabase] Write failed for ${table}:`, e);
      return { ok: false, error: 'Network or database error' };
    }
  }, []);

  // Seed each supabase table independently if empty
  const seedIfEmpty = useCallback(async () => {
    console.log('[Supabase] Checking tables for initial seed...');

    const tableSeeds = [
      { table: 'users', rows: initialUsers as unknown as Record<string, unknown>[] },
      { table: 'plats', rows: applyPlatImageFixes(initialPlats) as unknown as Record<string, unknown>[] },
      { table: 'restaurant_tables', rows: initialTables as unknown as Record<string, unknown>[] },
      { table: 'commandes', rows: initialCommandes as unknown as Record<string, unknown>[] },
      { table: 'reservations', rows: initialReservations as unknown as Record<string, unknown>[] },
      { table: 'avis', rows: initialAvis as unknown as Record<string, unknown>[] },
    ];

    await Promise.all(tableSeeds.map(async ({ table, rows }) => {
      try {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
          console.warn(`[Supabase] Seed check failed for ${table}:`, error.message);
          return;
        }
        if (!count || count === 0) {
          const { error: seedError } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
          if (seedError) {
            console.warn(`[Supabase] Seed insert failed for ${table}:`, seedError.message);
            return;
          }
          console.log(`[Supabase] Seeded table: ${table}`);
        }
      } catch (e) {
        console.warn(`[Supabase] Seed error for ${table}:`, e);
      }
    }));

    console.log('[Supabase] ✅ Seed check complete');
  }, []);

  const hasReservationConflict = useCallback((reservation: Omit<Reservation, 'id'>) => {
    return reservations.some((existing) =>
      existing.tableId === reservation.tableId &&
      existing.dateReservation === reservation.dateReservation &&
      existing.heure === reservation.heure &&
      ['en_attente', 'confirmee'].includes(existing.statut)
    );
  }, [reservations]);

  // Load all data from supabase
  const loadFromSupabase = useCallback(async () => {
    const [usersRes, platsRes, tablesRes, commandesRes, reservationsRes, avisRes, rapportsRes] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('plats').select('*'),
      supabase.from('restaurant_tables').select('*'),
      supabase.from('commandes').select('*').order('dateCommande', { ascending: false }),
      supabase.from('reservations').select('*').order('dateReservation', { ascending: false }),
      supabase.from('avis').select('*'),
      supabase.from('rapports').select('*').order('date', { ascending: false }),
    ]);
    const hasError = [usersRes, platsRes, tablesRes, commandesRes, reservationsRes, avisRes].some(r => r.error);
    if (hasError) {
      console.warn('[Supabase] Failed to load some data');
      return;
    }
    if (usersRes.data?.length) setUsers(usersRes.data as User[]);
    if (platsRes.data?.length) setPlatsList(applyPlatImageFixes(platsRes.data as Plat[]));
    if (tablesRes.data?.length) setTablesList(tablesRes.data as TableRestaurant[]);
    setCommandes((commandesRes.data || []) as CommandeLivraison[]);
    setReservations((reservationsRes.data || []) as Reservation[]);
    setAvis((avisRes.data || []) as Avis[]);
    if (!rapportsRes.error) setRapports((rapportsRes.data || []) as Rapport[]);
    console.log('[Supabase] ✅ Data loaded from SQL database');
  }, []);

  // Initialize supabase connection
  useEffect(() => {
    const init = async () => {
      const connected = await testSupabaseConnection();
      if (connected) {
        dbReady.current = true;
        await seedIfEmpty();
        await loadFromSupabase();
      } else {
        console.log('[Supabase] Using localStorage fallback');
      }
    };
    void init();
  }, [seedIfEmpty, loadFromSupabase]);

  const reloadData = useCallback(async () => {
    if (dbReady.current) {
      await loadFromSupabase();
    }
  }, [loadFromSupabase]);

  useEffect(() => {
    const handleFocus = () => { void reloadData(); };
    window.addEventListener('focus', handleFocus);
    return () => { window.removeEventListener('focus', handleFocus); };
  }, [reloadData]);

  const login = useCallback((email: string, password: string): boolean => {
    const allUsers = dbReady.current ? usersState : loadFromStorage('lg_users', usersState);
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      showNotification(`Bienvenue ${user.prenom}!`, 'success');
      return true;
    }
    showNotification('Email ou mot de passe incorrect', 'error');
    return false;
  }, [usersState, showNotification]);

  const register = useCallback((userData: Omit<User, 'id' | 'role'>): boolean => {
    if (usersState.find(u => u.email === userData.email)) {
      showNotification('Cet email est déjà utilisé', 'error');
      return false;
    }
    const newUser: User = { ...userData, id: generateId(), role: 'client' };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    void dbWrite('users', 'insert', newUser as unknown as Record<string, unknown>);
    showNotification('Compte créé avec succès!', 'success');
    return true;
  }, [usersState, showNotification, dbWrite]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
    showNotification('Déconnexion réussie', 'info');
  }, [showNotification]);

  const addToCart = useCallback((plat: Plat, quantite = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.plat.id === plat.id);
      if (existing) return prev.map(item => item.plat.id === plat.id ? { ...item, quantite: item.quantite + quantite } : item);
      return [...prev, { plat, quantite }];
    });
    showNotification(`${plat.nom} ajouté au panier`, 'success');
  }, [showNotification]);

  const removeFromCart = useCallback((platId: string) => {
    setCart(prev => prev.filter(item => item.plat.id !== platId));
  }, []);

  const updateCartQuantity = useCallback((platId: string, quantite: number) => {
    if (quantite <= 0) { setCart(prev => prev.filter(item => item.plat.id !== platId)); return; }
    setCart(prev => prev.map(item => item.plat.id === platId ? { ...item, quantite } : item));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const getCartTotal = useCallback(() => cart.reduce((total, item) => {
    const price = item.plat.promotion ? item.plat.prix * (1 - item.plat.promotion / 100) : item.plat.prix;
    return total + price * item.quantite;
  }, 0), [cart]);

  const getCartCount = useCallback(() => cart.reduce((count, item) => count + item.quantite, 0), [cart]);

  const placeOrder = useCallback((order: Omit<CommandeLivraison, 'id' | 'dateCommande'>) => {
    const newOrder: CommandeLivraison = { ...order, id: generateId(), dateCommande: new Date().toISOString() };
    setCommandes(prev => [newOrder, ...prev]);
    setCart([]);
    void dbWrite('commandes', 'insert', newOrder as unknown as Record<string, unknown>);
    showNotification('Commande passée avec succès!', 'success');
  }, [showNotification, dbWrite]);

  const updateOrderStatus = useCallback((orderId: string, statut: CommandeLivraison['statut']) => {
    setCommandes(prev => prev.map(cmd => cmd.id === orderId ? { ...cmd, statut } : cmd));
    void dbWrite('commandes', 'update', { statut }, { id: orderId });
    showNotification('Statut de la commande mis à jour', 'success');
  }, [showNotification, dbWrite]);

  const assignLivreur = useCallback((orderId: string, livreurId: string) => {
    setCommandes(prev => prev.map(cmd => cmd.id === orderId ? { ...cmd, livreurId, statut: 'en_livraison' as const } : cmd));
    void dbWrite('commandes', 'update', { livreurId, statut: 'en_livraison' }, { id: orderId });
    showNotification('Livreur assigné', 'success');
  }, [showNotification, dbWrite]);

  const makeReservation = useCallback((res: Omit<Reservation, 'id'>): boolean => {
    if (hasReservationConflict(res)) {
      showNotification('Cette table est déjà réservée pour cette date et cette heure', 'error');
      return false;
    }

    const newRes: Reservation = { ...res, id: generateId() };
    setReservations(prev => [newRes, ...prev]);
    void dbWrite('reservations', 'insert', newRes as unknown as Record<string, unknown>);
    showNotification('Réservation effectuée avec succès!', 'success');
    return true;
  }, [showNotification, dbWrite, hasReservationConflict]);

  const updateReservationStatus = useCallback((resId: string, statut: Reservation['statut']) => {
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, statut } : r));
    void dbWrite('reservations', 'update', { statut }, { id: resId });
    showNotification('Statut de la réservation mis à jour', 'success');
  }, [showNotification, dbWrite]);

  const addAvis = useCallback((avisData: Omit<Avis, 'id' | 'date'>) => {
    const newAvis: Avis = { ...avisData, id: generateId(), date: new Date().toISOString().split('T')[0] };
    setAvis(prev => [...prev, newAvis]);
    void dbWrite('avis', 'insert', newAvis as unknown as Record<string, unknown>);
    showNotification('Merci pour votre avis!', 'success');
  }, [showNotification, dbWrite]);

  const deleteAvis = useCallback((id: string) => {
    setAvis(prev => prev.filter(a => a.id !== id));
    void dbWrite('avis', 'delete', undefined, { id });
    showNotification('Avis supprimé', 'success');
  }, [showNotification, dbWrite]);

  const addPlat = useCallback((platData: Omit<Plat, 'id'>) => {
    const newPlat: Plat = { ...platData, id: generateId() };
    setPlatsList(prev => [...prev, newPlat]);
    void dbWrite('plats', 'insert', newPlat as unknown as Record<string, unknown>);
    showNotification('Plat ajouté', 'success');
  }, [showNotification, dbWrite]);

  const updatePlat = useCallback((id: string, data: Partial<Plat>) => {
    setPlatsList(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    void dbWrite('plats', 'update', data as Record<string, unknown>, { id });
    showNotification('Plat mis à jour', 'success');
  }, [showNotification, dbWrite]);

  const deletePlat = useCallback((id: string) => {
    setPlatsList(prev => prev.filter(p => p.id !== id));
    void dbWrite('plats', 'delete', undefined, { id });
    showNotification('Plat supprimé', 'success');
  }, [showNotification, dbWrite]);

  const addTable = useCallback((tableData: Omit<TableRestaurant, 'id'>) => {
    const newTable: TableRestaurant = { ...tableData, id: generateId() };
    setTablesList(prev => [...prev, newTable]);
    void dbWrite('restaurant_tables', 'insert', newTable as unknown as Record<string, unknown>);
    showNotification('Table ajoutée', 'success');
  }, [showNotification, dbWrite]);

  const updateTable = useCallback((id: string, data: Partial<TableRestaurant>) => {
    const previousTable = tablesList.find(t => t.id === id);
    setTablesList(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));

    void (async () => {
      const result = await dbWrite('restaurant_tables', 'update', data as Record<string, unknown>, { id });
      if (!result.ok) {
        // rollback si la DB refuse la modification
        if (previousTable) {
          setTablesList(prev => prev.map(t => t.id === id ? previousTable : t));
        }
        showNotification(`Échec mise à jour table: ${result.error}`, 'error');
        return;
      }
      showNotification('Table mise à jour', 'success');
    })();
  }, [showNotification, dbWrite, tablesList]);

  const deleteTable = useCallback((id: string) => {
    setTablesList(prev => prev.filter(t => t.id !== id));
    void dbWrite('restaurant_tables', 'delete', undefined, { id });
    showNotification('Table supprimée', 'success');
  }, [showNotification, dbWrite]);

  const addLivreur = useCallback((livreurData: Omit<User, 'id' | 'role'>): boolean => {
    if (usersState.find(u => u.email === livreurData.email)) {
      showNotification('Cet email est déjà utilisé', 'error');
      return false;
    }
    const newLivreur: User = { ...livreurData, id: generateId(), role: 'livreur' };
    setUsers(prev => [...prev, newLivreur]);
    void dbWrite('users', 'insert', newLivreur as unknown as Record<string, unknown>);
    showNotification('Livreur ajouté avec succès!', 'success');
    return true;
  }, [usersState, showNotification, dbWrite]);

  const deleteLivreur = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    void dbWrite('users', 'delete', undefined, { id });
    showNotification('Livreur supprimé', 'success');
  }, [showNotification, dbWrite]);

  const addRapport = useCallback((rapportData: Omit<Rapport, 'id' | 'date' | 'statut'>) => {
    const newRapport: Rapport = { ...rapportData, id: generateId(), date: new Date().toISOString().split('T')[0], statut: 'nouveau' };
    setRapports(prev => [newRapport, ...prev]);
    void dbWrite('rapports', 'insert', newRapport as unknown as Record<string, unknown>);
    showNotification('Rapport envoyé avec succès!', 'success');
  }, [showNotification, dbWrite]);

  const updateRapportStatus = useCallback((id: string, statut: Rapport['statut'], reponseAdmin?: string) => {
    setRapports(prev => prev.map(r => r.id === id ? { ...r, statut, ...(reponseAdmin !== undefined ? { reponseAdmin } : {}) } : r));
    const data: Record<string, unknown> = { statut };
    if (reponseAdmin !== undefined) data.reponseAdmin = reponseAdmin;
    void dbWrite('rapports', 'update', data, { id });
    showNotification('Rapport mis à jour', 'success');
  }, [showNotification, dbWrite]);

  const deleteRapport = useCallback((id: string) => {
    setRapports(prev => prev.filter(r => r.id !== id));
    void dbWrite('rapports', 'delete', undefined, { id });
    showNotification('Rapport supprimé', 'success');
  }, [showNotification, dbWrite]);

  return (
    <AppContext.Provider value={{
      currentUser, cart, commandes, reservations, avis, rapports, users: usersState,
      platsList, tablesList, lang, notification,
      login, register, logout,
      addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, getCartCount,
      placeOrder, updateOrderStatus, assignLivreur,
      makeReservation, updateReservationStatus,
      addAvis, deleteAvis, setLang, showNotification,
      addPlat, updatePlat, deletePlat,
      addTable, updateTable, deleteTable,
      addLivreur, deleteLivreur,
      addRapport, updateRapportStatus, deleteRapport,
      reloadData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
