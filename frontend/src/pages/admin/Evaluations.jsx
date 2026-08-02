import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

export default function ConsulterEvaluations() {
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        api.get('/admin/evaluations').then((res) => setEvaluations(res.data));
    }, []);

    return (
        <DashboardLayout title={`Évaluations (${evaluations.length})`}>
            <div className="table-card">
                {evaluations.length === 0 ? <p className="text-secondary">Aucune évaluation.</p> : (
                    <table className="table align-middle">
                        <thead><tr><th>Producteur</th><th>Note</th><th>Commentaire</th></tr></thead>
                        <tbody>
                        {evaluations.map((e) => (
                            <tr key={e.id}>
                                <td>{e.producteur?.user?.name}</td>
                                <td className="text-warning">{'★'.repeat(e.note)}{'☆'.repeat(5 - e.note)}</td>
                                <td className="fst-italic">{e.commentaire}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}