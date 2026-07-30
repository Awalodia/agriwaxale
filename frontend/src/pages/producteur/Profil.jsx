import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ProfilProducteur() {
    const [nom, setNom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [zoneProduction, setZoneProduction] = useState('');
    const [statutCompte, setStatutCompte] = useState(false);
    const [messageOk, setMessageOk] = useState(false);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        api.get('/profile').then((res) => {
            setNom(res.data.name);
            setTelephone(res.data.telephone || '');
            setZoneProduction(res.data.producteur?.zone_production || '');
            setStatutCompte(res.data.producteur?.statut_compte || false);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        setMessageOk(false);
        try {
            await api.put('/profile', { name: nom, telephone, zone_production: zoneProduction });
            setMessageOk(true);
        } catch (err) {
            setErreur('Erreur lors de la mise à jour.');
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: '30px auto' }}>
            <Link to="/producteur">← Retour à mon espace</Link>
            <h1>Mon profil</h1>

            <p>
                Statut du compte :{' '}
                {statutCompte
                    ? <span style={{ color: 'green' }}>✓ Vérifié</span>
                    : <span style={{ color: 'orange' }}>En attente de vérification par l'administrateur</span>}
            </p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom : </label>
                    <input value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div>
                    <label>Téléphone : </label>
                    <input value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                </div>
                <div>
                    <label>Zone de production : </label>
                    <input value={zoneProduction} onChange={(e) => setZoneProduction(e.target.value)} />
                </div>
                {messageOk && <p style={{ color: 'green' }}>Profil mis à jour.</p>}
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
                <button type="submit">Enregistrer</button>
            </form>
        </div>
    );
}