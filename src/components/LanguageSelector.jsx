import React, { useEffect, useRef, useState } from 'react';
import { languages, useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function LanguageSelector({ compact = false }) {
  const { language, changeLanguage } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const selectLanguage = (code) => {
    changeLanguage(code);
    setOpen(false);
    if (user) updateProfile({ locale: code }).catch(() => {});
  };

  return (
    <div className={`language-selector ${compact ? 'compact' : ''}`} ref={ref}>
      <button
        className="language-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Selecionar idioma / Select language"
        aria-expanded={open}
      >
        <span>{languages[language].flag}</span>
        {!compact && <span className="language-trigger-label">{languages[language].label}</span>}
      </button>
      {open && (
        <div className="language-menu" role="menu">
          {Object.entries(languages).map(([code, item]) => (
            <button
              key={code}
              className={code === language ? 'active' : ''}
              onClick={() => selectLanguage(code)}
              role="menuitem"
            >
              <span>{item.flag}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
