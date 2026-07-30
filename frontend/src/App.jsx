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
import PublierOffre from './pages/producteur/PublierOffre';
import RepondreNegociation from './pages/producteur/RepondreNegociation';
import ModifierOffre from './pages/producteur/ModifierOffre';
import DetailCommandeProducteur from './pages/producteur/DetailCommande';
import HistoriqueVentes from './pages/producteur/HistoriqueVentes';
import ProfilProducteur from './pages/producteur/Profil';
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
            <Route path="/producteur/offres/nouvelle" element={
              <ProtectedRoute allowedRoles={['producteur']}>
                <PublierOffre />
              </ProtectedRoute>
            } />
              <Route path="/producteur/negociations/:id" element={
                  <ProtectedRoute allowedRoles={['producteur']}>
                      <RepondreNegociation />
                  </ProtectedRoute>
              } />
              <Route path="/producteur/offres/:id/modifier" element={
                  <ProtectedRoute allowedRoles={['producteur']}>
                      <ModifierOffre />
                  </ProtectedRoute>
              } />
              <Route path="/producteur/commandes/:id" element={
                  <ProtectedRoute allowedRoles={['producteur']}>
                      <DetailCommandeProducteur />
                  </ProtectedRoute>
              } />
            <Route path="/producteur/historique" element={
              <ProtectedRoute allowedRoles={['producteur']}>
                <HistoriqueVentes />
              </ProtectedRoute>
            } />
            <Route path="/producteur/profil" element={
              <ProtectedRoute allowedRoles={['producteur']}>
                <ProfilProducteur />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );

}

export default App;