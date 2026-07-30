import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function DetailNegociation() {
    const { id } = useParams();
    const [negociation, setNegociation] = useState(null);
    const [prixContre, setPrixContre] = useState('');
    const [quantiteContre, setQuantiteContre] = useState('');
    const [messageContre, setMessageContre] = useState('');
    const [afficherContre, setAfficherContre] = useState(false);
    const [erreur, setErreur] = useState('');

    const charger = () => {
        api.get(`/negociations/${id}`).then((res) => setNegociation(res.data));
    };

    useEffect(() => { charger(); }, [id]);

    const repondre = async (action, extra = {}) => {
        setErreur('');
        try {
            await api.put(`/negociations/${id}`, { action, ...extra });
            charger();
            setAfficherContre(false);
        } catch (err) {
            setErreur("Action impossible pour le moment.");
        }
    };

    const handleContreProposition = (e) => {
        e.preventDefault();
        repondre('contre_proposer', {
            prix_propose: prixContre,
            quantite_proposee: quantiteContre,
            message: messageContre,
        });
    };

    if (!negociation) return <p>Chargement...</p>;

    const derniereProposition = negociation.propositions[negociation.propositions.length - 1];
    const enCours = negociation.statut === 'en_cours';

    return (
        <div style={{ maxWidth: 600, margin: '30px auto' }}>
            <Link to="/acheteur">← Retour à mon espace</Link>
            <h1>Négociation — {negociation.offre?.nom_produit}</h1>
            <p>Statut : <strong>{negociation.statut}</strong></p>

            <h3>Historique des propositions</h3>
            {negociation.propositions.map((p) => (
                <div key={p.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                    <p><strong>{p.prix_propose} FCFA</strong> pour {p.quantite_proposee} unité(s)</p>
                    {p.message && <p style={{ fontStyle: 'italic' }}>"{p.message}"</p>}
                    <p style={{ fontSize: 12, color: '#888' }}>{new Date(p.date_proposition).toLocaleString()}</p>
                </div>
            ))}

            {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

            {enCours && (
                <div style={{ marginTop: 20 }}>
                    <h3>Répondre à la dernière proposition</h3>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                        <button onClick={() => repondre('accepter')}>Accepter</button>
                        <button onClick={() => repondre('refuser')}>Refuser</button>
                        <button onClick={() => setAfficherContre(!afficherContre)}>Faire une contre-proposition</button>
                        <button onClick={() => repondre('annuler')} style={{ color: 'red' }}>Annuler la négociation</button>
                    </div>

                    {afficherContre && (
                        <form onSubmit={handleContreProposition}>
                            <div>
                                <label>Nouveau prix proposé : </label>
                                <input type="number" min="1" step="25" value={prixContre} onChange={(e) => setPrixContre(e.target.value)} required />                            </div>
                            <div>
                                <label>Quantité : </label>
                                <input type="number" value={quantiteContre} onChange={(e) => setQuantiteContre(e.target.value)} required />
                            </div>
                            <div>
                                <label>Message : </label>
                                <textarea value={messageContre} onChange={(e) => setMessageContre(e.target.value)} />
                            </div>
                            <button type="submit">Envoyer la contre-proposition</button>
                        </form>
                    )}
                </div>
            )}

            {negociation.statut === 'acceptee' && (
                <p style={{ color: 'green' }}>✓ Négociation acceptée — une commande a été créée automatiquement.</p>
            )}
        </div>
    );
}