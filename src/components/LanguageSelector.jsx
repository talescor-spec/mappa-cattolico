import React, { useEffect, useRef, useState } from 'react';
import { languages, useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelector({ compact = false }) {
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <div className={`language-selector ${compact ? 'compact' : ''}`} ref={ref}>
      <button className="language-trigger" onClick={() => setOpen((v) => !v)} aria-label="Language">
        <span>{languages[language].flag}</span>
        {!compact && <span className="language-trigger-label">{languages[language].label}</span>}
      </button>
      {open && (
        <div className="language-menu">
          {Object.entries(languages).map(([code, item]) => (
            <button
              key={code}
              className={code === language ? 'active' : ''}
              onClick={() => { changeLanguage(code); setOpen(false); }}
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
