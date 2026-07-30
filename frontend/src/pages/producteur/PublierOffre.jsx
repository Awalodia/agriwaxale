import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function PublierOffre() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        categorie_id: '', nom_produit: '', quantite: '', prix_initial: '', zone_production: '',
    });
    const [erreur, setErreur] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            await api.post('/offres', form);
            navigate('/producteur');
        } catch (err) {
            setErreur("Erreur lors de la publication. Vérifiez les champs.");
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: '30px auto' }}>
            <Link to="/producteur">← Retour à mon espace</Link>
            <h1>Publier une offre</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom du produit : </label>
                    <input name="nom_produit" value={form.nom_produit} onChange={handleChange} required />
                </div>
                <div>
                    <label>Catégorie : </label>
                    <select name="categorie_id" value={form.categorie_id} onChange={handleChange} required>
                        <option value="">-- Choisir --</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                </div>
                <div>
                    <label>Quantité disponible : </label>
                    <input type="number" min="1" step="1" name="quantite" value={form.quantite} onChange={handleChange} required />
                </div>
                <div>
                    <label>Prix initial (FCFA) : </label>
                    <input type="number" min="1" step="1" name="prix_initial" value={form.prix_initial} onChange={handleChange} required />
                </div>
                <div>
                    <label>Zone de production : </label>
                    <input name="zone_production" value={form.zone_production} onChange={handleChange} />
                </div>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
                <button type="submit">Publier</button>
            </form>
        </div>
    );
}