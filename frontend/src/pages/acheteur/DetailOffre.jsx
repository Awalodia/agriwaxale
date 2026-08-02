import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function DetailOffre() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offre, setOffre] = useState(null);
    const [mode, setMode] = useState(null);
    const [quantite, setQuantite] = useState(1);
    const [prixPropose, setPrixPropose] = useState('');
    const [message, setMessage] = useState('');
    const [erreur, setErreur] = useState('');
    const [ajoute, setAjoute] = useState(false);

    useEffect(() => { api.get(`/offres/${id}`).then((res) => setOffre(res.data)); }, [id]);

    const handleNegocier = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            const res = await api.post('/negociations', { offre_id: id, prix_propose: prixPropose, quantite_proposee: quantite, message });
            navigate(`/acheteur/negociations/${res.data.id}`);
        } catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de l'envoi de la proposition.");
        }
    };

    const handleAjouterPanier = async () => {
        setErreur('');
        try {
            await api.post('/commandes', { offre_id: id, quantite });
            setAjoute(true);
        } catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de l'ajout au panier.");
        }
    };

    if (!offre) return <div className="container py-5"><p>Chargement...</p></div>;

    const photoUrl = offre.photo ? `http://localhost:8000/storage/${offre.photo}` : 'https://placehold.co/600x400/eaf7ef/157347?text=AgriWaxal%C3%A9';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--light)' }}>
            <div className="container py-5" style={{ maxWidth: 650 }}>
                <Link to="/acheteur" className="btn btn-outline-agri mb-4">← Retour à mon espace</Link>

                <div className="bg-white p-4 rounded-4 shadow-sm">
                    <img src={photoUrl} alt={offre.nom_produit} className="w-100 rounded-4 mb-3" style={{ height: 280, objectFit: 'cover' }} />

                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h2 className="fw-bold">{offre.nom_produit}</h2>
                            <span className="category-badge">{offre.categorie?.nom}</span>
                        </div>
                        <div className="offer-price">{offre.prix_initial} <small>FCFA / {offre.unite}</small></div>
                    </div>

                    <div className="d-flex justify-content-between border-top border-bottom py-3 my-3">
                        <span className="text-secondary">Disponible</span>
                        <strong>{offre.quantite} {offre.unite}</strong>
                    </div>

                    <p className="text-secondary mb-4"><i className="bi bi-person-badge me-1"></i> {offre.producteur?.user?.name} — {offre.producteur?.zone_production}</p>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Quantité souhaitée ({offre.unite})</label>
                        <input type="number" min="1" max={offre.quantite} step="1" className="form-control" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
                    </div>

                    {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

                    {ajoute && (
                        <div className="alert alert-success d-flex justify-content-between align-items-center">
                            <span>✓ Ajouté au panier.</span>
                            <Link to="/acheteur/panier" className="btn btn-sm btn-agri">Voir mon panier</Link>
                        </div>
                    )}

                    {!mode && (
                        <div className="row g-2">
                            <div className="col-6"><button className="btn btn-outline-agri w-100 py-2" onClick={handleAjouterPanier}><i className="bi bi-cart-plus me-1"></i> Ajouter au panier</button></div>
                            <div className="col-6"><button className="btn btn-agri w-100 py-2" onClick={() => setMode('negocier')}><i className="bi bi-chat-dots me-1"></i> Négocier</button></div>
                        </div>
                    )}

                    {mode === 'negocier' && (
                        <form onSubmit={handleNegocier} className="mt-3 pt-3 border-top">
                            <h5 className="fw-bold mb-3">Proposer un prix</h5>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Prix proposé (FCFA, minimum 50)</label>
                                <input type="number" min="50" step="1" className="form-control" value={prixPropose} onChange={(e) => setPrixPropose(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Message (optionnel)</label>
                                <textarea className="form-control" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-agri flex-grow-1">Envoyer la proposition</button>
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setMode(null)}>Annuler</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}