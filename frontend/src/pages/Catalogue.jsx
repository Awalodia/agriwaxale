import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { photoUrl } from '../utils';

export default function Catalogue() {
    const [offres, setOffres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [recherche, setRecherche] = useState('');
    const [categorieId, setCategorieId] = useState('');
    const [zone, setZone] = useState('');
    const [prixMax, setPrixMax] = useState('');
    const [chargement, setChargement] = useState(true);
    const { role, logout } = useAuth();

    useEffect(() => { api.get('/categories').then((res) => setCategories(res.data)); }, []);
    useEffect(() => { chargerOffres(); }, [categorieId, zone, prixMax]);

    const chargerOffres = async (overrides = {}) => {
        setChargement(true);
        try {
            const params = {
                recherche: (overrides.recherche ?? recherche) || undefined,
                categorie_id: categorieId || undefined,
                zone: zone || undefined,
                prix_max: prixMax || undefined,
            };
            const res = await api.get('/offres', { params });
            setOffres(res.data);
        } finally {
            setChargement(false);
        }
    };

    const handleRecherche = (e) => { e.preventDefault(); chargerOffres(); };

    const lienEspace = role === 'acheteur' ? '/acheteur' : role === 'producteur' ? '/producteur' : role === 'administrateur' ? '/admin' : null;

    return (
        <div>
            <div style={{ height: 4, background: 'linear-gradient(90deg, #00853f 33%, #fdef42 33%, #fdef42 66%, #e31b23 66%)' }}></div>

            <nav className="navbar navbar-expand-lg main-navbar sticky-top py-3">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                        <span className="logo"><i className="bi bi-flower1"></i></span>
                        AgriWaxalé
                    </Link>
                    <div className="d-flex align-items-center gap-2">
                        {role ? (
                            <>
                                <Link to={lienEspace} className="btn btn-outline-agri"><i className="bi bi-speedometer2 me-1"></i> Mon espace</Link>
                                <button className="btn btn-agri" onClick={logout}>Se déconnecter</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-agri">Se connecter</Link>
                                <Link to="/register" className="btn btn-agri">Créer un compte</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <header style={{ position: 'relative', minHeight: 420, display: 'flex', alignItems: 'center', color: 'white', overflow: 'hidden', backgroundColor: 'var(--dark-green)' }}>
                <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80"
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,61,36,0.94), rgba(15,112,65,0.80))' }}></div>

                <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
          <span className="badge mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', padding: '9px 15px', borderRadius: 30 }}>
            <i className="bi bi-geo-alt-fill me-2"></i>La plateforme agricole sénégalaise
          </span>
                    <h1 className="fw-bold" style={{ maxWidth: 750, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                        Achetez, vendez et <span style={{ color: '#ffd071' }}>négociez</span> vos produits agricoles
                    </h1>
                    <p className="fs-5" style={{ maxWidth: 600, opacity: 0.9 }}>
                        AgriWaxalé rapproche producteurs et acheteurs. Achetez directement au prix affiché ou proposez votre prix grâce au Waxalé numérique.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className="p-4 bg-white border rounded-4 shadow-sm" style={{ marginTop: -50, position: 'relative', zIndex: 5 }}>
                    <form onSubmit={handleRecherche} className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Produit recherché</label>
                            <input type="text" className="form-control" placeholder="Oignon, riz, mangue..." value={recherche} onChange={(e) => setRecherche(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Catégorie</label>
                            <select className="form-select" value={categorieId} onChange={(e) => setCategorieId(e.target.value)}>
                                <option value="">Toutes les catégories</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label fw-semibold">Zone</label>
                            <input type="text" className="form-control" placeholder="Thiès..." value={zone} onChange={(e) => setZone(e.target.value)} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label fw-semibold">Prix max</label>
                            <input type="number" min="50" step="1" className="form-control" placeholder="FCFA" value={prixMax} onChange={(e) => setPrixMax(e.target.value)} />
                        </div>
                        <div className="col-md-1">
                            <button type="submit" className="btn btn-agri w-100 py-2"><i className="bi bi-search"></i></button>
                        </div>
                    </form>
                </div>
            </div>

            <section className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Nos catégories</h2>
                    <p className="text-secondary">Retrouvez des légumes, des fruits et des céréales proposés par des producteurs.</p>
                </div>
                <div className="row g-4 justify-content-center">
                    {categories.map((c) => (
                        <div key={c.id} className="col-6 col-md-3">
                            <div className="category-card" onClick={() => setCategorieId(String(c.id))}>
                                <div className="category-icon"><i className="bi bi-flower2"></i></div>
                                <h5 className="fw-bold mb-0">{c.nom}</h5>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container py-5">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <h2 className="fw-bold">Produits disponibles</h2>
                    <span className="badge text-bg-success fs-6">{offres.length} produit(s)</span>
                </div>

                {chargement ? <p>Chargement...</p> : offres.length === 0 ? (
                    <div className="alert alert-warning text-center">Aucune offre ne correspond à votre recherche.</div>
                ) : (
                    <div className="row g-4">
                        {offres.map((offre) => (
                            <div key={offre.id} className="col-md-6 col-xl-4">
                                <article className="offer-card">
                                    <div style={{ height: 180, overflow: 'hidden', borderRadius: '18px 18px 0 0' }}>
                                        <img src={photoUrl(offre.photo)} alt={offre.nom_produit} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="offer-body">
                                        <div className="d-flex justify-content-between gap-3">
                                            <div>
                                                <h3 className="offer-title">{offre.nom_produit}</h3>
                                                <div className="offer-meta"><i className="bi bi-geo-alt me-1"></i>{offre.zone_production || offre.producteur?.zone_production}</div>
                                            </div>
                                            <div className="offer-price">{offre.prix_initial} F <small>/ {offre.unite}</small></div>
                                        </div>
                                        <div className="d-flex justify-content-between border-top border-bottom py-2 my-3">
                                            <span className="text-secondary">Disponible</span>
                                            <strong>{offre.quantite} {offre.unite}</strong>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <div className="fw-bold">{offre.producteur?.user?.name}</div>
                                            <span className="category-badge ms-auto">{offre.categorie?.nom}</span>
                                        </div>
                                        <Link to={`/offres/${offre.id}`} className="btn btn-agri w-100"><i className="bi bi-eye me-1"></i> Voir le détail</Link>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="waxale-section py-5">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <span className="badge text-bg-warning mb-3">Fonctionnalité principale</span>
                            <h2 className="display-6 fw-bold">Le Waxalé devient numérique</h2>
                            <p className="fs-5 text-white-50 my-4">Si le prix affiché ne vous convient pas, proposez une quantité et un nouveau prix au producteur.</p>
                            <div className="d-flex gap-3 mb-4">
                                <span className="step-number">1</span>
                                <div><h5 className="fw-bold mb-1">L'acheteur propose</h5><p className="text-white-50 mb-0">Il indique la quantité et le prix souhaités.</p></div>
                            </div>
                            <div className="d-flex gap-3 mb-4">
                                <span className="step-number">2</span>
                                <div><h5 className="fw-bold mb-1">Le producteur répond</h5><p className="text-white-50 mb-0">Il accepte, refuse ou fait une contre-offre.</p></div>
                            </div>
                            <div className="d-flex gap-3">
                                <span className="step-number">3</span>
                                <div><h5 className="fw-bold mb-1">La commande est créée</h5><p className="text-white-50 mb-0">L'accord trouvé devient une commande.</p></div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="waxale-preview">
                                <div className="border-bottom pb-3 mb-3">
                                    <h5 className="fw-bold mb-1">Négociation sur des oignons</h5>
                                    <small className="text-secondary">80 kg — prix affiché : 250 FCFA/kg</small>
                                </div>
                                <div className="step-row d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">Étape 1 — Proposition</span>
                                    <span className="badge text-bg-secondary">200 FCFA/kg</span>
                                </div>
                                <div className="step-row">
                                    <div className="fw-semibold mb-2">Étape 2 — Réponse du producteur</div>
                                    <div className="d-flex gap-2">
                                        <span className="badge text-bg-success">Accepter</span>
                                        <span className="badge text-bg-warning">Contre-offre</span>
                                        <span className="badge text-bg-danger">Refuser</span>
                                    </div>
                                </div>
                                <div className="alert alert-success mt-3 mb-0">
                                    <i className="bi bi-check-circle-fill me-2"></i> Accord trouvé : la commande est créée automatiquement.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-6" id="apropos">
                        <h2 className="fw-bold mb-3">À propos d'AgriWaxalé</h2>
                        <p className="text-secondary">
                            AgriWaxalé est une plateforme numérique de commercialisation des produits agricoles,
                            conçue pour rapprocher directement les producteurs sénégalais des acheteurs,
                            sans intermédiaire, tout en conservant l'esprit du Waxalé — la négociation traditionnelle.
                        </p>
                    </div>
                    <div className="col-lg-6" id="contact">
                        <h2 className="fw-bold mb-3">Contact</h2>
                        <p className="text-secondary mb-1"><i className="bi bi-geo-alt me-2"></i>Dakar, Sénégal</p>
                        <p className="text-secondary mb-1"><i className="bi bi-envelope me-2"></i>contact@agriwaxale.sn</p>
                        <p className="text-secondary"><i className="bi bi-telephone me-2"></i>+221 77 000 00 00</p>
                    </div>
                </div>
            </section>

            <footer className="pt-5">
                <div className="container">
                    <div className="row g-4 pb-4">
                        <div className="col-lg-6">
                            <h4 className="text-white fw-bold">AgriWaxalé</h4>
                            <p>Plateforme numérique de commercialisation des produits agricoles.</p>
                        </div>
                        <div className="col-lg-3">
                            <h5 className="text-white">Liens</h5>
                            <p><a href="#apropos">À propos</a></p>
                            <p><a href="#contact">Contact</a></p>
                        </div>
                    </div>
                    <div className="border-top border-secondary py-3 text-center">© 2026 AgriWaxalé</div>
                </div>
            </footer>
        </div>
    );
}