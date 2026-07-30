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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
        <div style={{ maxWidth: 400, margin: '50px auto' }}>
            <h2>Créer un compte</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom</label>
                    <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Je suis un(e)</label>
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="acheteur">Acheteur</option>
                        <option value="producteur">Producteur</option>
                    </select>
                </div>
                {form.role === 'producteur' && (
                    <div>
                        <label>Zone de production</label>
                        <input name="localisation" value={form.localisation} onChange={handleChange} />
                    </div>
                )}
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
                <button type="submit">S'inscrire</button>
            </form>
            <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
        </div>
    );
}