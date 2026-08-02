import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function ModifierOffre() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ nom_produit: '', quantite: '', unite: 'kg', prix_initial: '', statut: 'disponible' });
    const [photo, setPhoto] = useState(null);
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        api.get(`/offres/${id}`).then((res) => {
            const o = res.data;
            setForm({ nom_produit: o.nom_produit, quantite: o.quantite, unite: o.unite || 'kg', prix_initial: o.prix_initial, statut: o.statut });
            setChargement(false);
        });
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => data.append(k, v));
            if (photo) data.append('photo', photo);
            data.append('_method', 'PUT');
            await api.post(`/offres/${id}`, data); // pas de Content-Type manuel
            navigate('/producteur');
        } catch (err) {
            setErreur(err.response?.data?.message || 'Erreur lors de la modification.');
        }
    };

    if (chargement) return <DashboardLayout title="Modifier l'offre"><p>Chargement...</p></DashboardLayout>;

    return (
        <DashboardLayout title="Modifier l'offre">
            <div className="table-card" style={{ maxWidth: 520 }}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Nom du produit</label>
                        <input className="form-control" name="nom_produit" value={form.nom_produit} onChange={handleChange} required />
                    </div>
                    <div className="row g-2 mb-3">
                        <div className="col-8">
                            <label className="form-label fw-semibold">Quantité disponible</label>
                            <input type="number" min="0" step="1" className="form-control" name="quantite" value={form.quantite} onChange={handleChange} required />
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
                        <label className="form-label fw-semibold">Nouvelle photo (optionnel)</label>
                        <input type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Statut</label>
                        <select className="form-select" name="statut" value={form.statut} onChange={handleChange}>
                            <option value="disponible">Disponible</option>
                            <option value="indisponible">Indisponible</option>
                        </select>
                    </div>
                    {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
                    <button type="submit" className="btn btn-agri w-100">Enregistrer les modifications</button>
                </form>
            </div>
        </DashboardLayout>
    );
}