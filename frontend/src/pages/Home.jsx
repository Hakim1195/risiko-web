import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../components/Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="home-hero">
        <h1 className="hero-title">WORLD CONQUEST</h1>
        <p className="hero-subtitle">
          {user 
            ? `Bienvenue, ${user.username} ! Le jeu de stratégie ultime.` 
            : 'Le jeu de stratégie ultime - Prenez le contrôle du monde.'}
        </p>
        <div className="home-cta">
          <Link to="/lobby" className="btn-primary">
            {user ? 'Rejoindre une partie' : 'Commencer une partie'}
          </Link>
          <Link to="/store" className="btn-secondary">Boutique</Link>
          {user ? (
            <Link to="/profile" className="btn-secondary">Mon Profil</Link>
          ) : (
            <Link to="/register" className="btn-secondary">S'inscrire</Link>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="home-stats">
        <div className="stat-item">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Parties Jouées</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50K+</div>
          <div className="stat-label">Joueurs Actifs</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100+</div>
          <div className="stat-label">Territoires</div>
        </div>
      </div>

      {/* Features Section */}
      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">⚔️</div>
          <h3 className="feature-title">Conquête Mondiale</h3>
          <p className="feature-description">Prenez le contrôle de 42 territoires à travers le monde en utilisant votre stratégie et vos armées pour éliminer vos adversaires.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎲</div>
          <h3 className="feature-title">Combat Intensif</h3>
          <p className="feature-description">Utilisez vos dés pour combattre les ennemis et décidez du destin de vos territoires. L'avantage défensif est votre allié!</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3 className="feature-title">Objectifs Secrets</h3>
          <p className="feature-description">Chaque joueur a un objectif secret à atteindre. Soyez stratégique et détruisez vos ennemis pour gagner la partie!</p>
        </div>
      </div>

      {/* More Features */}
      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3 className="feature-title">Cartes Stratégiques</h3>
          <p className="feature-description">Échangez vos cartes territoires pour obtenir des renforts et développez votre armée pour conquérir plus de territoires.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3 className="feature-title">Multi-joueurs</h3>
          <p className="feature-description">Jouez en ligne avec vos amis ou rejoignez des parties publiques pour défier d'autres joueurs du monde entier.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3 className="feature-title">Leaderboard</h3>
          <p className="feature-description">Comparez vos performances avec les meilleurs joueurs et montez dans le classement mondial des conquérants.</p>
        </div>
      </div>

      {/* War-themed Image/Visual */}
      <div className="war-visual">
        <div className="war-visual-content">
          <h2 className="war-title">Préparez-vous à la guerre</h2>
          <p className="war-description">Rejoignez des milliers de joueurs dans le monde pour conquérir les territoires et devenir le roi de la stratégie.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="home-footer">
        <p>© 2026 Game Board Strategy - Tous droits réservés</p>
        <p>Le jeu de stratégie officiel de la guerre mondiale</p>
      </div>
    </div>
  );
};

export default Home;
