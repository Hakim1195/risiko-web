import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2023 Game Board Strategy. Tous droits réservés.</p>
        <div className="footer-links">
          <a href="/terms">Conditions d'utilisation</a>
          <a href="/privacy">Confidentialité</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;