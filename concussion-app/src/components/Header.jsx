// Header.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Header.css'; // Import your CSS file

export const Header = () => {

  const navigate = useNavigate();

  const goToHomePage = () => {
      navigate('/'); // Change '/' to the path of your home page
  };

  return (
    <header className="header">
      <Link to="/" className="home-button">
          <img src="../../public/home.png" alt="Home" className="home-icon" />
      </Link>
      <img src="../../public/logo.png" alt="Logo" className="logo-icon" />
      <h1>PACE</h1>
    </header>
  );
}

export default Header;