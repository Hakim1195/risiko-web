import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Home.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      // Ici nous ferons l'appel API pour l'inscription
      // Pour le moment, simulation
      console.log('Registration attempt:', formData);
      
      // Simuler une requête API
      setTimeout(() => {
        // Simulation de succès
        localStorage.setItem('token', 'fake-jwt-token');
        navigate('/lobby');
      }, 1000);
    } catch (err) {
      setError('Erreur d\'inscription. Veuillez réessayer.');
    }
  };

  return (
    <div className="home">
      <div className="home-hero" style={{ margin: '2rem 0', padding: '3rem 2rem' }}>
        <h1 className="hero-title">Inscription</h1>
        {error && <div className="error-message" style={{ color: '#ff5252', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary">S'inscrire</button>
          </form>
          <p className="auth-link">
            Vous avez déjà un compte ? <Link to="/login" className="btn-secondary">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;