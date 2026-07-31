import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Link } from 'react-router-dom';


export default function DashboardAdmin() {
    const { user, logout } = useAuth();
    const [indicateurs, setIndicateurs] = useState(null);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [chargement, setChargement] = useState(true);

    const charger = () => {
        Promise.all([
            api.get('/admin/indicateurs'),
            api.get('/admin/utilisateurs'),
        ]).then(([resIndic, resUsers]) => {
            setIndicateurs(resIndic.data);
            setUtilisateurs(resUsers.data);
        }).finally(() => setChargement(false));
    };

    useEffect(() => { charger(); }, []);

    const handleValider = async (producteurId) => {
        await api.put(`/admin/producteurs/${producteurId}/valider`);
        charger();
    };

    if (chargement) return <p>Chargement...</p>;

    const producteursNonVerifies = utilisateurs.filter((u) => u.producteur && !u.producteur.statut_compte);

    return (
        <div style={{ maxWidth: 900, margin: '30px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Espace Administrateur</h1>
                <button onClick={logout}>Se déconnecter</button>
            </div>
            <p>Bienvenue, {user?.name}</p>
            <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
                <Link to="/admin/utilisateurs">Gérer les utilisateurs</Link>
                <Link to="/admin/categories">Gérer les catégories</Link>
                <Link to="/admin/commandes">Superviser les commandes</Link>
                <Link to="/admin/negociations">Superviser les négociations</Link>
                <Link to="/admin/evaluations">Consulter les évaluations</Link>

            </div>

            <h2>Indicateurs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
                    <h4>Utilisateurs</h4>
                    <p>Total : {indicateurs.statistiques_utilisateurs.total}</p>
                    <p>Acheteurs : {indicateurs.statistiques_utilisateurs.acheteurs}</p>
                    <p>Producteurs : {indicateurs.statistiques_utilisateurs.producteurs}</p>
                </div>
                <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
                    <h4>Offres</h4>
                    <p>Total : {indicateurs.statistiques_offres.total}</p>
                    <p>Disponibles : {indicateurs.statistiques_offres.disponibles}</p>
                </div>
                <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
                    <h4>Négociations</h4>
                    <p>Total : {indicateurs.statistiques_negociations.total}</p>
                    <p>Acceptées : {indicateurs.statistiques_negociations.acceptees}</p>
                    <p>Refusées : {indicateurs.statistiques_negociations.refusees}</p>
                    <p>Annulées : {indicateurs.statistiques_negociations.annulees}</p>
                </div>
                <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
                    <h4>Transactions</h4>
                    <p>Commandes : {indicateurs.statistiques_transactions.total_commandes}</p>
                    <p>Confirmées : {indicateurs.statistiques_transactions.commandes_confirmees}</p>
                    <p>Montant total : {indicateurs.statistiques_transactions.montant_total} FCFA</p>
                </div>
            </div>

            <h2>Comptes producteurs en attente de vérification ({producteursNonVerifies.length})</h2>
            {producteursNonVerifies.length === 0 ? (
                <p>Aucun compte en attente.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {producteursNonVerifies.map((u) => (
                        <li key={u.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                            <span>{u.name} — {u.producteur.zone_production}</span>
                            <button onClick={() => handleValider(u.producteur.id)}>Valider ce compte</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}