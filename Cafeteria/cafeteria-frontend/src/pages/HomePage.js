import React from 'react';
import './HomePage.css';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../images/sakuracoffee.jpg';

// URLs de imágenes para las cartas (reemplaza con tus propias imágenes si es necesario)
const granosCafe = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80";
const desayunoHero = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80";
const ambienteCafe = "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?auto=format&fit=crop&w=600&q=80";

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            {/* Fondo con pétalos sakura animados - SOLO ESTO DE FONDO */}
            <div className="sakura-background">
                {[...Array(120)].map((_, i) => {
                    const left = Math.random() * 100;
                    const delay = Math.random() * 2;
                    const duration = 15 + Math.random() * 15;
                    const size = 10 + Math.random() * 20;
                    const opacity = 0.15 + Math.random() * 0.35;
                    const rotate = Math.random() * 360;

                    return (
                        <div
                            key={i}
                            className="sakura-petal"
                            style={{
                                left: `${left}%`,
                                animationDelay: `${delay}s`,
                                animationDuration: `${duration}s`,
                                width: `${size}px`,
                                height: `${size}px`,
                                opacity: opacity,
                                transform: `rotate(${rotate}deg)`,
                            }}
                        >
                            <div className="petal-shape"></div>
                        </div>
                    );
                })}
            </div>

            {/* Header Principal SIN imagen de fondo */}
            <header className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <img
                            src={logo}
                            alt="Sakura Coffee Logo"
                            className="main-logo"
                        />
                        <h1 className="hero-title">
                            <span className="title-japanese">桜</span>
                            <span className="title-main">Sakura Coffee</span>
                        </h1>
                        <p className="hero-subtitle">LATACUNGA • ECUADOR</p>

                        <p className="hero-tagline">
                            Donde cada taza es una experiencia,<br />
                            cada sorbo una tradición
                        </p>

                        <div className="hero-buttons">
                            <Link
                                to="/menu"
                                className="hero-btn primary-btn"
                                style={{ textDecoration: 'none' }}
                            >
                                <span className="btn-text">Explorar Menú</span>
                                <span className="btn-arrow">→</span>
                            </Link>


                        </div>
                    </div>
                </div>
            </header>

            {/* Sección de Características Destacadas */}
            <section className="features-highlight">
                <div className="container">
                    <h2 className="section-title">Nuestra Esencia</h2>
                    <p className="section-subtitle">Lo que hace especial a Sakura Coffee</p>

                    <div className="highlight-cards">
                        {/* Card 1: Café Premium con imagen */}
                        <div className="highlight-card">
                            <div className="card-image-container">
                                <img
                                    src={granosCafe}
                                    alt="Granos de café premium"
                                    className="card-image"
                                />
                                <div className="card-overlay"></div>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">Café de Especialidad</h3>
                                <p className="card-description">
                                    Granos selectos 100% ecuatorianos, tostados artesanalmente para resaltar su aroma único.
                                </p>
                                <div className="card-details">
                                    <span className="detail-tag">Origen Local</span>
                                    <span className="detail-tag">Tostado Fresco</span>
                                    <span className="detail-tag">Artesanal</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Desayunos con imagen */}
                        <div className="highlight-card">
                            <div className="card-image-container">
                                <img
                                    src={desayunoHero}
                                    alt="Desayunos frescos"
                                    className="card-image"
                                />
                                <div className="card-overlay"></div>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">Desayunos Frescos</h3>
                                <p className="card-description">
                                    Ingredientes locales preparados cada mañana para comenzar tu día con energía.
                                </p>
                                <div className="card-details">
                                    <span className="detail-tag">Ingredientes Locales</span>
                                    <span className="detail-tag">Preparado al Momento</span>
                                    <span className="detail-tag">Opciones Saludables</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Ambiente con imagen */}
                        <div className="highlight-card">
                            <div className="card-image-container">
                                <img
                                    src={ambienteCafe}
                                    alt="Ambiente acogedor"
                                    className="card-image"
                                />
                                <div className="card-overlay"></div>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">Ambiente Único</h3>
                                <p className="card-description">
                                    Fusión de cultura japonesa y calidez ecuatoriana en un espacio diseñado para tu comodidad.
                                </p>
                                <div className="card-details">
                                    <span className="detail-tag">Diseño Japonés</span>
                                    <span className="detail-tag">Wi-Fi Gratis</span>
                                    <span className="detail-tag">Ambiente Tranquilo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección Misión y Visión Mejorada */}
            <section className="mission-vision-section">
                <div className="container">
                    <div className="mission-vision-grid">
                        {/* Misión */}
                        <div className="mv-card mission-card">
                            <div className="mv-header">
                                <h3 className="mv-title">Nuestra Misión</h3>
                            </div>
                            <div className="mv-content">
                                <p className="mv-text">
                                    Cultivar en nuestra comunidad el amor por el café de especialidad,
                                    mientras promovemos prácticas sustentables y responsables con el medio ambiente
                                    y nuestra sociedad.
                                </p>
                                <div className="mv-features">
                                    <div className="mv-feature">
                                        <span className="feature-dot"></span>
                                        <span>Café de calidad</span>
                                    </div>
                                    <div className="mv-feature">
                                        <span className="feature-dot"></span>
                                        <span>Sustentabilidad</span>
                                    </div>
                                    <div className="mv-feature">
                                        <span className="feature-dot"></span>
                                        <span>Comunidad</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visión */}
                        <div className="mv-card vision-card">
                            <div className="mv-header">
                                <h3 className="mv-title">Nuestra Visión</h3>
                            </div>
                            <div className="mv-content">
                                <p className="mv-text">
                                    Ser el referente en café de especialidad en Latacunga, fomentando una
                                    inspiración duradera y un aprecio genuino por productos de calidad,
                                    promoviendo un entorno ameno y receptivo para todos.
                                </p>
                                <div className="mv-features">
                                    <div className="mv-feature">
                                        <span className="feature-dot"></span>
                                        <span>Referente local</span>
                                    </div>
                                    <div className="mv-feature">
                                        <span className="feature-dot"></span>
                                        <span>Calidad premium</span>
                                    </div>
                                    <div className="mv-feature">
                                        <span className="feature-dot"></span>
                                        <span>Espacio inclusivo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Acciones Rápidas */}
            <section className="quick-actions">
                <div className="container">
                    <h2 className="section-title">Acciones Rápidas</h2>
                    <p className="section-subtitle">Todo lo que necesitas en un clic</p>

                    <div className="action-buttons-grid">
                        <button
                            className="action-card menu-action"
                            onClick={() => navigate('/menu')}
                        >
                            <div className="action-content">
                                <h3 className="action-title">Ver Menú Completo</h3>
                                <p className="action-desc">Explora todas nuestras opciones</p>
                            </div>
                            <div className="action-arrow">→</div>
                        </button>

                        <button className="action-card hours-action">
                            <div className="action-content">
                                <h3 className="action-title">Horarios</h3>
                                <p className="action-desc">Lun-Vie: 7AM - 9PM</p>
                                <p className="action-desc">Sáb-Dom: 8AM - 10PM</p>
                            </div>
                            <div className="action-arrow">→</div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer Mejorado */}
            <footer className="main-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <img
                                src={logo}
                                alt="Sakura Coffee"
                                className="footer-logo"
                            />
                            <p className="footer-tagline">
                                Donde la tradición japonesa se encuentra con el café ecuatoriano
                            </p>
                        </div>

                        <div className="footer-info">
                            <div className="info-column">
                                <h4 className="info-title">Contacto</h4>
                                <p className="info-item">📍 Latacunga, Ecuador</p>
                                <p className="info-item">📞 +593 98 765 4321</p>
                                <p className="info-item">✉️ hola@sakuracoffee.com</p>
                            </div>

                            <div className="info-column">
                                <h4 className="info-title">Horarios</h4>
                                <p className="info-item">Lunes a Viernes: 7:00 - 21:00</p>
                                <p className="info-item">Sábado y Domingo: 8:00 - 22:00</p>
                            </div>

                            <div className="info-column">
                                <h4 className="info-title">Redes Sociales</h4>
                                <div className="social-icons">
                                    <button className="social-icon">📷</button>
                                    <button className="social-icon">📘</button>
                                    <button className="social-icon">📱</button>
                                    <button className="social-icon">🎵</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="copyright">
                            © {new Date().getFullYear()} Sakura Coffee. Todos los derechos reservados.
                        </p>
                        <p className="footer-note">
                            Inspiración japonesa moderna en el corazón de Latacunga
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;