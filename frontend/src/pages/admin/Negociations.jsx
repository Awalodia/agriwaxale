import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function SuperviserNegociations() {
    const [negociations, setNegociations] = useState([]);

    useEffect(() => {
        api.get('/admin/negociations').then((res) => setNegociations(res.data));
    }, []);

    const badge = (statut) => {
        if (statut === 'acceptee') return 'text-bg-success';
        if (['refusee', 'annulee'].includes(statut)) return 'text-bg-danger';
        return 'text-bg-secondary';
    };

    return (
        <DashboardLayout title={`Négociations (${negociations.length})`}>
            <div className="table-card">
                <table className="table align-middle">
                    <thead><tr><th>Produit</th><th>Acheteur</th><th>Producteur</th><th>Statut</th></tr></thead>
                    <tbody>
                    {negociations.map((n) => (
                        <tr key={n.id}>
                            <td>{n.offre?.nom_produit}</td>
                            <td>{n.acheteur?.user?.name}</td>
                            <td>{n.producteur?.user?.name}</td>
                            <td><span className={`badge ${badge(n.statut)}`}>{n.statut}</span></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}