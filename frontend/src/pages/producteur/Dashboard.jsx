import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function DashboardProducteur() {
    const { user, logout } = useAuth();
    const [offres, setOffres] = useState([]);
    const [negociations, setNegociations] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/offres', { params: { mine: true } }),
            api.get('/negociations'),
            api.get('/commandes'),
        ]).then(([resOffres, resNego, resCmd]) => {
            setOffres(resOffres.data);
            setNegociations(resNego.data);
            setCommandes(resCmd.data);
        }).finally(() => setChargement(false));
    }, []);

    const statutCouleur = (statut) => {
        if (['acceptee', 'confirmee'].includes(statut)) return 'green';
        if (['refusee', 'annulee'].includes(statut)) return 'red';
        return '#888';
    };

    const handleSupprimer = async (id) => {
        if (!confirm('Supprimer cette offre ?')) return;
        await api.delete(`/offres/${id}`);
        setOffres(offres.filter((o) => o.id !== id));
    };

    if (chargement) return <p>Chargement...</p>;

    const negociationsEnCours = negociations.filter((n) => n.statut === 'en_cours');

    return (
        <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Mon espace Producteur</h1>
                <div>
                    <Link to="/" style={{ marginRight: 10 }}>Voir le catalogue</Link>
                    <button onClick={logout}>Se déconnecter</button>
                </div>
            </div>

            <p>Bienvenue, {user?.name}</p>

            <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
                <Link to="/producteur/offres/nouvelle">+ Publier une offre</Link>
                <Link to="/producteur/historique">Historique des ventes</Link>
                <Link to="/producteur/profil">Gérer mon profil</Link>
            </div>

            <h2>Mes offres ({offres.length})</h2>
            {offres.length === 0 ? (
                <p>Vous n'avez publié aucune offre.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {offres.map((o) => (
                        <li key={o.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                            <span>{o.nom_produit} — {o.prix_initial} FCFA — {o.quantite} dispo — <em>{o.statut}</em></span>
                            <span>
                <Link to={`/producteur/offres/${o.id}/modifier`} style={{ marginRight: 10 }}>Modifier</Link>
                <button onClick={() => handleSupprimer(o.id)}>Supprimer</button>
              </span>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Négociations en attente de ma réponse ({negociationsEnCours.length})</h2>
            {negociationsEnCours.length === 0 ? (
                <p>Aucune négociation en cours.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {negociationsEnCours.map((n) => (
                        <li key={n.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                            <Link to={`/producteur/negociations/${n.id}`}>
                                {n.offre?.nom_produit} — <span style={{ color: statutCouleur(n.statut) }}>{n.statut}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Commandes reçues</h2>
            {commandes.length === 0 ? (
                <p>Aucune commande pour le moment.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {commandes.map((c) => (
                        <li key={c.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                            <Link to={`/producteur/commandes/${c.id}`}>
                                Commande #{c.id} — <span style={{ color: statutCouleur(c.statut) }}>{c.statut}</span> — {c.acheteur?.user?.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}