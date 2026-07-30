import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedRole = localStorage.getItem('role');
        if (token && savedRole) {
            setRole(savedRole);
            api.get('/profile')
                .then((res) => setUser(res.data))
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        setUser(res.data.user);
        setRole(res.data.role);
        return res.data.role;
    };

    const register = async (data) => {
        const res = await api.post('/register', data);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        setUser(res.data.user);
        setRole(res.data.role);
        return res.data.role;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            // on déconnecte quand même localement même si l'appel échoue
        }
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}