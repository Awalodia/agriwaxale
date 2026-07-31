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

    if (offres.length === 0) return <p>Chargement...</p>;

    const producteur = offres[0].producteur;

    return (
        <div style={{ maxWidth: 700, margin: '30px auto' }}>
            <Link to="/">← Retour au catalogue</Link>
            <h1>{producteur.user?.name}</h1>
            <p>Zone de production : {producteur.zone_production}</p>

            <h3>Offres de ce producteur</h3>
            {offres.map((o) => (
                <div key={o.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                    <Link to={`/offres/${o.id}`}>{o.nom_produit} — {o.prix_initial} FCFA</Link>
                </div>
            ))}
        </div>
    );
}