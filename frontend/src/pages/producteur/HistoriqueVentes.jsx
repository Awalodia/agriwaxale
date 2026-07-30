import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function HistoriqueVentes() {
    const [commandes, setCommandes] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        api.get('/commandes').then((res) => {
            setCommandes(res.data.filter((c) => ['confirmee', 'livree'].includes(c.statut)));
        }).finally(() => setChargement(false));
    }, []);

    if (chargement) return <p>Chargement...</p>;

    const totalVentes = commandes.reduce((sum, c) => {
        return sum + (c.ligne_commandes?.reduce((s, l) => s + l.sous_total, 0) || 0);
    }, 0);

    return (
        <div style={{ maxWidth: 700, margin: '30px auto' }}>
            <Link to="/producteur">← Retour à mon espace</Link>
            <h1>Historique des ventes</h1>
            <p>{commandes.length} vente(s) confirmée(s) — total : <strong>{totalVentes} FCFA</strong></p>

            {commandes.length === 0 ? (
                <p>Aucune vente confirmée pour le moment.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {commandes.map((c) => (
                        <li key={c.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                            <Link to={`/producteur/commandes/${c.id}`}>
                                Commande #{c.id} — {c.acheteur?.user?.name} — <span style={{ color: c.statut === 'livree' ? 'green' : '#888' }}>{c.statut}</span>
                            </Link>
                            {c.ligne_commandes?.map((l) => (
                                <p key={l.id} style={{ fontSize: 13, color: '#666', margin: '4px 0 0 0' }}>
                                    {l.offre?.nom_produit} × {l.quantite} = {l.sous_total} FCFA
                                </p>
                            ))}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}