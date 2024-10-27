// src/components/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-primary-100' : 'text-white';
  };

  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white text-2xl font-bold">
            Rehab Assistant
          </Link>
          
          <div className="flex space-x-8">
            <Link to="/" className={`${isActive('/')} hover:text-primary-100`}>
              Home
            </Link>
            <Link 
              to="/exercises" 
              className={`${isActive('/exercises')} hover:text-primary-100`}
            >
              Exercises
            </Link>
            <Link 
              to="/about" 
              className={`${isActive('/about')} hover:text-primary-100`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;