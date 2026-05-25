import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Home.css';
import config from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/lobby');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      // Store token
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate to lobby
      navigate('/lobby');
    } catch (err) {
      setError(err.message || 'Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="home-hero" style={{ margin: '2rem 0', padding: '3rem 2rem' }}>
        <h1 className="hero-title">Connexion</h1>
        {error && <div className="error-message" style={{ color: '#ff5252', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}
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
                placeholder="votre@email.com"
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
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <div className="auth-links">
            <p className="auth-link">
              Pas encore de compte ? <Link to="/register" className="btn-secondary">S'inscrire</Link>
            </p>
            <p className="auth-link">
              <Link to="/forgot-password" className="btn-link">Mot de passe oublié ?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
