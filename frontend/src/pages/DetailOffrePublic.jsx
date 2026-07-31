import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DetailOffrePublic() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role } = useAuth();
    const [offre, setOffre] = useState(null);

    useEffect(() => {
        api.get(`/offres/${id}`).then((res) => setOffre(res.data));
    }, [id]);

    const handleAction = () => {
        if (role === 'acheteur') {
            navigate(`/acheteur/offres/${id}`);
        } else {
            navigate('/login');
        }
    };

    if (!offre) return <p>Chargement...</p>;

    return (
        <div style={{ maxWidth: 600, margin: '30px auto' }}>
            <Link to="/">← Retour au catalogue</Link>
            <h1>{offre.nom_produit}</h1>
            <p><strong>{offre.prix_initial} FCFA</strong> — {offre.quantite} disponible(s)</p>
            <p>Catégorie : {offre.categorie?.nom}</p>
            <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, margin: '16px 0' }}>
                <h3>Producteur</h3>
                <p><Link to={`/producteurs/${offre.producteur?.id}`}>Voir le profil complet</Link></p>
                <p>{offre.producteur?.user?.name}</p>
                <p>Zone de production : {offre.producteur?.zone_production}</p>
            </div>

            {!role && (
                <p style={{ color: '#888' }}>Connectez-vous en tant qu'acheteur pour négocier ou acheter ce produit.</p>
            )}
            <button onClick={handleAction}>
                {role === 'acheteur' ? 'Négocier / Acheter' : 'Se connecter pour négocier'}
            </button>
        </div>
    );
}