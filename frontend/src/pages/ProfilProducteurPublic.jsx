import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ProfilProducteurPublic() {
    const { id } = useParams();
    const [offres, setOffres] = useState([]);

    useEffect(() => {
        api.get('/offres').then((res) => {
            setOffres(res.data.filter((o) => o.producteur?.id === parseInt(id)));
        });
    }, [id]);

    const initiales = (nom) => nom ? nom.split(' ').map((p) => p[0]).join('').substring(0, 2).toUpperCase() : '';

    if (offres.length === 0) return <div className="container py-5"><p>Chargement...</p></div>;

    const producteur = offres[0].producteur;

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

            <div className="container py-5" style={{ maxWidth: 700 }}>
                <Link to="/" className="btn btn-outline-agri mb-4">← Retour au catalogue</Link>

                <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
                    <div className="d-flex align-items-center gap-3">
            <span style={{ width: 60, height: 60, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'var(--green)', borderRadius: '50%', fontWeight: 800, fontSize: '1.3rem' }}>
              {initiales(producteur.user?.name)}
            </span>
                        <div>
                            <h2 className="fw-bold mb-0">{producteur.user?.name}</h2>
                            <p className="text-secondary mb-0"><i className="bi bi-geo-alt me-1"></i>{producteur.zone_production}</p>
                        </div>
                    </div>
                </div>

                <h5 className="fw-bold mb-3">Offres de ce producteur ({offres.length})</h5>
                <div className="row g-3">
                    {offres.map((o) => (
                        <div key={o.id} className="col-md-6">
                            <Link to={`/offres/${o.id}`} className="offer-card d-block text-decoration-none text-dark p-3">
                                <div className="d-flex justify-content-between">
                                    <strong>{o.nom_produit}</strong>
                                    <span style={{ color: 'var(--green)', fontWeight: 700 }}>{o.prix_initial} F</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}