import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function RepondreNegociation() {
    const { id } = useParams();
    const [negociation, setNegociation] = useState(null);
    const [prixContre, setPrixContre] = useState('');
    const [quantiteContre, setQuantiteContre] = useState('');
    const [messageContre, setMessageContre] = useState('');
    const [messageReponse, setMessageReponse] = useState('');
    const [afficherContre, setAfficherContre] = useState(false);
    const [erreur, setErreur] = useState('');

    const charger = () => { api.get(`/negociations/${id}`).then((res) => setNegociation(res.data)); };
    useEffect(() => { charger(); }, [id]);

    const repondre = async (action, extra = {}) => {
        setErreur('');
        try {
            await api.put(`/negociations/${id}`, { action, ...extra });
            charger();
            setAfficherContre(false);
            setMessageReponse('');
        } catch (err) {
            setErreur(err.response?.data?.message || 'Action impossible pour le moment.');
        }
    };

    const handleContreProposition = (e) => {
        e.preventDefault();
        repondre('contre_proposer', { prix_propose: prixContre, quantite_proposee: quantiteContre, message: messageContre });
    };

    if (!negociation) return <DashboardLayout title="Négociation"><p>Chargement...</p></DashboardLayout>;

    const enCours = negociation.statut === 'en_cours';
    const badge = negociation.statut === 'acceptee' ? 'text-bg-success' : ['refusee', 'annulee'].includes(negociation.statut) ? 'text-bg-danger' : 'text-bg-secondary';

    return (
        <DashboardLayout title={`Négociation — ${negociation.offre?.nom_produit}`} subtitle={`Acheteur : ${negociation.acheteur?.user?.name}`}>
            <div className="table-card" style={{ maxWidth: 600 }}>
                <span className={`badge ${badge} fs-6 mb-3`}>{negociation.statut}</span>

                <h5 className="fw-bold mt-3 mb-3">Historique des propositions</h5>
                {negociation.propositions.map((p) => (
                    <div key={p.id} className="product-summary mb-2">
                        <div className="d-flex justify-content-between">
                            <strong>{p.prix_propose} FCFA</strong>
                            <span className="text-secondary">{p.quantite_proposee} unité(s)</span>
                        </div>
                        {p.message && <p className="fst-italic small mb-1 mt-1">"{p.message}"</p>}
                        <small className="text-secondary">{new Date(p.date_proposition).toLocaleString()}</small>
                    </div>
                ))}

                {erreur && <div className="alert alert-danger py-2 mt-3">{erreur}</div>}

                {enCours && (
                    <div className="mt-4 pt-3 border-top">
                        <div className="mb-2">
                            <input className="form-control" placeholder="Message (optionnel) pour accepter/refuser" value={messageReponse} onChange={(e) => setMessageReponse(e.target.value)} />
                        </div>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            <button className="btn btn-success" onClick={() => repondre('accepter', { message: messageReponse })}>Accepter</button>
                            <button className="btn btn-outline-danger" onClick={() => repondre('refuser', { message: messageReponse })}>Refuser</button>
                            <button className="btn btn-warning" onClick={() => {
                                if (!afficherContre) {
                                    const derniere = negociation.propositions[negociation.propositions.length - 1];
                                    setPrixContre(derniere.prix_propose);
                                    setQuantiteContre(derniere.quantite_proposee);
                                }
                                setAfficherContre(!afficherContre);
                            }}>Répondre / Contre-proposition</button>
                            <button className="btn btn-outline-secondary" onClick={() => repondre('annuler')}>Annuler</button>
                        </div>

                        {afficherContre && (
                            <form onSubmit={handleContreProposition} className="product-summary">
                                <div className="mb-2">
                                    <label className="form-label fw-semibold">Prix proposé</label>
                                    <input type="number" min="50" step="1" className="form-control" value={prixContre} onChange={(e) => setPrixContre(e.target.value)} required />                                </div>
                                <div className="mb-2">
                                    <label className="form-label fw-semibold">Quantité</label>
                                    <input type="number" min="1" step="1" className="form-control" value={quantiteContre} onChange={(e) => setQuantiteContre(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Message</label>
                                    <textarea className="form-control" value={messageContre} onChange={(e) => setMessageContre(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-agri w-100">Envoyer</button>
                            </form>
                        )}
                    </div>
                )}

                {negociation.statut === 'acceptee' && (
                    <div className="alert alert-success mt-3 mb-0">✓ Négociation acceptée — une commande a été créée.</div>
                )}
            </div>
        </DashboardLayout>
    );
}