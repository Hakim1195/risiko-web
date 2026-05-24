import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-hero">
        <h2>WORLD CONQUEST</h2>
        <p>Le jeu de stratégie ultime - Prenez le contrôle du monde en lançant des attaques, défendant vos territoires et détruisant vos ennemis</p>
        <div className="home-cta">
          <button>Commencer une partie</button>
        </div>
      </div>
      
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
      
      <div className="home-features">
        <div className="feature-card">
          <h3>Conquête Mondiale</h3>
          <p>Prenez le contrôle de 42 territoires à travers le monde en utilisant votre stratégie et vos armées pour éliminer vos adversaires.</p>
        </div>
        
        <div className="feature-card">
          <h3>Combat Intensif</h3>
          <p>Utilisez vos dés pour combattre les ennemis et décidez du destin de vos territoires. L'avantage défensif est votre allié!</p>
        </div>
        
        <div className="feature-card">
          <h3>Objectifs Secrets</h3>
          <p>Chaque joueur a un objectif secret à atteindre. Soyez stratégique et détruisez vos ennemis pour gagner la partie!</p>
        </div>
      </div>
      
      <div className="home-features">
        <div className="feature-card">
          <h3>Cartes Stratégiques</h3>
          <p>Échangez vos cartes territoires pour obtenir des renforts et développez votre armée pour conquérir plus de territoires.</p>
        </div>
        
        <div className="feature-card">
          <h3>Multi-joueurs</h3>
          <p>Jouez en ligne avec vos amis ou rejoignez des parties publiques pour défier d'autres joueurs du monde entier.</p>
        </div>
        
        <div className="feature-card">
          <h3>Leaderboard</h3>
          <p>Comparez vos performances avec les meilleurs joueurs et montez dans le classement mondial des conquérants.</p>
        </div>
      </div>
      
      <div className="home-footer">
        <p>© 2026 Game Board Strategy - Tous droits réservés</p>
        <p>Le jeu de stratégie officiel de la guerre mondiale</p>
      </div>
    </div>
  );
};

export default Home;