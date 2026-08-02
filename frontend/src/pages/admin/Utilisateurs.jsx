import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

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

    const roleDe = (u) => u.acheteur ? 'Acheteur' : u.producteur ? 'Producteur' : u.administrateur ? 'Administrateur' : '—';

    if (chargement) return <DashboardLayout title="Utilisateurs"><p>Chargement...</p></DashboardLayout>;

    return (
        <DashboardLayout title={`Utilisateurs (${utilisateurs.length})`}>
            <div className="table-card">
                <table className="table align-middle">
                    <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th></th></tr></thead>
                    <tbody>
                    {utilisateurs.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{roleDe(u)}</td>
                            <td>
                                {u.producteur
                                    ? (u.producteur.statut_compte
                                        ? <span className="badge text-bg-success">Vérifié</span>
                                        : <span className="badge text-bg-warning">En attente</span>)
                                    : <span className="badge text-bg-secondary">—</span>}
                            </td>
                            <td>
                                {u.producteur && !u.producteur.statut_compte && (
                                    <button className="btn btn-sm btn-agri" onClick={() => handleValider(u.producteur.id)}>Valider</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}