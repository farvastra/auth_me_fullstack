import React from "react";
import { Link } from "react-router-dom";
import "./styles/homepage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="overlay">
        <h1>Welcome to Spots</h1>
        <p>Find the perfect place to stay, rent, or book for your next adventure.</p>
        <Link to="/spots" className="cta-button">Browse Spots</Link>
      </div>
    </div>
  );
};

export default HomePage;
