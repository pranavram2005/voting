import React from 'react';

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h2>Home Page</h2>;
}

function About() {
  return <h2>About Page</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Link to="/">Home</Link> | <Link to="/about">About</Link>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}




const Header = ({ user, currentPage, onNavigate, onLogout }) => {
  return (
    <div className="app-header">
      <div className="header-left">
        <h1 className="dashboard-title">
          {currentPage === 'dashboard' ? 'Dashboard' : 'Electoral Details'}
        </h1>
      </div>
      
      <div className="header-center">
        <nav className="nav-menu">
          <button 
            className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-button ${currentPage === 'voters' ? 'active' : ''}`}
            onClick={() => onNavigate('voters')}
          >
            👥 Voters Data
          </button>
        </nav>
      </div>

      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">
            <img src="/i1.png" alt="User avatar" />
          </div>
          <div className="user-details">
            <div className="welcome">Welcome <span className="user-name">{user?.fullName || user?.username}</span></div>
            <div className="user-actions">
              <span className="settings-link">Settings</span> | 
              <span className="logout-link" onClick={onLogout}>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;