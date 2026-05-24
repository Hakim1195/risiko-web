import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Home.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation de connexion
    console.log('Connexion avec:', { email, password });
        navigate('/lobby');
  };

  return (
    <div className="home">
      <div className="home-hero" style={{ margin: '2rem 0', padding: '3rem 2rem' }}>
        <h1 className="hero-title">Connexion</h1>
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary">Se connecter</button>
          </form>
          <p className="auth-link">
            Pas encore de compte ? <Link to="/register" className="btn-secondary">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;