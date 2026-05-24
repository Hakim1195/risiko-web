import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <Link to="/" className="nav-logo">
          Game Board Strategy
        </Link>
        <nav className="layout-nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/lobby" className="nav-link">Lobby</Link>
          <Link to="/profile" className="nav-link">Profil</Link>
        </nav>
      </header>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <p>&copy; 2023 Game Board Strategy - Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default Layout;