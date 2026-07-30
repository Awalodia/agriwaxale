import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function DetailCommande() {
    const { id } = useParams();
    const [commande, setCommande] = useState(null);
    const [adresse, setAdresse] = useState('');
    const [modeLivraison, setModeLivraison] = useState('livraison_domicile');
    const [modePaiement, setModePaiement] = useState('wave');
    const [erreur, setErreur] = useState('');
    const [noteEval, setNoteEval] = useState(5);
    const [commentaireEval, setCommentaireEval] = useState('');
    const [evalEnvoyee, setEvalEnvoyee] = useState(false);

    const charger = () => {
        api.get(`/commandes/${id}`).then((res) => setCommande(res.data));
    };

    useEffect(() => { charger(); }, [id]);

    const handleValider = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            await api.put(`/commandes/${id}`, {
                action: 'valider',
                adresse_livraison: adresse,
                mode_livraison: modeLivraison,
            });
            charger();
        } catch (err) {
            setErreur('Erreur lors de la validation.');
        }
    };

    const handlePayer = async () => {
        setErreur('');
        try {
            await api.post('/paiements', { commande_id: id, mode_paiement: modePaiement });
            charger();
        } catch (err) {
            setErreur('Erreur lors du paiement.');
        }
    };

    const handleAnnuler = async () => {
        setErreur('');
        try {
            await api.put(`/commandes/${id}`, { action: 'annuler' });
            charger();
        } catch (err) {
            setErreur('Cette commande ne peut plus être annulée.');
        }
    };

    const handleEvaluer = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            await api.post('/evaluations', { commande_id: id, note: noteEval, commentaire: commentaireEval });
            setEvalEnvoyee(true);
        } catch (err) {
            setErreur("Erreur lors de l'évaluation.");
        }
    };

    if (!commande) return <p>Chargement...</p>;

    const peutAnnuler = !['confirmee', 'livree', 'annulee'].includes(commande.statut);
    const total = commande.ligne_commandes?.reduce((sum, l) => sum + l.sous_total, 0) || 0;

    return (
        <div style={{ maxWidth: 600, margin: '30px auto' }}>
            <Link to="/acheteur">← Retour à mon espace</Link>
            <h1>Commande #{commande.id}</h1>
            <p>Statut : <strong>{commande.statut}</strong></p>

            <h3>Contenu</h3>
            {commande.ligne_commandes?.map((l) => (
                <p key={l.id}>{l.offre?.nom_produit} — {l.quantite} × {l.prix_unitaire} FCFA = {l.sous_total} FCFA</p>
            ))}
            <p><strong>Total : {total} FCFA</strong></p>

            {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

            {commande.statut === 'en_attente' && (
                <form onSubmit={handleValider}>
                    <h3>Valider la commande</h3>
                    <div>
                        <label>Adresse de livraison : </label>
                        <input value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
                    </div>
                    <div>
                        <label>Mode de livraison : </label>
                        <select value={modeLivraison} onChange={(e) => setModeLivraison(e.target.value)}>
                            <option value="livraison_domicile">Livraison à domicile</option>
                            <option value="retrait">Retrait sur place</option>
                        </select>
                    </div>
                    <button type="submit">Valider</button>
                </form>
            )}

            {commande.statut === 'en_attente_paiement' && (
                <div>
                    <h3>Effectuer le paiement</h3>
                    <select value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}>
                        <option value="wave">Wave</option>
                        <option value="orange_money">Orange Money</option>
                        <option value="carte_bancaire">Carte bancaire</option>
                    </select>
                    <button onClick={handlePayer}>Payer {total} FCFA</button>
                </div>
            )}

            {commande.statut === 'confirmee' && (
                <div>
                    <p style={{ color: 'green' }}>✓ Commande confirmée et payée.</p>
                    {commande.paiement && <p>Paiement via {commande.paiement.mode_paiement}</p>}

                    {!commande.evaluation && !evalEnvoyee ? (
                        <form onSubmit={handleEvaluer}>
                            <h3>Évaluer le producteur</h3>
                            <div>
                                <label>Note : </label>
                                <select value={noteEval} onChange={(e) => setNoteEval(e.target.value)}>
                                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} étoile(s)</option>)}
                                </select>
                            </div>
                            <div>
                                <label>Commentaire : </label>
                                <textarea value={commentaireEval} onChange={(e) => setCommentaireEval(e.target.value)} />
                            </div>
                            <button type="submit">Envoyer l'évaluation</button>
                        </form>
                    ) : (
                        <p style={{ color: 'green' }}>✓ Merci pour votre évaluation.</p>
                    )}
                </div>
            )}

            {commande.statut === 'annulee' && (
                <p style={{ color: 'red' }}>Commande annulée.</p>
            )}

            {peutAnnuler && (
                <button onClick={handleAnnuler} style={{ marginTop: 20, color: 'red' }}>
                    Annuler la commande
                </button>
            )}
        </div>
    );
}