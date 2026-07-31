import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function SuperviserCommandes() {
    const [commandes, setCommandes] = useState([]);

    useEffect(() => {
        api.get('/admin/commandes').then((res) => setCommandes(res.data));
    }, []);

    const statutCouleur = (statut) => {
        if (['confirmee', 'livree'].includes(statut)) return 'green';
        if (statut === 'annulee') return 'red';
        return '#888';
    };

    return (
        <div style={{ maxWidth: 700, margin: '30px auto' }}>
            <Link to="/admin">← Retour à mon espace</Link>
            <h1>Superviser les commandes ({commandes.length})</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {commandes.map((c) => (
                    <li key={c.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                        <p>Commande #{c.id} — <span style={{ color: statutCouleur(c.statut) }}>{c.statut}</span></p>
                        <p style={{ fontSize: 13, color: '#666' }}>Acheteur : {c.acheteur?.user?.name}</p>
                        {c.ligne_commandes?.map((l) => (
                            <p key={l.id} style={{ fontSize: 13, color: '#666' }}>{l.offre?.nom_produit} × {l.quantite}</p>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}