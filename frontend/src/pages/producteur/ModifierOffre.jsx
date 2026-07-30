import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ModifierOffre() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nom_produit: '', quantite: '', prix_initial: '', statut: 'disponible',
    });
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        api.get(`/offres/${id}`).then((res) => {
            const o = res.data;
            setForm({
                nom_produit: o.nom_produit,
                quantite: o.quantite,
                prix_initial: o.prix_initial,
                statut: o.statut,
            });
            setChargement(false);
        });
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            await api.put(`/offres/${id}`, form);
            navigate('/producteur');
        } catch (err) {
            setErreur("Erreur lors de la modification. Cette offre vous appartient-elle bien ?");
        }
    };

    if (chargement) return <p>Chargement...</p>;

    return (
        <div style={{ maxWidth: 500, margin: '30px auto' }}>
            <Link to="/producteur">← Retour à mon espace</Link>
            <h1>Modifier l'offre</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom du produit : </label>
                    <input name="nom_produit" value={form.nom_produit} onChange={handleChange} required />
                </div>
                <div>
                    <label>Quantité disponible : </label>
                    <input type="number" min="0" step="1" name="quantite" value={form.quantite} onChange={handleChange} required />
                </div>
                <div>
                    <label>Prix initial (FCFA) : </label>
                    <input type="number" min="1" step="1" name="prix_initial" value={form.prix_initial} onChange={handleChange} required />
                </div>
                <div>
                    <label>Statut : </label>
                    <select name="statut" value={form.statut} onChange={handleChange}>
                        <option value="disponible">Disponible</option>
                        <option value="indisponible">Indisponible</option>
                    </select>
                </div>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
                <button type="submit">Enregistrer les modifications</button>
            </form>
        </div>
    );
}