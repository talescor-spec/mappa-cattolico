// src/components/LanguageSelector.jsx - VERSÃO MINIMALISTA
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = {
    it: { flag: '🇮🇹', name: 'Italiano' },
    en: { flag: '🇺🇸', name: 'English' },
    pt: { flag: '🇧🇷', name: 'Português' }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-mini" ref={dropdownRef}>
      <button 
        className="language-button-mini" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Selecionar idioma"
      >
        <span className="flag-large">{languages[language].flag}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown-mini">
          {Object.entries(languages).map(([code, { flag, name }]) => (
            <button
              key={code}
              className={`language-option-mini ${code === language ? 'active' : ''}`}
              onClick={() => handleSelect(code)}
            >
              <span className="flag-mini">{flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
