import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function PublierOffre() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ categorie_id: '', nom_produit: '', quantite: '', unite: 'kg', prix_initial: '', zone_production: '' });
    const [photo, setPhoto] = useState(null);
    const [erreur, setErreur] = useState('');
    const navigate = useNavigate();

    useEffect(() => { api.get('/categories').then((res) => setCategories(res.data)); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => data.append(k, v));
            if (photo) data.append('photo', photo);
            await api.post('/offres', data); // pas de Content-Type manuel : axios gère le boundary
            navigate('/producteur');
        } catch (err) {
            setErreur(err.response?.data?.message || 'Erreur lors de la publication. Vérifiez les champs.');
        }
    };

    return (
        <DashboardLayout title="Publier une offre">
            <div className="table-card" style={{ maxWidth: 520 }}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Nom du produit</label>
                        <input className="form-control" name="nom_produit" value={form.nom_produit} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Catégorie</label>
                        <select className="form-select" name="categorie_id" value={form.categorie_id} onChange={handleChange} required>
                            <option value="">-- Choisir --</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                    </div>
                    <div className="row g-2 mb-3">
                        <div className="col-8">
                            <label className="form-label fw-semibold">Quantité disponible</label>
                            <input type="number" min="1" step="1" className="form-control" name="quantite" value={form.quantite} onChange={handleChange} required />
                        </div>
                        <div className="col-4">
                            <label className="form-label fw-semibold">Unité</label>
                            <select className="form-select" name="unite" value={form.unite} onChange={handleChange}>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="sac">sac</option>
                                <option value="tonne">tonne</option>
                                <option value="caisse">caisse</option>
                                <option value="unite">unité</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Prix initial (FCFA, minimum 50)</label>
                        <input type="number" min="50" step="1" className="form-control" name="prix_initial" value={form.prix_initial} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Zone de production</label>
                        <input className="form-control" name="zone_production" value={form.zone_production} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Photo</label>
                        <input type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
                    </div>
                    {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
                    <button type="submit" className="btn btn-agri w-100">Publier</button>
                </form>
            </div>
        </DashboardLayout>
    );
}