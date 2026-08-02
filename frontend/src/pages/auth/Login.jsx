import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erreur, setErreur] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            const role = await login(email, password);
            if (role === 'acheteur') navigate('/acheteur');
            else if (role === 'producteur') navigate('/producteur');
            else if (role === 'administrateur') navigate('/admin');
        } catch (err) {
            setErreur('Email ou mot de passe incorrect.');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: 'var(--light)' }}>
            <div className="bg-white p-4 rounded-4 shadow-sm" style={{ maxWidth: 420, width: '100%' }}>
                <div className="text-center mb-4">
                    <span className="logo mb-2" style={{ display: 'inline-flex' }}><i className="bi bi-flower1"></i></span>
                    <h3 className="fw-bold mt-2">Se connecter</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Adresse électronique</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mot de passe</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
                    <button type="submit" className="btn btn-agri w-100 py-2 fw-bold">Se connecter</button>
                </form>
                <p className="text-center mt-3 mb-0">
                    Pas encore de compte ? <Link to="/register" style={{ color: 'var(--green)' }}>S'inscrire</Link>
                </p>
            </div>
        </div>
    );
}