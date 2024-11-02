import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Dumbbell, Info, Book } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/exercises', label: 'Bài tập', icon: Dumbbell },
    { path: '/sotay', label: 'Sổ tay cẩm nang', icon: Book },
    { path: '/about', label: 'Giới thiệu', icon: Info },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-primary-600/95 shadow-lg backdrop-blur-sm' : 'bg-primary-600'
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-white"
            >
              <Dumbbell size={28} className="text-primary-100" />
              <span className="text-xl md:text-2xl font-bold">Trợ lý Phục hồi</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive(path)
                    ? 'text-primary-100 bg-white/10'
                    : 'text-white hover:text-primary-100 hover:bg-white/5'
                    }`}
                >
                  <Icon size={18} />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
            }`}>
            <div className="py-4 space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(path)
                    ? 'text-primary-100 bg-white/10'
                    : 'text-white hover:text-primary-100 hover:bg-white/5'
                    }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider line when scrolled */}
        <div className={`h-px bg-white/10 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'
          }`} />
      </nav>

      {/* Spacer div to prevent content overlap */}
      <div className={`h-16 ${isOpen ? 'lg:h-16' : 'h-16'}`} />
    </>
  );
};

export default Navigation;
