import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, Footer } from './components/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReservationPage from './pages/ReservationPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LivreurPage from './pages/LivreurPage';
import RapportPage from './pages/RapportPage';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" />;
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/" />;
  return <>{children}</>;
}

// Recharger les données à chaque changement de page
function DataReloader() {
  const location = useLocation();
  const { reloadData } = useApp();

  useEffect(() => {
    reloadData();
  }, [location.pathname, reloadData]);

  return null;
}

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      <DataReloader />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={currentUser ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/cart" element={
            <ProtectedRoute><CartPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>
          } />
          <Route path="/livreur" element={
            <ProtectedRoute roles={['livreur']}><LivreurPage /></ProtectedRoute>
          } />
          <Route path="/rapport" element={
            <ProtectedRoute roles={['client']}><RapportPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  );
}
