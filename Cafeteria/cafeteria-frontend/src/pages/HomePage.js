import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/sakuracoffee.jpg';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            {/* Fondo con muchas flores cayendo */}
            <div className="sakura-background">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={`sakura-falling delay-${i % 5}`} 
                         style={{ 
                             left: `${(i * 7) % 100}%`,
                             animationDelay: `${i * 0.7}s`,
                             width: `${10 + (i % 10)}px`,
                             height: `${10 + (i % 10)}px`
                         }}>
                    </div>
                ))}
            </div>
            
            <div className="home-container">
                {/* Logo de la cafetería */}
                <div className="logo-section">
                    <img 
                        src={logo} 
                        alt="Sakura Coffee Logo" 
                        className="logo-image"
                    />
                    <p className="subtitle">LATACUNGA • ECUADOR</p>
                </div>

                {/* Mensaje principal */}
                <div className="hero-message">
                    <p className="tagline">
                        Disfruta de la experiencia única<br />
                        de nuestros cafés artesanales<br />
                        en el corazón de Latacunga
                    </p>
                </div>

                {/* Solo el botón Ver Menú */}
                <div className="main-nav">
                    <button 
                        className="nav-btn primary"
                        onClick={() => navigate('/menu')}
                    >
                        Ver Menú
                    </button>
                </div>

                {/* Separador decorativo */}
                <div className="divider">
                    <div className="divider-line"></div>
                    <div className="divider-line"></div>
                </div>

                {/* Sección de características - DOS CAJITAS SEPARADAS */}
                <div className="features-section">
                    {/* Cajita Café Premium */}
                    <div className="feature-box premium-box">
                        <div className="feature-header">
                            <div className="feature-icon premium-icon">☕</div>
                            <h3 className="feature-title">Café Premium</h3>
                        </div>
                        <p className="feature-description">
                            Granos selectos de origen ecuatoriano
                        </p>
                        <div className="feature-decoration">
                            <span className="decoration-dot"></span>
                            <span className="decoration-dot"></span>
                            <span className="decoration-dot"></span>
                        </div>
                    </div>
                    
                    {/* Cajita Desayunos */}
                    <div className="feature-box breakfast-box">
                        <div className="feature-header">
                            <div className="feature-icon breakfast-icon">🍽️</div>
                            <h3 className="feature-title">Desayunos</h3>
                        </div>
                        <p className="feature-description">
                            Opciones frescas cada mañana
                        </p>
                        <div className="feature-decoration">
                            <span className="decoration-dot"></span>
                            <span className="decoration-dot"></span>
                            <span className="decoration-dot"></span>
                        </div>
                    </div>
                </div>

                {/* Misión y Visión */}
                <div className="mission-vision-section">
                    <div className="mission-card">
                        <h3 className="section-title">MISIÓN</h3>
                        <p className="mission-text">
                            Cultivar en nuestra comunidad el amor por el café de especialidad, 
                            mientras promovemos prácticas sustentables y responsables.
                        </p>
                    </div>
                    
                    <div className="vision-card">
                        <h3 className="section-title">VISIÓN</h3>
                        <p className="vision-text">
                            Fomentar en nuestra comunidad una inspiración duradera y un aprecio 
                            genuino por productos de calidad, promoviendo un entorno ameno y 
                            receptivo para todos.
                        </p>
                    </div>
                </div>

                {/* Solo botón Generar QR */}
                <div className="qr-section">
                    <button className="qr-button">
                        <span className="qr-icon">📱</span>
                        <span className="qr-text">Generar QR</span>
                        <span className="qr-subtext">Para pedidos rápidos</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;