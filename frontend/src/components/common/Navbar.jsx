import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import config from '../config';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return null;
  }

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
            <Link to="/store" className="nav-link">Boutique</Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  {user.username}
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn-logout">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Connexion</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link btn-primary nav-register">
                  S'inscrire
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
