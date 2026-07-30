import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function DetailOffre() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offre, setOffre] = useState(null);
    const [mode, setMode] = useState(null); // 'negocier' ou 'acheter'
    const [quantite, setQuantite] = useState(1);
    const [prixPropose, setPrixPropose] = useState('');
    const [message, setMessage] = useState('');
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        api.get(`/offres/${id}`).then((res) => setOffre(res.data));
    }, [id]);

    const handleNegocier = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            const res = await api.post('/negociations', {
                offre_id: id,
                prix_propose: prixPropose,
                quantite_proposee: quantite,
                message,
            });
            navigate(`/acheteur/negociations/${res.data.id}`);
        } catch (err) {
            setErreur("Erreur lors de l'envoi de la proposition.");
        }
    };

    const handleAcheterDirect = async () => {
        setErreur('');
        try {
            const res = await api.post('/commandes', {
                offre_id: id,
                quantite,
            });
            navigate(`/acheteur/commandes/${res.data.id}`);
        } catch (err) {
            setErreur("Erreur lors de la création de la commande.");
        }
    };

    if (!offre) return <p>Chargement...</p>;

    return (
        <div style={{ maxWidth: 600, margin: '30px auto' }}>
            <h1>{offre.nom_produit}</h1>
            <p><strong>{offre.prix_initial} FCFA</strong> — {offre.quantite} disponible(s)</p>
            <p>Catégorie : {offre.categorie?.nom}</p>
            <p>Producteur : {offre.producteur?.user?.name} ({offre.producteur?.zone_production})</p>

            <div style={{ margin: '20px 0' }}>
                <label>Quantité souhaitée : </label>
                <input type="number" min="1" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
            </div>

            {!mode && (
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleAcheterDirect}>Acheter directement ({offre.prix_initial} FCFA/unité)</button>
                    <button onClick={() => setMode('negocier')}>Négocier le prix</button>
                </div>
            )}

            {mode === 'negocier' && (
                <form onSubmit={handleNegocier}>
                    <h3>Proposer un prix</h3>
                    <div>
                        <label>Prix proposé (FCFA) : </label>
                        <input type="number" min="1" step="25" value={prixPropose} onChange={(e) => setPrixPropose(e.target.value)} required />
                    </div>
                    <div>
                        <label>Message (optionnel) : </label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                    </div>
                    <button type="submit">Envoyer la proposition</button>
                    <button type="button" onClick={() => setMode(null)}>Annuler</button>
                </form>
            )}

            {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
        </div>
    );
}