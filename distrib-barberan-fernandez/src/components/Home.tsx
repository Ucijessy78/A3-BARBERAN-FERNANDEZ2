import React from "react";
import './Home.css'; // Asegúrate de importar el archivo CSS

export const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1 className="welcome-title">¡Bienvenidos!</h1>
            <div className="image-collage">
                <img src="https://i.postimg.cc/Y9tS62Xw/Alerta-comercial-cuidado-personal-2.jpg" alt="Imagen 1" className="collage-image" />
                <img src="https://i.postimg.cc/G37pDCGZ/descarga1.jpg" alt="Imagen 2" className="collage-image" />
            </div>
            <p className="welcome-message">Explora nuestras funciones y disfruta de una experiencia personalizada.</p>
            <button className="explore-button">Explorar</button>
        </div>
    );
};