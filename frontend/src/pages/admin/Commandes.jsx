import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function SuperviserCommandes() {
    const [commandes, setCommandes] = useState([]);

    useEffect(() => {
        api.get('/admin/commandes').then((res) => setCommandes(res.data));
    }, []);

    const badge = (statut) => {
        if (['confirmee', 'livree'].includes(statut)) return 'text-bg-success';
        if (statut === 'annulee') return 'text-bg-danger';
        return 'text-bg-secondary';
    };

    return (
        <DashboardLayout title={`Commandes (${commandes.length})`}>
            <div className="table-card">
                <table className="table align-middle">
                    <thead><tr><th>Référence</th><th>Acheteur</th><th>Produits</th><th>Statut</th></tr></thead>
                    <tbody>
                    {commandes.map((c) => (
                        <tr key={c.id}>
                            <td>Commande #{c.id}</td>
                            <td>{c.acheteur?.user?.name}</td>
                            <td>{c.ligne_commandes?.map((l) => `${l.offre?.nom_produit} × ${l.quantite}`).join(', ')}</td>
                            <td><span className={`badge ${badge(c.statut)}`}>{c.statut}</span></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}