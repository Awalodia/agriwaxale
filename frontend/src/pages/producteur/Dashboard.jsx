import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function DashboardProducteur() {
    const { user } = useAuth();
    const [offres, setOffres] = useState([]);
    const [negociations, setNegociations] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [chargement, setChargement] = useState(true);

    const charger = () => {
        Promise.all([
            api.get('/offres', { params: { mine: true } }),
            api.get('/negociations'),
            api.get('/commandes'),
            api.get('/mes-evaluations'),
        ]).then(([resOffres, resNego, resCmd, resEval]) => {
            setOffres(resOffres.data);
            setNegociations(resNego.data);
            setCommandes(resCmd.data);
            setEvaluations(resEval.data);
        }).finally(() => setChargement(false));
    };

    useEffect(() => { charger(); }, []);

    const badge = (statut) => {
        if (['acceptee', 'confirmee', 'livree'].includes(statut)) return 'text-bg-success';
        if (['refusee', 'annulee'].includes(statut)) return 'text-bg-danger';
        return 'text-bg-secondary';
    };

    const handleSupprimer = async (id) => {
        if (!confirm('Supprimer cette offre ?')) return;
        await api.delete(`/offres/${id}`);
        charger();
    };

    if (chargement) return <DashboardLayout title="Espace producteur"><p>Chargement...</p></DashboardLayout>;

    const negociationsEnCours = negociations.filter((n) => n.statut === 'en_cours');
    const ventes = commandes.filter((c) => ['confirmee', 'livree'].includes(c.statut))
        .reduce((sum, c) => sum + (c.ligne_commandes?.reduce((s, l) => s + l.sous_total, 0) || 0), 0);
    const noteMoyenne = evaluations.length ? (evaluations.reduce((s, e) => s + e.note, 0) / evaluations.length).toFixed(1) : '—';

    return (
        <DashboardLayout title="Espace producteur" subtitle={`Bienvenue, ${user?.name}`}>
            <div className="d-flex justify-content-end mb-3">
                <Link to="/producteur/offres/nouvelle" className="btn btn-agri"><i className="bi bi-plus-circle me-2"></i> Publier une offre</Link>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-box-seam"></i></span>
                        <div className="dashboard-number">{offres.length}</div>
                        <span className="text-secondary">Offres actives</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-chat-dots"></i></span>
                        <div className="dashboard-number">{negociationsEnCours.length}</div>
                        <span className="text-secondary">Négociations en attente</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-cash-stack"></i></span>
                        <div className="dashboard-number">{ventes} F</div>
                        <span className="text-secondary">Ventes réalisées</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dashboard-card">
                        <span className="dashboard-icon"><i className="bi bi-star"></i></span>
                        <div className="dashboard-number">{noteMoyenne} <small style={{ fontSize: '1rem' }}>/5</small></div>
                        <span className="text-secondary">{evaluations.length} évaluation(s)</span>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <h5 className="fw-bold mb-4">Mes offres</h5>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead><tr><th>Produit</th><th>Prix</th><th>Quantité</th><th>Statut</th><th>Actions</th></tr></thead>
                        <tbody>
                        {offres.map((o) => (
                            <tr key={o.id}>
                                <td>{o.nom_produit}</td>
                                <td>{o.prix_initial} F</td>
                                <td>{o.quantite} {o.unite}</td>
                                <td><span className="badge text-bg-success">{o.statut}</span></td>
                                <td>
                                    <Link to={`/producteur/offres/${o.id}/modifier`} className="btn btn-sm btn-outline-agri me-1">Modifier</Link>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleSupprimer(o.id)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="table-card">
                <h5 className="fw-bold mb-4">Négociations en attente</h5>
                {negociationsEnCours.length === 0 ? <p className="text-secondary">Aucune négociation en cours.</p> : (
                    <table className="table align-middle">
                        <thead><tr><th>Produit</th><th>Acheteur</th><th>Statut</th></tr></thead>
                        <tbody>
                        {negociationsEnCours.map((n) => (
                            <tr key={n.id}>
                                <td><Link to={`/producteur/negociations/${n.id}`}>{n.offre?.nom_produit}</Link></td>
                                <td>{n.acheteur?.user?.name}</td>
                                <td><span className={`badge ${badge(n.statut)}`}>{n.statut}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="table-card">
                <h5 className="fw-bold mb-4">Commandes reçues</h5>
                <table className="table align-middle">
                    <thead><tr><th>Référence</th><th>Acheteur</th><th>Statut</th></tr></thead>
                    <tbody>
                    {commandes.map((c) => (
                        <tr key={c.id}>
                            <td><Link to={`/producteur/commandes/${c.id}`}>Commande #{c.id}</Link></td>
                            <td>{c.acheteur?.user?.name}</td>
                            <td><span className={`badge ${badge(c.statut)}`}>{c.statut}</span></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="table-card">
                <h5 className="fw-bold mb-4">Mes évaluations reçues</h5>
                {evaluations.length === 0 ? <p className="text-secondary">Aucune évaluation reçue.</p> : (
                    <table className="table align-middle">
                        <thead><tr><th>Note</th><th>Commentaire</th></tr></thead>
                        <tbody>
                        {evaluations.map((e) => (
                            <tr key={e.id}>
                                <td className="text-warning">{'★'.repeat(e.note)}{'☆'.repeat(5 - e.note)}</td>
                                <td className="fst-italic">{e.commentaire}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}