import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function DetailCommandeProducteur() {
    const { id } = useParams();
    const [commande, setCommande] = useState(null);
    const [erreur, setErreur] = useState('');

    const charger = () => {
        api.get(`/commandes/${id}`).then((res) => setCommande(res.data));
    };

    useEffect(() => { charger(); }, [id]);

    const handleConfirmer = async () => {
        setErreur('');
        try {
            await api.put(`/commandes/${id}`, { action: 'confirmer_livraison' });
            charger();
        } catch (err) {
            setErreur('Erreur lors de la confirmation.');
        }
    };

    if (!commande) return <p>Chargement...</p>;

    const total = commande.ligne_commandes?.reduce((sum, l) => sum + l.sous_total, 0) || 0;

    return (
        <div style={{ maxWidth: 600, margin: '30px auto' }}>
            <Link to="/producteur">← Retour à mon espace</Link>
            <h1>Commande #{commande.id}</h1>
            <p>Statut : <strong>{commande.statut}</strong></p>
            <p>Acheteur : {commande.acheteur?.user?.name}</p>
            <p>Adresse de livraison : {commande.adresse_livraison || 'Pas encore renseignée'}</p>

            <h3>Contenu</h3>
            {commande.ligne_commandes?.map((l) => (
                <p key={l.id}>{l.offre?.nom_produit} — {l.quantite} × {l.prix_unitaire} FCFA = {l.sous_total} FCFA</p>
            ))}
            <p><strong>Total : {total} FCFA</strong></p>

            {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

            {commande.statut === 'confirmee' && (
                <div>
                    <p style={{ color: 'green' }}>✓ Commande payée par l'acheteur.</p>
                    <button onClick={handleConfirmer}>Confirmer la préparation / livraison</button>
                </div>
            )}

            {commande.statut === 'livree' && (
                <p style={{ color: 'green' }}>✓ Commande livrée.</p>
            )}

            {['en_attente', 'en_attente_paiement'].includes(commande.statut) && (
                <p style={{ color: '#888' }}>En attente que l'acheteur finalise (adresse/paiement).</p>
            )}

            {commande.statut === 'annulee' && (
                <p style={{ color: 'red' }}>Commande annulée par l'acheteur.</p>
            )}
        </div>
    );
}