import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Game Board Strategy</h1>
        <p>Le jeu de stratégie en plateau</p>
      </header>
      <main className="home-main">
        <div className="home-content">
          <div className="home-features">
            <h2>Pourquoi jouer à Game Board Strategy ?</h2>
            <ul>
              <li>Stratégie et réflexion tactique</li>
              <li>Jouez en ligne avec vos amis</li>
              <li>Nombreuses parties en cours simultanément</li>
              <li>Interface intuitive et moderne</li>
            </ul>
          </div>
          <div className="home-actions">
            <Link to="/login" className="btn btn-primary">Se connecter</Link>
            <Link to="/register" className="btn btn-secondary">S'inscrire</Link>
            <Link to="/lobby" className="btn btn-secondary">Accéder au lobby</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;