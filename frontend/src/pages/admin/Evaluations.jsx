import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ConsulterEvaluations() {
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        api.get('/admin/evaluations').then((res) => setEvaluations(res.data));
    }, []);

    return (
        <div style={{ maxWidth: 700, margin: '30px auto' }}>
            <Link to="/admin">← Retour à mon espace</Link>
            <h1>Évaluations ({evaluations.length})</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {evaluations.map((e) => (
                    <li key={e.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8, borderRadius: 6 }}>
                        <p>{'⭐'.repeat(e.note)} — {e.producteur?.user?.name}</p>
                        {e.commentaire && <p style={{ fontStyle: 'italic' }}>"{e.commentaire}"</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
}