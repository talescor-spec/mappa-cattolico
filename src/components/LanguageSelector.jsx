// src/components/LanguageSelector.jsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  const currentLang = languages.find(l => l.code === language);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div style={styles.container}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={styles.button}
      >
        <span style={styles.flag}>{currentLang.flag}</span>
        <span style={styles.name}>{currentLang.name}</span>
        <span style={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                ...styles.option,
                ...(language === lang.code ? styles.optionActive : {})
              }}
            >
              <span style={styles.flag}>{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <span style={styles.check}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div 
          style={styles.overlay} 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  flag: {
    fontSize: '20px',
  },
  name: {
    fontSize: '14px',
  },
  arrow: {
    fontSize: '10px',
    marginLeft: '4px',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    minWidth: '180px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  optionActive: {
    backgroundColor: '#f0f0f0',
  },
  check: {
    marginLeft: 'auto',
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  }
};

export default LanguageSelector;
