import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'acheteur', localisation: '',
    });
    const [erreur, setErreur] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            const role = await register(form);
            if (role === 'acheteur') navigate('/acheteur');
            else navigate('/producteur');
        } catch (err) {
            setErreur("Erreur lors de l'inscription. Vérifiez vos informations.");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', backgroundColor: 'var(--light)' }}>
            <div className="bg-white p-4 rounded-4 shadow-sm" style={{ maxWidth: 460, width: '100%' }}>
                <div className="text-center mb-4">
                    <span className="logo mb-2" style={{ display: 'inline-flex' }}><i className="bi bi-flower1"></i></span>
                    <h3 className="fw-bold mt-2">Créer un compte</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Nom</label>
                        <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Adresse électronique</label>
                        <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mot de passe</label>
                        <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Je suis un(e)</label>
                        <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                            <option value="acheteur">Acheteur</option>
                            <option value="producteur">Producteur</option>
                        </select>
                    </div>
                    {form.role === 'producteur' && (
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Zone de production</label>
                            <input name="localisation" className="form-control" value={form.localisation} onChange={handleChange} />
                        </div>
                    )}
                    {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
                    <button type="submit" className="btn btn-agri w-100 py-2 fw-bold">S'inscrire</button>
                </form>
                <p className="text-center mt-3 mb-0">
                    Déjà un compte ? <Link to="/login" style={{ color: 'var(--green)' }}>Se connecter</Link>
                </p>
            </div>
        </div>
    );
}