import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function DashboardAcheteur() {
    const { user } = useAuth();
    const [negociations, setNegociations] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        Promise.all([api.get('/negociations'), api.get('/commandes')])
            .then(([resNego, resCmd]) => {
                setNegociations(resNego.data);
                setCommandes(resCmd.data);
            })
            .finally(() => setChargement(false));
    }, []);

    const badge = (statut) => {
        if (['acceptee', 'confirmee', 'livree'].includes(statut)) return 'text-bg-success';
        if (['refusee', 'annulee'].includes(statut)) return 'text-bg-danger';
        return 'text-bg-secondary';
    };

    if (chargement) return <DashboardLayout title="Espace acheteur"><p>Chargement...</p></DashboardLayout>;

    const enCours = negociations.filter((n) => n.statut === 'en_cours').length;
    const enLivraison = commandes.filter((c) => ['confirmee'].includes(c.statut)).length;

    return (
        <DashboardLayout title="Espace acheteur" subtitle={`Bienvenue, ${user?.name}`}>
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-chat-dots"></i></span>
                        <div className="dashboard-number">{enCours}</div>
                        <span className="text-secondary">Négociations en cours</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-bag-check"></i></span>
                        <div className="dashboard-number">{commandes.length}</div>
                        <span className="text-secondary">Commandes passées</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-truck"></i></span>
                        <div className="dashboard-number">{enLivraison}</div>
                        <span className="text-secondary">En livraison</span>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <h5 className="fw-bold mb-4">Mes négociations</h5>
                {negociations.length === 0 ? <p className="text-secondary">Aucune négociation.</p> : (
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead><tr><th>Produit</th><th>Statut</th></tr></thead>
                            <tbody>
                            {negociations.map((n) => (
                                <tr key={n.id}>
                                    <td><Link to={`/acheteur/negociations/${n.id}`}>{n.offre?.nom_produit}</Link></td>
                                    <td><span className={`badge ${badge(n.statut)}`}>{n.statut}</span></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="table-card">
                <h5 className="fw-bold mb-4">Mes commandes</h5>
                {commandes.length === 0 ? <p className="text-secondary">Aucune commande.</p> : (
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead><tr><th>Référence</th><th>Statut</th></tr></thead>
                            <tbody>
                            {commandes.map((c) => (
                                <tr key={c.id}>
                                    <td><Link to={`/acheteur/commandes/${c.id}`}>Commande #{c.id}</Link></td>
                                    <td><span className={`badge ${badge(c.statut)}`}>{c.statut}</span></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}