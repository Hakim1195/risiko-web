import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>Game Board Strategy</h1>
        <nav className="layout-nav">
          <a href="#/home">Accueil</a>
          <a href="#/games">Jeux</a>
          <a href="#/rooms">Salles</a>
          <a href="#/profile">Profil</a>
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