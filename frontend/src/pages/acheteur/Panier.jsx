import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function Panier() {
    const [commande, setCommande] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [adresse, setAdresse] = useState('');
    const [modeLivraison, setModeLivraison] = useState('livraison_domicile');
    const [erreur, setErreur] = useState('');
    const navigate = useNavigate();

    const charger = () => {
        api.get('/panier').then((res) => setCommande(res.data)).finally(() => setChargement(false));
    };
    useEffect(() => { charger(); }, []);

    const handleRetirer = async (ligneId) => {
        await api.delete(`/lignes-commande/${ligneId}`);
        charger();
    };

    const handleValider = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            await api.put(`/commandes/${commande.id}`, { action: 'valider', adresse_livraison: adresse, mode_livraison: modeLivraison });
            navigate(`/acheteur/commandes/${commande.id}`);
        } catch (err) {
            setErreur(err.response?.data?.message || 'Erreur lors de la validation.');
        }
    };

    if (chargement) return <DashboardLayout title="Mon panier"><p>Chargement...</p></DashboardLayout>;

    if (!commande || commande.ligne_commandes?.length === 0) {
        return (
            <DashboardLayout title="Mon panier">
                <div className="table-card text-center">
                    <p className="text-secondary mb-3">Votre panier est vide.</p>
                    <Link to="/" className="btn btn-agri">Parcourir le catalogue</Link>
                </div>
            </DashboardLayout>
        );
    }

    const total = commande.ligne_commandes.reduce((sum, l) => sum + l.sous_total, 0);

    return (
        <DashboardLayout title="Mon panier" subtitle={`${commande.ligne_commandes.length} article(s)`}>
            <div className="table-card">
                {commande.ligne_commandes.map((l) => (
                    <div key={l.id} className="d-flex justify-content-between align-items-center border-bottom py-3">
                        <div>
                            <strong>{l.offre?.nom_produit}</strong>
                            <div className="small text-secondary">{l.quantite} × {l.prix_unitaire} FCFA — {l.offre?.producteur?.user?.name}</div>
                        </div>
                        <div className="text-end">
                            <div className="fw-bold text-success">{l.sous_total} FCFA</div>
                            <button className="btn btn-sm btn-outline-danger mt-1" onClick={() => handleRetirer(l.id)}>Retirer</button>
                        </div>
                    </div>
                ))}
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3">
                    <strong className="fs-5">Total : {total} FCFA</strong>
                </div>
            </div>

            <div className="table-card">
                <h5 className="fw-bold mb-3">Valider ma commande</h5>
                <form onSubmit={handleValider}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Adresse de livraison</label>
                        <input className="form-control" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mode de livraison</label>
                        <select className="form-select" value={modeLivraison} onChange={(e) => setModeLivraison(e.target.value)}>
                            <option value="livraison_domicile">Livraison à domicile</option>
                            <option value="retrait">Retrait sur place</option>
                        </select>
                    </div>
                    {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
                    <button type="submit" className="btn btn-agri w-100">Valider ma commande ({total} FCFA)</button>
                </form>
            </div>
        </DashboardLayout>
    );
}