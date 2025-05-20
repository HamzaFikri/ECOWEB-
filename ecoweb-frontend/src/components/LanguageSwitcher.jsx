import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, languages } from '../contexts/LanguageContext';

function LanguageSwitcher() {
  const { currentLanguage, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        aria-label="Change language"
      >
        <span className="text-lg transform hover:scale-110 transition-transform duration-200">
          {languages[currentLanguage].flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fade-in">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {Object.values(languages).map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  toggleLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-3 hover:bg-green-50 transition-colors duration-150 ${
                  currentLanguage === lang.code ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                }`}
                role="menuitem"
              >
                <span className="text-lg transform hover:scale-110 transition-transform duration-200">
                  {lang.flag}
                </span>
                <span className="flex-1">{lang.name}</span>
                {currentLanguage === lang.code && (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher; 