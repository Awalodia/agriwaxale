import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DetailOffrePublic() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role } = useAuth();
    const [offre, setOffre] = useState(null);

    useEffect(() => { api.get(`/offres/${id}`).then((res) => setOffre(res.data)); }, [id]);

    const handleAction = () => {
        if (role === 'acheteur') navigate(`/acheteur/offres/${id}`);
        else navigate('/login');
    };

    if (!offre) return <div className="container py-5"><p>Chargement...</p></div>;

    const photoUrl = offre.photo ? `http://localhost:8000/storage/${offre.photo}` : 'https://placehold.co/600x400/eaf7ef/157347?text=AgriWaxal%C3%A9';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--light)' }}>
            <nav className="navbar main-navbar py-3">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                        <span className="logo"><i className="bi bi-flower1"></i></span>
                        AgriWaxalé
                    </Link>
                </div>
            </nav>

            <div className="container py-5" style={{ maxWidth: 650 }}>
                <Link to="/" className="btn btn-outline-agri mb-4">← Retour au catalogue</Link>

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

                    <div className="product-summary mb-4">
                        <h5 className="fw-bold mb-2">Producteur</h5>
                        <p className="mb-1">{offre.producteur?.user?.name}</p>
                        <p className="text-secondary mb-2">Zone de production : {offre.producteur?.zone_production}</p>
                        <Link to={`/producteurs/${offre.producteur?.id}`} style={{ color: 'var(--green)' }}>Voir le profil complet</Link>
                    </div>

                    {!role && <p className="text-secondary mb-3"><i className="bi bi-info-circle me-1"></i> Connectez-vous en tant qu'acheteur pour négocier ou acheter ce produit.</p>}
                    <button className="btn btn-agri w-100 py-2" onClick={handleAction}>
                        {role === 'acheteur' ? 'Négocier / Acheter' : 'Se connecter pour négocier'}
                    </button>
                </div>
            </div>
        </div>
    );
}