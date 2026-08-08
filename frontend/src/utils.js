export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');

export const photoUrl = (photo) => {
    if (!photo) return 'https://placehold.co/600x400/eaf7ef/157347?text=AgriWaxal%C3%A9';
    if (photo.startsWith('http')) return photo; // URL complète (Cloudinary)
    return `${API_BASE}/storage/${photo}`; // chemin local
};