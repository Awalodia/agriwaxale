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
        <div style={{ maxWidth: 400, margin: '50px auto' }}>
            <h2>Se connecter</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
                <button type="submit">Se connecter</button>
            </form>
            <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
        </div>
    );
}