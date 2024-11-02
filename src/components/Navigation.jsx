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
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">

            <Link to="/" className="text-white text-2xl font-bold">
              <img
                src="/assets/images/logo.gif"
                alt="Logo"
                className="h-20 w-100 object-contain"
              />
            </Link>
          </div>

          <div className="flex space-x-8">
            <Link to="/" className={`${isActive('/')} hover:text-primary-100`}>
              Trang chủ
            </Link>
            <Link to="sotay" className={`${isActive('/sotay')} hover:text-primary-100`}>
              Sổ tay vận động
            </Link>

            <Link
              to="/exercises"
              className={`${isActive('/exercises')} hover:text-primary-100`}
            >
              Bài tập
            </Link>
            <Link
              to="/about"
              className={`${isActive('/about')} hover:text-primary-100`}
            >
              Tác giả
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
