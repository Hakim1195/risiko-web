import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Game Board Strategy
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Accueil</Link>
          </li>
          <li className="nav-item">
            <Link to="/lobby" className="nav-link">Lobby</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">Profil</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;