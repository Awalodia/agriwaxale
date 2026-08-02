import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Catalogue from './pages/Catalogue';
import DetailOffrePublic from './pages/DetailOffrePublic';
import ProfilProducteurPublic from './pages/ProfilProducteurPublic';

import DashboardAcheteur from './pages/acheteur/Dashboard';
import DetailOffre from './pages/acheteur/DetailOffre';
import DetailNegociation from './pages/acheteur/DetailNegociation';
import DetailCommande from './pages/acheteur/DetailCommande';
import Panier from './pages/acheteur/Panier';
import ProfilAcheteur from './pages/acheteur/Profil';

import DashboardProducteur from './pages/producteur/Dashboard';
import PublierOffre from './pages/producteur/PublierOffre';
import ModifierOffre from './pages/producteur/ModifierOffre';
import RepondreNegociation from './pages/producteur/RepondreNegociation';
import DetailCommandeProducteur from './pages/producteur/DetailCommande';
import HistoriqueVentes from './pages/producteur/HistoriqueVentes';
import ProfilProducteur from './pages/producteur/Profil';

import DashboardAdmin from './pages/admin/Dashboard';
import GererCategories from './pages/admin/Categories';
import GererUtilisateurs from './pages/admin/Utilisateurs';
import SuperviserCommandes from './pages/admin/Commandes';
import SuperviserNegociations from './pages/admin/Negociations';
import ConsulterEvaluations from './pages/admin/Evaluations';

function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Catalogue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/offres/:id" element={<DetailOffrePublic />} />
            <Route path="/producteurs/:id" element={<ProfilProducteurPublic />} />

            <Route path="/acheteur" element={<ProtectedRoute allowedRoles={['acheteur']}><DashboardAcheteur /></ProtectedRoute>} />
            <Route path="/acheteur/offres/:id" element={<ProtectedRoute allowedRoles={['acheteur']}><DetailOffre /></ProtectedRoute>} />
            <Route path="/acheteur/negociations/:id" element={<ProtectedRoute allowedRoles={['acheteur']}><DetailNegociation /></ProtectedRoute>} />
            <Route path="/acheteur/commandes/:id" element={<ProtectedRoute allowedRoles={['acheteur']}><DetailCommande /></ProtectedRoute>} />
            <Route path="/acheteur/panier" element={<ProtectedRoute allowedRoles={['acheteur']}><Panier /></ProtectedRoute>} />
            <Route path="/acheteur/profil" element={<ProtectedRoute allowedRoles={['acheteur']}><ProfilAcheteur /></ProtectedRoute>} />

            <Route path="/producteur" element={<ProtectedRoute allowedRoles={['producteur']}><DashboardProducteur /></ProtectedRoute>} />
            <Route path="/producteur/offres/nouvelle" element={<ProtectedRoute allowedRoles={['producteur']}><PublierOffre /></ProtectedRoute>} />
            <Route path="/producteur/offres/:id/modifier" element={<ProtectedRoute allowedRoles={['producteur']}><ModifierOffre /></ProtectedRoute>} />
            <Route path="/producteur/negociations/:id" element={<ProtectedRoute allowedRoles={['producteur']}><RepondreNegociation /></ProtectedRoute>} />
            <Route path="/producteur/commandes/:id" element={<ProtectedRoute allowedRoles={['producteur']}><DetailCommandeProducteur /></ProtectedRoute>} />
            <Route path="/producteur/historique" element={<ProtectedRoute allowedRoles={['producteur']}><HistoriqueVentes /></ProtectedRoute>} />
            <Route path="/producteur/profil" element={<ProtectedRoute allowedRoles={['producteur']}><ProfilProducteur /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute allowedRoles={['administrateur']}><DashboardAdmin /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['administrateur']}><GererCategories /></ProtectedRoute>} />
            <Route path="/admin/utilisateurs" element={<ProtectedRoute allowedRoles={['administrateur']}><GererUtilisateurs /></ProtectedRoute>} />
            <Route path="/admin/commandes" element={<ProtectedRoute allowedRoles={['administrateur']}><SuperviserCommandes /></ProtectedRoute>} />
            <Route path="/admin/negociations" element={<ProtectedRoute allowedRoles={['administrateur']}><SuperviserNegociations /></ProtectedRoute>} />
            <Route path="/admin/evaluations" element={<ProtectedRoute allowedRoles={['administrateur']}><ConsulterEvaluations /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;