import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function SuperviserNegociations() {
    const [negociations, setNegociations] = useState([]);

    useEffect(() => {
        api.get('/admin/negociations').then((res) => setNegociations(res.data));
    }, []);

    const statutCouleur = (statut) => {
        if (statut === 'acceptee') return 'green';
        if (['refusee', 'annulee'].includes(statut)) return 'red';
        return '#888';
    };

    return (
        <div style={{ maxWidth: 700, margin: '30px auto' }}>
            <Link to="/admin">← Retour à mon espace</Link>
            <h1>Superviser les négociations ({negociations.length})</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {negociations.map((n) => (
                    <li key={n.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                        <p>{n.offre?.nom_produit} — <span style={{ color: statutCouleur(n.statut) }}>{n.statut}</span></p>
                        <p style={{ fontSize: 13, color: '#666' }}>
                            {n.acheteur?.user?.name} ↔ {n.producteur?.user?.name}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}