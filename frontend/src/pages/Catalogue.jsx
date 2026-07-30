import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Catalogue() {
    const [offres, setOffres] = useState([]);
    const [recherche, setRecherche] = useState('');
    const [chargement, setChargement] = useState(true);
    const { role, logout } = useAuth();

    useEffect(() => {
        chargerOffres();
    }, []);

    const chargerOffres = async (params = {}) => {
        setChargement(true);
        try {
            const res = await api.get('/offres', { params });
            setOffres(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setChargement(false);
        }
    };

    const handleRecherche = (e) => {
        e.preventDefault();
        chargerOffres({ recherche });
    };

    const lienEspace = role === 'acheteur' ? '/acheteur'
        : role === 'producteur' ? '/producteur'
            : role === 'administrateur' ? '/admin'
                : null;

    return (
        <div style={{ maxWidth: 900, margin: '30px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>AgriWaxalé — Catalogue</h1>
                <div>
                    {role ? (
                        <>
                            <Link to={lienEspace} style={{ marginRight: 10 }}>Mon espace</Link>
                            <button onClick={logout}>Se déconnecter</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ marginRight: 10 }}>Se connecter</Link>
                            <Link to="/register">S'inscrire</Link>
                        </>
                    )}
                </div>
            </div>

            <form onSubmit={handleRecherche} style={{ margin: '20px 0' }}>
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
                <button type="submit">Rechercher</button>
            </form>

            {chargement ? (
                <p>Chargement du catalogue...</p>
            ) : offres.length === 0 ? (
                <p>Aucune offre disponible pour le moment.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                    {offres.map((offre) => (
                        <div key={offre.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12 }}>
                            <h3>{offre.nom_produit}</h3>
                            <p>{offre.prix_initial} FCFA — {offre.quantite} disponible(s)</p>
                            <p style={{ fontSize: 13, color: '#666' }}>
                                {offre.categorie?.nom} · {offre.producteur?.user?.name}
                            </p>
                            {role === 'acheteur' && (
                                <Link to={`/acheteur/offres/${offre.id}`}>Voir / Négocier</Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}