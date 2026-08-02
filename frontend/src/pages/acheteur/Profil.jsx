import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function ProfilAcheteur() {
    const [donnees, setDonnees] = useState(null);
    const [edition, setEdition] = useState(false);
    const [nom, setNom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [localisation, setLocalisation] = useState('');
    const [adresseLivraison, setAdresseLivraison] = useState('');
    const [messageOk, setMessageOk] = useState(false);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        api.get('/profile').then((res) => {
            setDonnees(res.data);
            setNom(res.data.name);
            setTelephone(res.data.telephone || '');
            setLocalisation(res.data.localisation || '');
            setAdresseLivraison(res.data.acheteur?.adresse_livraison || '');
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur(''); setMessageOk(false);
        try {
            const res = await api.put('/profile', { name: nom, telephone, localisation, adresse_livraison: adresseLivraison });
            setDonnees(res.data);
            setMessageOk(true);
            setEdition(false);
        } catch (err) { setErreur('Erreur lors de la mise à jour.'); }
    };

    if (!donnees) return <DashboardLayout title="Mon profil"><p>Chargement...</p></DashboardLayout>;

    return (
        <DashboardLayout title="Mon profil">
            <div className="table-card" style={{ maxWidth: 500 }}>
                {messageOk && <div className="alert alert-success py-2">Profil mis à jour.</div>}

                {!edition ? (
                    <div>
                        <p><strong>Nom :</strong> {donnees.name}</p>
                        <p><strong>Email :</strong> {donnees.email}</p>
                        <p><strong>Téléphone :</strong> {donnees.telephone || '—'}</p>
                        <p><strong>Localisation :</strong> {donnees.localisation || '—'}</p>
                        <p><strong>Adresse de livraison habituelle :</strong> {donnees.acheteur?.adresse_livraison || '—'}</p>
                        <button className="btn btn-agri" onClick={() => setEdition(true)}>Modifier</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Nom</label>
                            <input className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Téléphone</label>
                            <input className="form-control" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Localisation</label>
                            <input className="form-control" value={localisation} onChange={(e) => setLocalisation(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Adresse de livraison habituelle</label>
                            <input className="form-control" value={adresseLivraison} onChange={(e) => setAdresseLivraison(e.target.value)} />
                        </div>
                        {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
                        <button type="submit" className="btn btn-agri me-2">Enregistrer</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setEdition(false)}>Annuler</button>
                    </form>
                )}
            </div>
        </DashboardLayout>
    );
}