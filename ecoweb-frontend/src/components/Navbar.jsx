import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import LanguageSwitcher from './LanguageSwitcher';

function Navbar({ user, handleLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage].nav;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeClass =
    'text-green-700 font-bold border-b-2 border-green-600';
  const baseClass =
    'text-gray-600 hover:text-green-600 transition-all duration-200 font-medium relative group';

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.firstName || user.email?.split('@')[0] || 'User';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                EcoWeb
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                (isActive ? activeClass : baseClass) + ' px-1'
              }
              end
            >
              {t.home}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                (isActive ? activeClass : baseClass) + ' px-1'
              }
            >
              {t.about}
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                (isActive ? activeClass : baseClass) + ' px-1'
              }
            >
              {t.projects}
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                (isActive ? activeClass : baseClass) + ' px-1'
              }
            >
              {t.contact}
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-1 rounded-full hover:bg-green-50 transition-all"
                >
                  <span className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-8 h-8 object-cover rounded-full" />
                    ) : (
                      getUserDisplayName()[0].toUpperCase()
                    )}
                  </span>
                  <span className="font-medium text-gray-700">{getUserDisplayName()}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-t-lg"
                    >
                      {t.profile}
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg"
                    >
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-full shadow transition-all duration-200"
              >
                {t.login}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 





