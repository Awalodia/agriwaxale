import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MENUS = {
    acheteur: [
        { to: '/acheteur', icon: 'bi-grid', label: 'Tableau de bord' },
        { to: '/', icon: 'bi-house', label: 'Catalogue' },
        { to: '/acheteur/panier', icon: 'bi-cart3', label: 'Mon panier' },
        { to: '/acheteur/profil', icon: 'bi-person', label: 'Mon profil' },
    ],
    producteur: [
        { to: '/producteur', icon: 'bi-grid', label: 'Tableau de bord' },
        { to: '/', icon: 'bi-house', label: 'Catalogue' },
        { to: '/producteur/offres/nouvelle', icon: 'bi-plus-circle', label: 'Publier une offre' },
        { to: '/producteur/historique', icon: 'bi-clock-history', label: 'Historique des ventes' },
        { to: '/producteur/profil', icon: 'bi-person', label: 'Mon profil' },
    ],
    administrateur: [
        { to: '/admin', icon: 'bi-grid', label: 'Tableau de bord' },
        { to: '/', icon: 'bi-house', label: 'Catalogue' },
        { to: '/admin/utilisateurs', icon: 'bi-people', label: 'Utilisateurs' },
        { to: '/admin/categories', icon: 'bi-tags', label: 'Catégories' },
        { to: '/admin/commandes', icon: 'bi-bag-check', label: 'Commandes' },
        { to: '/admin/negociations', icon: 'bi-chat-dots', label: 'Négociations' },
        { to: '/admin/evaluations', icon: 'bi-star', label: 'Évaluations' },
    ],
};

const LABELS_ROLE = {
    acheteur: 'ACHETEUR',
    producteur: 'PRODUCTEUR',
    administrateur: 'ADMINISTRATEUR',
};

export default function DashboardLayout({ children, title, subtitle }) {
    const { role, logout } = useAuth();
    const location = useLocation();
    const menu = MENUS[role] || [];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <Link to="/" className="sidebar-brand">
                    <i className="bi bi-flower1 fs-3"></i>
                    <span className="brand-text">AgriWaxalé</span>
                </Link>

                <div className="menu-text text-center mb-4">
          <span className="badge" style={{ backgroundColor: '#ffd071', color: 'var(--dark-green)', fontSize: '0.85rem', padding: '8px 14px', fontWeight: 800, letterSpacing: '0.05em' }}>
            {LABELS_ROLE[role]}
          </span>
                </div>

                <div className="sidebar-menu">
                    {menu.map((item) => (
                        <Link key={item.to} to={item.to} className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}>
                            <i className={`bi ${item.icon} me-2`}></i>
                            <span className="menu-text">{item.label}</span>
                        </Link>
                    ))}
                    <button className="sidebar-link mt-3" onClick={logout}>
                        <i className="bi bi-box-arrow-left me-2"></i>
                        <span className="menu-text">Déconnexion</span>
                    </button>
                </div>
            </aside>

            <main className="dashboard-content">
                {(title || subtitle) && (
                    <div className="dashboard-header">
                        <div>
                            {title && <h3 className="fw-bold mb-1">{title}</h3>}
                            {subtitle && <span className="text-secondary">{subtitle}</span>}
                        </div>
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}