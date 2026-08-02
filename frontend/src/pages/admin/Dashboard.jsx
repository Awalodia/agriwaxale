import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function DashboardAdmin() {
    const { user } = useAuth();
    const [indicateurs, setIndicateurs] = useState(null);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [chargement, setChargement] = useState(true);

    const charger = () => {
        Promise.all([api.get('/admin/indicateurs'), api.get('/admin/utilisateurs')])
            .then(([resIndic, resUsers]) => {
                setIndicateurs(resIndic.data);
                setUtilisateurs(resUsers.data);
            }).finally(() => setChargement(false));
    };

    useEffect(() => { charger(); }, []);

    const handleValider = async (producteurId) => {
        await api.put(`/admin/producteurs/${producteurId}/valider`);
        charger();
    };

    if (chargement) return <DashboardLayout title="Administration"><p>Chargement...</p></DashboardLayout>;

    const producteursNonVerifies = utilisateurs.filter((u) => u.producteur && !u.producteur.statut_compte);

    return (
        <DashboardLayout title="Tableau de bord administrateur" subtitle={`Bienvenue, ${user?.name}`}>
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-people"></i></span>
                        <div className="dashboard-number">{indicateurs.statistiques_utilisateurs.total}</div>
                        <span className="text-secondary">Utilisateurs ({indicateurs.statistiques_utilisateurs.acheteurs} ach. / {indicateurs.statistiques_utilisateurs.producteurs} prod.)</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-box-seam"></i></span>
                        <div className="dashboard-number">{indicateurs.statistiques_offres.total}</div>
                        <span className="text-secondary">Offres ({indicateurs.statistiques_offres.disponibles} disponibles)</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-chat-dots"></i></span>
                        <div className="dashboard-number">{indicateurs.statistiques_negociations.total}</div>
                        <span className="text-secondary">Négociations ({indicateurs.statistiques_negociations.acceptees} acceptées)</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-cash-stack"></i></span>
                        <div className="dashboard-number">{indicateurs.statistiques_transactions.montant_total} F</div>
                        <span className="text-secondary">{indicateurs.statistiques_transactions.commandes_confirmees} transaction(s)</span>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <h5 className="fw-bold mb-4">Comptes producteurs en attente de vérification ({producteursNonVerifies.length})</h5>
                {producteursNonVerifies.length === 0 ? <p className="text-secondary">Aucun compte en attente.</p> : (
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead><tr><th>Nom</th><th>Zone</th><th>Action</th></tr></thead>
                            <tbody>
                            {producteursNonVerifies.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td>{u.producteur.zone_production}</td>
                                    <td><button className="btn btn-sm btn-agri" onClick={() => handleValider(u.producteur.id)}>Valider</button></td>
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