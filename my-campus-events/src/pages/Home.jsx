import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Campus Events</h1>
        <p>Discover and join exciting events happening on campus</p>
        <div className="cta-buttons">
          <Link to="/events" className="cta-button primary">Browse Events</Link>
          <Link to="/register" className="cta-button secondary">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
