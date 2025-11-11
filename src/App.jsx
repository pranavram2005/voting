import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import SimpleDataViewer from './SimpleDataViewer';
import Header from './Header';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle URL routing for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const handlePopState = () => {
        const path = window.location.pathname;
        if (path === '/dashboard' || path === '/') {
          setCurrentPage('dashboard');
        } else if (path === '/voters') {
          setCurrentPage('voters');
        }
      };

      window.addEventListener('popstate', handlePopState);
      
      // Set initial page based on URL
      const path = window.location.pathname;
      if (path === '/voters') {
        setCurrentPage('voters');
      } else {
        setCurrentPage('dashboard');
        window.history.replaceState({}, '', '/dashboard');
      }

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isAuthenticated]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    window.history.pushState({}, '', '/dashboard');
    setCurrentPage('dashboard');
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    window.history.pushState({}, '', '/dashboard');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    window.history.pushState({}, '', '/');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page === 'dashboard' ? 'dashboard' : 'voters'}`);
  };

  const switchToRegister = () => {
    setAuthMode('register');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  // If not authenticated, show login/register
  if (!isAuthenticated) {
    if (authMode === 'login') {
      return (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={switchToRegister}
        />
      );
    } else {
      return (
        <Register 
          onRegister={handleRegister} 
          onSwitchToLogin={switchToLogin}
        />
      );
    }
  }

  // If authenticated, show main app with header
  return (
    <div className="app-container">
      <Header 
        user={currentUser}
        currentPage={currentPage}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />
      
      <div className="main-content">
        {currentPage === 'dashboard' ? (
          <Dashboard user={currentUser} />
        ) : (
          <SimpleDataViewer />
        )}
      </div>
    </div>
  );
};

export default App;