import React, { useEffect, useState } from 'react';
import './SakuraPetals.css';

const SakuraPetals = ({ 
    count = 150,
    minDuration = 30,
    maxDuration = 50,
    colors = ['#ffb7c5', '#ffa8ba', '#ff99b3', '#ffc6d0'],
    withWind = true
}) => {
    const [petals, setPetals] = useState([]);

    useEffect(() => {
        // Crear array de pétalos con propiedades aleatorias
        const newPetals = Array.from({ length: count }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 40,
            duration: minDuration + Math.random() * (maxDuration - minDuration),
            size: 6 + Math.random() * 20,
            opacity: 0.15 + Math.random() * 0.4,
            sway: 0.3 + Math.random() * 0.7,
            color: colors[Math.floor(Math.random() * colors.length)],
            type: Math.floor(Math.random() * 3),
            rotateSpeed: 0.5 + Math.random() * 1.5
        }));
        
        setPetals(newPetals);
        
        // Efecto de viento aleatorio
        if (withWind) {
            const windInterval = setInterval(() => {
                if (Math.random() > 0.7) { // 30% de probabilidad
                    document.documentElement.style.setProperty('--wind-strength', '1.5');
                    setTimeout(() => {
                        document.documentElement.style.setProperty('--wind-strength', '1');
                    }, 3000);
                }
            }, 10000); // Cada 10 segundos
            
            return () => clearInterval(windInterval);
        }
    }, [count, minDuration, maxDuration, colors, withWind]);

    return (
        <div className="sakura-petals-container">
            {petals.map(petal => (
                <div
                    key={petal.id}
                    className={`sakura-petal petal-${petal.type}`}
                    style={{
                        '--left': `${petal.left}%`,
                        '--delay': `${petal.delay}s`,
                        '--duration': `${petal.duration}s`,
                        '--size': `${petal.size}px`,
                        '--opacity': petal.opacity,
                        '--sway': petal.sway,
                        '--color': petal.color,
                        '--rotate-speed': petal.rotateSpeed,
                    }}
                >
                    <div className="petal-core"></div>
                    <div className="petal-glow"></div>
                </div>
            ))}
        </div>
    );
};

export default SakuraPetals;