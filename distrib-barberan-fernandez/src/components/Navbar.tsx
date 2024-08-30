import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

export const Navbar: React.FC = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/productos">Gestion de Productos</Link></li>
                <li><Link to="/categorias">Gestion de Categorias</Link></li>
            </ul>
        </nav>
    );
}