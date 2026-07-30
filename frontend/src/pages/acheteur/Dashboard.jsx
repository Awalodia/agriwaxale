import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function DashboardAcheteur() {
    const { user, logout } = useAuth();
    const [negociations, setNegociations] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/negociations'),
            api.get('/commandes'),
        ]).then(([resNego, resCmd]) => {
            setNegociations(resNego.data);
            setCommandes(resCmd.data);
        }).finally(() => setChargement(false));
    }, []);

    const statutCouleur = (statut) => {
        if (['acceptee', 'confirmee'].includes(statut)) return 'green';
        if (['refusee', 'annulee'].includes(statut)) return 'red';
        return '#888';
    };

    if (chargement) return <p>Chargement...</p>;

    return (
        <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Mon espace Acheteur</h1>
                <div>
                    <Link to="/" style={{ marginRight: 10 }}>Voir le catalogue</Link>
                    <button onClick={logout}>Se déconnecter</button>
                </div>
            </div>

            <p>Bienvenue, {user?.name}</p>

            <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
                <Link to="/acheteur/profil">Gérer mon profil</Link>
            </div>

            <h2>Mes négociations</h2>
            {negociations.length === 0 ? (
                <p>Aucune négociation pour le moment.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {negociations.map((n) => (
                        <li key={n.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                            <Link to={`/acheteur/negociations/${n.id}`}>
                                {n.offre?.nom_produit} — <span style={{ color: statutCouleur(n.statut) }}>{n.statut}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Mes commandes</h2>
            {commandes.length === 0 ? (
                <p>Aucune commande pour le moment.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {commandes.map((c) => (
                        <li key={c.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                            <Link to={`/acheteur/commandes/${c.id}`}>
                                Commande #{c.id} — <span style={{ color: statutCouleur(c.statut) }}>{c.statut}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}