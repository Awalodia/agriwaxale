import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function DetailCommandeProducteur() {
    const { id } = useParams();
    const [commande, setCommande] = useState(null);
    const [erreur, setErreur] = useState('');

    const charger = () => { api.get(`/commandes/${id}`).then((res) => setCommande(res.data)); };
    useEffect(() => { charger(); }, [id]);

    const handleConfirmer = async () => {
        setErreur('');
        try {
            await api.put(`/commandes/${id}`, { action: 'confirmer_livraison' });
            charger();
        } catch (err) { setErreur('Erreur lors de la confirmation.'); }
    };

    if (!commande) return <DashboardLayout title="Commande"><p>Chargement...</p></DashboardLayout>;

    const total = commande.ligne_commandes?.reduce((sum, l) => sum + l.sous_total, 0) || 0;
    const badge = ['confirmee', 'livree'].includes(commande.statut) ? 'text-bg-success' : commande.statut === 'annulee' ? 'text-bg-danger' : 'text-bg-secondary';

    return (
        <DashboardLayout title={`Commande #${commande.id}`} subtitle={`Acheteur : ${commande.acheteur?.user?.name}`}>
            <div className="table-card" style={{ maxWidth: 600 }}>
                <span className={`badge ${badge} fs-6 mb-3`}>{commande.statut}</span>
                <p className="text-secondary">Adresse : {commande.adresse_livraison || 'Pas encore renseignée'}</p>

                <div className="product-summary mb-3">
                    {commande.ligne_commandes?.map((l) => (
                        <p key={l.id} className="mb-1">{l.offre?.nom_produit} — {l.quantite} × {l.prix_unitaire} FCFA = <strong>{l.sous_total} FCFA</strong></p>
                    ))}
                    <p className="fw-bold text-success mb-0 mt-2 pt-2 border-top">Total : {total} FCFA</p>
                </div>

                {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

                {commande.statut === 'confirmee' && (
                    <div>
                        <div className="alert alert-success">✓ Commande payée par l'acheteur.</div>
                        <button className="btn btn-agri w-100" onClick={handleConfirmer}>Confirmer la préparation / livraison</button>
                    </div>
                )}
                {commande.statut === 'livree' && <div className="alert alert-success mb-0">✓ Commande livrée.</div>}
                {['en_attente', 'en_attente_paiement'].includes(commande.statut) && (
                    <div className="alert alert-secondary mb-0">En attente que l'acheteur finalise (adresse/paiement).</div>
                )}
                {commande.statut === 'annulee' && <div className="alert alert-danger mb-0">Commande annulée par l'acheteur.</div>}
            </div>
        </DashboardLayout>
    );
}