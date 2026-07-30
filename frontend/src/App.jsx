import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Catalogue from './pages/Catalogue';
import DashboardAcheteur from './pages/acheteur/Dashboard';
import DashboardProducteur from './pages/producteur/Dashboard';
import DashboardAdmin from './pages/admin/Dashboard';
import DetailOffre from './pages/acheteur/DetailOffre';
import DetailNegociation from './pages/acheteur/DetailNegociation';
import DetailCommande from './pages/acheteur/DetailCommande';
import ProfilAcheteur from './pages/acheteur/Profil';

function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Visiteur : accès libre */}
            <Route path="/" element={<Catalogue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Acheteur uniquement */}
            <Route path="/acheteur" element={
              <ProtectedRoute allowedRoles={['acheteur']}>
                <DashboardAcheteur />
              </ProtectedRoute>
            } />
            <Route path="/acheteur/offres/:id" element={
              <ProtectedRoute allowedRoles={['acheteur']}>
                <DetailOffre />
              </ProtectedRoute>
            } />
            <Route path="/acheteur/negociations/:id" element={
              <ProtectedRoute allowedRoles={['acheteur']}>
                <DetailNegociation />
              </ProtectedRoute>
            } />
            <Route path="/acheteur/commandes/:id" element={
              <ProtectedRoute allowedRoles={['acheteur']}>
                <DetailCommande />
              </ProtectedRoute>
            } />
            <Route path="/acheteur/profil" element={
              <ProtectedRoute allowedRoles={['acheteur']}>
                <ProfilAcheteur />
              </ProtectedRoute>
            } />

            {/* Producteur uniquement */}
            <Route path="/producteur" element={
              <ProtectedRoute allowedRoles={['producteur']}>
                <DashboardProducteur />
              </ProtectedRoute>
            } />

            {/* Administrateur uniquement */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['administrateur']}>
                <DashboardAdmin />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;