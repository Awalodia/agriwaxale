import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function HistoriqueVentes() {
    const [commandes, setCommandes] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        api.get('/commandes').then((res) => {
            setCommandes(res.data.filter((c) => ['confirmee', 'livree'].includes(c.statut)));
        }).finally(() => setChargement(false));
    }, []);

    if (chargement) return <DashboardLayout title="Historique"><p>Chargement...</p></DashboardLayout>;

    const totalVentes = commandes.reduce((sum, c) => sum + (c.ligne_commandes?.reduce((s, l) => s + l.sous_total, 0) || 0), 0);

    return (
        <DashboardLayout title="Historique des ventes" subtitle={`${commandes.length} vente(s) — ${totalVentes} FCFA`}>
            <div className="table-card">
                {commandes.length === 0 ? <p className="text-secondary">Aucune vente confirmée.</p> : (
                    <table className="table align-middle">
                        <thead><tr><th>Référence</th><th>Acheteur</th><th>Produits</th><th>Statut</th></tr></thead>
                        <tbody>
                        {commandes.map((c) => (
                            <tr key={c.id}>
                                <td><Link to={`/producteur/commandes/${c.id}`}>Commande #{c.id}</Link></td>
                                <td>{c.acheteur?.user?.name}</td>
                                <td>{c.ligne_commandes?.map((l) => `${l.offre?.nom_produit} × ${l.quantite}`).join(', ')}</td>
                                <td><span className={`badge ${c.statut === 'livree' ? 'text-bg-success' : 'text-bg-secondary'}`}>{c.statut}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}