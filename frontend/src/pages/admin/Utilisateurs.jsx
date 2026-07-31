import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function GererUtilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [chargement, setChargement] = useState(true);

    const charger = () => {
        api.get('/admin/utilisateurs').then((res) => setUtilisateurs(res.data)).finally(() => setChargement(false));
    };

    useEffect(() => { charger(); }, []);

    const handleValider = async (producteurId) => {
        await api.put(`/admin/producteurs/${producteurId}/valider`);
        charger();
    };

    const roleDe = (u) => {
        if (u.acheteur) return 'Acheteur';
        if (u.producteur) return 'Producteur';
        if (u.administrateur) return 'Administrateur';
        return '—';
    };

    if (chargement) return <p>Chargement...</p>;

    return (
        <div style={{ maxWidth: 800, margin: '30px auto' }}>
            <Link to="/admin">← Retour à mon espace</Link>
            <h1>Gérer les comptes utilisateurs ({utilisateurs.length})</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                    <th style={{ padding: 8 }}>Nom</th>
                    <th style={{ padding: 8 }}>Email</th>
                    <th style={{ padding: 8 }}>Rôle</th>
                    <th style={{ padding: 8 }}>Statut</th>
                    <th style={{ padding: 8 }}></th>
                </tr>
                </thead>
                <tbody>
                {utilisateurs.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: 8 }}>{u.name}</td>
                        <td style={{ padding: 8 }}>{u.email}</td>
                        <td style={{ padding: 8 }}>{roleDe(u)}</td>
                        <td style={{ padding: 8 }}>
                            {u.producteur
                                ? (u.producteur.statut_compte
                                    ? <span style={{ color: 'green' }}>✓ Vérifié</span>
                                    : <span style={{ color: 'orange' }}>En attente</span>)
                                : '—'}
                        </td>
                        <td style={{ padding: 8 }}>
                            {u.producteur && !u.producteur.statut_compte && (
                                <button onClick={() => handleValider(u.producteur.id)}>Valider</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}