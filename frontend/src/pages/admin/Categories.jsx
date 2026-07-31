import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function GererCategories() {
    const [categories, setCategories] = useState([]);
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [erreur, setErreur] = useState('');

    const charger = () => {
        api.get('/categories').then((res) => setCategories(res.data));
    };

    useEffect(() => { charger(); }, []);

    const handleAjouter = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            await api.post('/admin/categories', { nom, description });
            setNom('');
            setDescription('');
            charger();
        } catch (err) {
            setErreur("Erreur lors de l'ajout.");
        }
    };

    const handleSupprimer = async (id) => {
        if (!confirm('Supprimer cette catégorie ?')) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            charger();
        } catch (err) {
            alert("Impossible de supprimer : des offres utilisent peut-être encore cette catégorie.");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '30px auto' }}>
            <Link to="/admin">← Retour à mon espace</Link>
            <h1>Gérer les catégories</h1>

            <form onSubmit={handleAjouter} style={{ marginBottom: 20 }}>
                <div>
                    <label>Nom : </label>
                    <input value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div>
                    <label>Description : </label>
                    <input value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
                <button type="submit">Ajouter</button>
            </form>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {categories.map((c) => (
                    <li key={c.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>{c.nom}</strong> — {c.description}</span>
                        <button onClick={() => handleSupprimer(c.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}