import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function GererCategories() {
    const [categories, setCategories] = useState([]);
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [erreur, setErreur] = useState('');

    const charger = () => { api.get('/categories').then((res) => setCategories(res.data)); };
    useEffect(() => { charger(); }, []);

    const handleAjouter = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            await api.post('/admin/categories', { nom, description });
            setNom(''); setDescription('');
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
            alert("Impossible de supprimer : des offres utilisent cette catégorie.");
        }
    };

    return (
        <DashboardLayout title="Gérer les catégories">
            <div className="table-card">
                <form onSubmit={handleAjouter} className="row g-3 align-items-end mb-4">
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Nom</label>
                        <input className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label fw-semibold">Description</label>
                        <input className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-agri w-100">Ajouter</button>
                    </div>
                    {erreur && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{erreur}</div></div>}
                </form>

                <table className="table align-middle">
                    <thead><tr><th>Nom</th><th>Description</th><th></th></tr></thead>
                    <tbody>
                    {categories.map((c) => (
                        <tr key={c.id}>
                            <td className="fw-bold">{c.nom}</td>
                            <td>{c.description}</td>
                            <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleSupprimer(c.id)}>Supprimer</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}