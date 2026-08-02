import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function DetailCommande() {
    const { id } = useParams();
    const [commande, setCommande] = useState(null);
    const [modePaiement, setModePaiement] = useState('wave');
    const [erreur, setErreur] = useState('');
    const [noteEval, setNoteEval] = useState(5);
    const [commentaireEval, setCommentaireEval] = useState('');
    const [evalEnvoyee, setEvalEnvoyee] = useState(false);

    const charger = () => { api.get(`/commandes/${id}`).then((res) => setCommande(res.data)); };
    useEffect(() => { charger(); }, [id]);

    const handlePayer = async () => {
        setErreur('');
        try {
            await api.post('/paiements', { commande_id: id, mode_paiement: modePaiement });
            charger();
        } catch (err) { setErreur('Erreur lors du paiement.'); }
    };

    const handleAnnuler = async () => {
        setErreur('');
        try {
            await api.put(`/commandes/${id}`, { action: 'annuler' });
            charger();
        } catch (err) { setErreur('Cette commande ne peut plus être annulée.'); }
    };

    const handleEvaluer = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            await api.post('/evaluations', { commande_id: id, note: noteEval, commentaire: commentaireEval });
            setEvalEnvoyee(true);
        } catch (err) { setErreur("Erreur lors de l'évaluation."); }
    };

    if (!commande) return <div className="container py-5"><p>Chargement...</p></div>;

    const peutAnnuler = !['confirmee', 'livree', 'annulee'].includes(commande.statut);
    const total = commande.ligne_commandes?.reduce((sum, l) => sum + l.sous_total, 0) || 0;
    const badge = ['confirmee', 'livree'].includes(commande.statut) ? 'text-bg-success' : commande.statut === 'annulee' ? 'text-bg-danger' : 'text-bg-secondary';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--light)' }}>
            <div className="container py-5" style={{ maxWidth: 650 }}>
                <Link to="/acheteur" className="btn btn-outline-agri mb-4">← Retour à mon espace</Link>

                <div className="bg-white p-4 rounded-4 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="fw-bold mb-0">Commande #{commande.id}</h2>
                        <span className={`badge ${badge} fs-6`}>{commande.statut}</span>
                    </div>

                    <div className="product-summary mb-3">
                        {commande.ligne_commandes?.map((l) => (
                            <p key={l.id} className="mb-1">{l.offre?.nom_produit} — {l.quantite} × {l.prix_unitaire} FCFA = <strong>{l.sous_total} FCFA</strong></p>
                        ))}
                        <p className="fw-bold text-success mb-0 mt-2 pt-2 border-top">Total : {total} FCFA</p>
                    </div>

                    {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

                    {commande.statut === 'en_attente_paiement' && (
                        <div className="pt-3 border-top">
                            <h5 className="fw-bold mb-3">Effectuer le paiement</h5>
                            <select className="form-select mb-3" value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}>
                                <option value="wave">Wave</option>
                                <option value="orange_money">Orange Money</option>
                                <option value="carte_bancaire">Carte bancaire</option>
                            </select>
                            <button className="btn btn-agri w-100" onClick={handlePayer}>Payer {total} FCFA</button>
                        </div>
                    )}

                    {commande.statut === 'confirmee' && (
                        <div className="alert alert-success mt-3 mb-0"><i className="bi bi-check-circle-fill me-2"></i> Commande payée, en attente de livraison par le producteur.</div>
                    )}

                    {commande.statut === 'livree' && (
                        <div className="pt-3 border-top mt-3">
                            <div className="alert alert-success">✓ Commande livrée.</div>
                            {!commande.evaluation && !evalEnvoyee ? (
                                <form onSubmit={handleEvaluer}>
                                    <h5 className="fw-bold mb-3">Évaluer le producteur</h5>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Note</label>
                                        <select className="form-select" value={noteEval} onChange={(e) => setNoteEval(e.target.value)}>
                                            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} étoile(s)</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Commentaire</label>
                                        <textarea className="form-control" value={commentaireEval} onChange={(e) => setCommentaireEval(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-agri w-100">Envoyer l'évaluation</button>
                                </form>
                            ) : (
                                <div className="alert alert-success mb-0">✓ Merci pour votre évaluation.</div>
                            )}
                        </div>
                    )}

                    {commande.statut === 'annulee' && <div className="alert alert-danger mt-3 mb-0">Commande annulée.</div>}

                    {peutAnnuler && <button className="btn btn-outline-danger w-100 mt-3" onClick={handleAnnuler}>Annuler la commande</button>}
                </div>
            </div>
        </div>
    );
}