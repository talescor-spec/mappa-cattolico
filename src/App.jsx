import React, { useState, useEffect } from 'react';
import { Calendar, Book, Heart, Home, Menu, ChevronRight, Check } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';

function MappaCattolicoContent() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMystery, setSelectedMystery] = useState(null);
  const [rosaryProgress, setRosaryProgress] = useState({});
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem('rosaryProgress') || '{}');
    const savedName = localStorage.getItem('userName') || 'Amigo';
    setRosaryProgress(savedProgress);
    setUserName(savedName);
  }, []);

  const updateProgress = (mysteryType, beadIndex) => {
    const today = new Date().toDateString();
    const newProgress = {
      ...rosaryProgress,
      [today]: {
        ...rosaryProgress[today],
        [mysteryType]: beadIndex
      }
    };
    setRosaryProgress(newProgress);
    localStorage.setItem('rosaryProgress', JSON.stringify(newProgress));
  };

  const getTodayProgress = (mysteryType) => {
    const today = new Date().toDateString();
    return rosaryProgress[today]?.[mysteryType] || 0;
  };

  const mysteries = {
    gozosos: {
      name: t('mysteriesJoyful'),
      day: `${t('monday')} e ${t('saturday')}`,
      color: '#D4AF37',
      mysteries: [
        t('joyful1'),
        t('joyful2'),
        t('joyful3'),
        t('joyful4'),
        t('joyful5')
      ]
    },
    luminosos: {
      name: t('mysteriesLuminous'),
      day: t('thursday'),
      color: '#FFD700',
      mysteries: [
        t('luminous1'),
        t('luminous2'),
        t('luminous3'),
        t('luminous4'),
        t('luminous5')
      ]
    },
    dolorosos: {
      name: t('mysteriesSorrowful'),
      day: `${t('tuesday')} e ${t('friday')}`,
      color: '#8B4513',
      mysteries: [
        t('sorrowful1'),
        t('sorrowful2'),
        t('sorrowful3'),
        t('sorrowful4'),
        t('sorrowful5')
      ]
    },
    gloriosos: {
      name: t('mysteriesGlorious'),
      day: `${t('wednesday')} e ${t('sunday')}`,
      color: '#DAA520',
      mysteries: [
        t('glorious1'),
        t('glorious2'),
        t('glorious3'),
        t('glorious4'),
        t('glorious5')
      ]
    }
  };

  const prayers = [
    {
      title: t('hailMary'),
      text: t('hailMaryText')
    },
    {
      title: t('ourFather'),
      text: t('ourFatherText')
    },
    {
      title: t('gloryBe'),
      text: t('gloryBeText')
    },
    {
      title: t('hailHolyQueen'),
      text: t('hailHolyQueenText')
    }
  ];

  // Home Page
  const HomePage = () => (
    <div className="page-content">
      <div className="greeting-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h1 className="greeting">{t('greeting')}, {userName}.</h1>
            <p className="subtitle">{t('appSubtitle')}</p>
            <p className="verse">{t('peaceBless')}</p>
          </div>
          <LanguageSelector />
        </div>
      </div>

      <div className="feature-card gospel-card" onClick={() => setCurrentPage('gospel')}>
        <div className="card-header">
          <Book size={24} />
          <span className="card-badge">{t('todayGospel')}</span>
        </div>
        <div className="gospel-preview">
          <div className="gospel-image"></div>
          <div className="gospel-info">
            <p className="gospel-date">{t('gospelDate')}</p>
            <h3 className="gospel-title">{t('gospelReference')}</h3>
            <p className="gospel-excerpt">{t('gospelTitleSample')}</p>
            <button className="read-more">{t('reading')}</button>
          </div>
        </div>
      </div>

      <div className="feature-card rosary-card" onClick={() => setCurrentPage('rosary')}>
        <div className="card-header">
          <div className="rosary-icon">✿</div>
          <h3>{t('rosaryTitle')}</h3>
        </div>
        <p className="card-description">{t('rosarySubtitle')}</p>
      </div>

      <div className="quick-links">
        <div className="quick-link" onClick={() => setCurrentPage('prayers')}>
          <Heart size={20} />
          <span>{t('prayers')}</span>
        </div>
        <div className="quick-link" onClick={() => setCurrentPage('novena')}>
          <Calendar size={20} />
          <span>{t('novenas')}</span>
        </div>
      </div>
    </div>
  );

  // Rosary Page
  const RosaryPage = () => (
    <div className="page-content rosary-page">
      <div className="page-header">
        <h1>{t('rosaryTitle')}</h1>
        <p className="page-subtitle">{t('selectMystery')}</p>
      </div>

      {selectedMystery ? (
        <RosaryPrayer mystery={selectedMystery} />
      ) : (
        <div className="mysteries-grid">
          {Object.entries(mysteries).map(([key, mystery]) => {
            const progress = getTodayProgress(key);
            const completed = progress >= 53;
            return (
              <div
                key={key}
                className="mystery-card"
                style={{ borderColor: mystery.color }}
                onClick={() => setSelectedMystery({ key, ...mystery })}
              >
                <div className="mystery-header">
                  <h3>{mystery.name}</h3>
                  <div className="mystery-day">{mystery.day}</div>
                </div>
                <div className="mystery-progress">
                  <div className="progress-beads">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`bead ${i < Math.floor(progress / 5.3) ? 'completed' : ''}`}
                        style={{ backgroundColor: i < Math.floor(progress / 5.3) ? mystery.color : 'transparent' }}
                      />
                    ))}
                  </div>
                  {completed && <div className="completed-badge">✓ {t('completed')}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Rosary Prayer Component
  const RosaryPrayer = ({ mystery }) => {
    const [currentBead, setCurrentBead] = useState(getTodayProgress(mystery.key));
    const [currentMysteryIndex, setCurrentMysteryIndex] = useState(Math.floor(currentBead / 11));

    const advanceBead = () => {
      const newBead = currentBead + 1;
      setCurrentBead(newBead);
      updateProgress(mystery.key, newBead);
      setCurrentMysteryIndex(Math.floor(newBead / 11));
    };

    const beadType = currentBead % 11 === 0 ? t('ourFather') : t('hailMary');
    const beadText = currentBead % 11 === 0 ? t('ourFatherText') : t('hailMaryText');
    const currentMystery = mystery.mysteries[currentMysteryIndex];

    return (
      <div className="rosary-prayer">
        <button className="back-button" onClick={() => setSelectedMystery(null)}>
          ← {t('previous')}
        </button>
        
        <div className="prayer-card">
          <h2 style={{ color: mystery.color }}>{mystery.name}</h2>
          
          {currentBead < 53 ? (
            <>
              <div className="current-mystery">
                <span className="mystery-number">{currentMysteryIndex + 1}º {t('mystery')}</span>
                <h3>{currentMystery}</h3>
              </div>

              <div className="prayer-display">
                <div className="prayer-icon" style={{ backgroundColor: mystery.color }}>
                  {beadType === t('ourFather') ? '✕' : '✿'}
                </div>
                <h4>{beadType}</h4>
                <p className="prayer-text">{beadText}</p>
              </div>

              <div className="rosary-counter">
                <span>{currentBead + 1} / 53</span>
              </div>

              <button className="pray-button" onClick={advanceBead} style={{ backgroundColor: mystery.color }}>
                <Check size={20} />
                {t('next')}
              </button>
            </>
          ) : (
            <div className="completion-message">
              <div className="completion-icon">✓</div>
              <h3>{t('rosaryCompleted')}</h3>
              <p>{mystery.name}</p>
              <button 
                className="pray-button" 
                onClick={() => {
                  setCurrentBead(0);
                  updateProgress(mystery.key, 0);
                  setCurrentMysteryIndex(0);
                }}
                style={{ backgroundColor: mystery.color }}
              >
                {t('prayAgain')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Gospel Page
  const GospelPage = () => (
    <div className="page-content gospel-page">
      <div className="page-header">
        <h1>{t('gospelTitle')}</h1>
        <p className="page-subtitle">{t('gospelDate')}</p>
      </div>

      <div className="gospel-card-full">
        <div className="gospel-book-icon"></div>
        <h2>{t('gospelReference')}</h2>
        <h3>{t('gospelTitleSample')}</h3>
        <div className="gospel-text">
          {t('gospelTextSample').split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      <div className="reflection-section">
        <h3>{t('reflection')}</h3>
        <p>{t('gospelReflectionSample')}</p>
      </div>
    </div>
  );

  // Prayers Page
  const PrayersPage = () => (
    <div className="page-content prayers-page">
      <div className="page-header">
        <h1>{t('prayersTitle')}</h1>
        <p className="page-subtitle">{t('prayersSubtitle')}</p>
      </div>

      {prayers.map((prayer, index) => (
        <div key={index} className="prayer-card-full">
          <h3>{prayer.title}</h3>
          <p>{prayer.text}</p>
        </div>
      ))}
    </div>
  );

  // Novena Page
  const NovenaPage = () => (
    <div className="page-content novena-page">
      <div className="page-header">
        <h1>{t('novenasTitle')}</h1>
        <p className="page-subtitle">{t('novenasSubtitle')}</p>
      </div>

      <div className="novena-list">
        {[
          'Novena a Nossa Senhora Aparecida',
          'Novena ao Espírito Santo',
          'Novena a São José',
          'Novena ao Sagrado Coração de Jesus',
          'Novena a Santa Rita de Cássia'
        ].map((novena, i) => (
          <div key={i} className="novena-item">
            <span>{novena}</span>
            <ChevronRight size={20} />
          </div>
        ))}
      </div>
    </div>
  );

  const pages = {
    home: <HomePage />,
    rosary: <RosaryPage />,
    gospel: <GospelPage />,
    prayers: <PrayersPage />,
    novena: <NovenaPage />
  };

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .app-container {
          max-width: 428px;
          margin: 0 auto;
          min-height: 100vh;
          background: linear-gradient(180deg, #F5F0E8 0%, #E8DCC8 100%);
          position: relative;
          padding-bottom: 80px;
        }

        .page-content {
          padding: 24px 20px;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .greeting-card {
          background: linear-gradient(135deg, #8B6F47 0%, #A0826D 100%);
          padding: 32px 24px;
          border-radius: 20px;
          color: #FFF;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(139, 111, 71, 0.2);
        }

        .greeting {
          font-family: 'Crimson Text', serif;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .verse {
          font-size: 14px;
          opacity: 0.85;
          font-style: italic;
        }

        .feature-card {
          background: #FFF;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .card-badge {
          background: #D4AF37;
          color: #FFF;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .gospel-card {
          background: linear-gradient(135deg, #FFF8E7 0%, #FFF 100%);
        }

        .gospel-preview {
          display: flex;
          gap: 16px;
        }

        .gospel-image {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #E8D7B8 0%, #D4C5A9 100%);
          border-radius: 12px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .gospel-image::before {
          content: '📖';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 40px;
        }

        .gospel-info {
          flex: 1;
        }

        .gospel-date {
          font-size: 12px;
          color: #8B6F47;
          margin-bottom: 4px;
        }

        .gospel-title {
          font-family: 'Crimson Text', serif;
          font-size: 18px;
          font-weight: 700;
          color: #2C2416;
          margin-bottom: 8px;
        }

        .gospel-excerpt {
          font-size: 13px;
          color: #666;
          margin-bottom: 12px;
        }

        .read-more {
          background: #8B6F47;
          color: #FFF;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .read-more:hover {
          background: #6F5838;
        }

        .rosary-card {
          background: linear-gradient(135deg, #F0E6D2 0%, #E8DCC8 100%);
        }

        .rosary-icon {
          font-size: 28px;
          margin-right: 12px;
        }

        .card-header h3 {
          font-family: 'Crimson Text', serif;
          font-size: 20px;
          font-weight: 700;
          color: #2C2416;
        }

        .card-description {
          font-size: 14px;
          color: #666;
        }

        .quick-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }

        .quick-link {
          background: #FFF;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .quick-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .quick-link svg {
          color: #8B6F47;
        }

        .quick-link span {
          font-size: 13px;
          font-weight: 600;
          color: #2C2416;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-header h1 {
          font-family: 'Crimson Text', serif;
          font-size: 32px;
          font-weight: 700;
          color: #2C2416;
          margin-bottom: 4px;
        }

        .page-subtitle {
          font-size: 14px;
          color: #8B6F47;
        }

        .mysteries-grid {
          display: grid;
          gap: 16px;
        }

        .mystery-card {
          background: #FFF;
          border-radius: 16px;
          padding: 20px;
          border-left: 4px solid;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .mystery-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .mystery-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 16px;
        }

        .mystery-header h3 {
          font-family: 'Crimson Text', serif;
          font-size: 20px;
          font-weight: 700;
          color: #2C2416;
          flex: 1;
        }

        .mystery-day {
          background: #F5F0E8;
          color: #8B6F47;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }

        .mystery-progress {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .progress-beads {
          display: flex;
          gap: 6px;
        }

        .bead {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #D4C5A9;
          transition: all 0.3s;
        }

        .bead.completed {
          border-color: transparent;
          transform: scale(1.1);
        }

        .completed-badge {
          background: #4CAF50;
          color: #FFF;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }

        .rosary-prayer {
          max-width: 100%;
        }

        .back-button {
          background: none;
          border: none;
          color: #8B6F47;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 20px;
          padding: 8px 0;
        }

        .prayer-card {
          background: #FFF;
          border-radius: 20px;
          padding: 32px 24px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        }

        .prayer-card h2 {
          font-family: 'Crimson Text', serif;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 24px;
        }

        .current-mystery {
          text-align: center;
          margin-bottom: 32px;
          padding: 20px;
          background: #F9F6F0;
          border-radius: 12px;
        }

        .mystery-number {
          display: block;
          font-size: 12px;
          color: #8B6F47;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .current-mystery h3 {
          font-family: 'Crimson Text', serif;
          font-size: 20px;
          color: #2C2416;
        }

        .prayer-display {
          text-align: center;
          margin-bottom: 32px;
        }

        .prayer-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: #FFF;
          margin: 0 auto 20px;
        }

        .prayer-display h4 {
          font-family: 'Crimson Text', serif;
          font-size: 20px;
          color: #2C2416;
          margin-bottom: 16px;
        }

        .prayer-text {
          font-size: 15px;
          line-height: 1.7;
          color: #444;
          max-width: 90%;
          margin: 0 auto;
        }

        .rosary-counter {
          text-align: center;
          font-size: 14px;
          color: #8B6F47;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .pray-button {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          color: #FFF;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s;
        }

        .pray-button:hover {
          opacity: 0.9;
        }

        .completion-message {
          text-align: center;
          padding: 40px 20px;
        }

        .completion-icon {
          width: 100px;
          height: 100px;
          background: #4CAF50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: #FFF;
          margin: 0 auto 24px;
        }

        .completion-message h3 {
          font-family: 'Crimson Text', serif;
          font-size: 28px;
          color: #2C2416;
          margin-bottom: 12px;
        }

        .completion-message p {
          font-size: 16px;
          color: #666;
          margin-bottom: 32px;
        }

        .gospel-card-full {
          background: #FFF;
          border-radius: 20px;
          padding: 32px 24px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .gospel-book-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #D4AF37 0%, #B8960F 100%);
          border-radius: 12px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gospel-book-icon::before {
          content: '📖';
          font-size: 28px;
        }

        .gospel-card-full h2 {
          font-family: 'Crimson Text', serif;
          font-size: 24px;
          font-weight: 700;
          color: #8B6F47;
          text-align: center;
          margin-bottom: 8px;
        }

        .gospel-card-full h3 {
          font-family: 'Crimson Text', serif;
          font-size: 20px;
          font-weight: 600;
          color: #2C2416;
          text-align: center;
          margin-bottom: 24px;
        }

        .gospel-text p {
          font-size: 15px;
          line-height: 1.8;
          color: #333;
          margin-bottom: 16px;
          text-align: justify;
        }

        .reflection-section {
          background: #F9F6F0;
          border-radius: 16px;
          padding: 24px;
        }

        .reflection-section h3 {
          font-family: 'Crimson Text', serif;
          font-size: 20px;
          font-weight: 700;
          color: #8B6F47;
          margin-bottom: 12px;
        }

        .reflection-section p {
          font-size: 15px;
          line-height: 1.7;
          color: #444;
        }

        .prayer-card-full {
          background: #FFF;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .prayer-card-full h3 {
          font-family: 'Crimson Text', serif;
          font-size: 20px;
          font-weight: 700;
          color: #8B6F47;
          margin-bottom: 12px;
        }

        .prayer-card-full p {
          font-size: 15px;
          line-height: 1.7;
          color: #444;
        }

        .novena-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .novena-item {
          background: #FFF;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .novena-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .novena-item span {
          font-size: 15px;
          font-weight: 500;
          color: #2C2416;
        }

        .novena-item svg {
          color: #8B6F47;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          max-width: 428px;
          width: 100%;
          background: #FFF;
          border-top: 1px solid #E5DCC8;
          display: flex;
          justify-content: space-around;
          padding: 12px 0;
          box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .nav-item:hover {
          background: #F5F0E8;
        }

        .nav-item.active {
          color: #8B6F47;
        }

        .nav-item svg {
          color: #666;
        }

        .nav-item.active svg {
          color: #8B6F47;
        }

        .nav-item span {
          font-size: 11px;
          font-weight: 600;
          color: #666;
        }

        .nav-item.active span {
          color: #8B6F47;
        }
      `}</style>

      <div className="app-content">
        {pages[currentPage]}
      </div>

      <div className="bottom-nav">
        <div 
          className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          <Home size={24} />
          <span>{t('home')}</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'rosary' ? 'active' : ''}`}
          onClick={() => setCurrentPage('rosary')}
        >
          <span style={{ fontSize: '24px' }}>✿</span>
          <span>{t('rosary')}</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'gospel' ? 'active' : ''}`}
          onClick={() => setCurrentPage('gospel')}
        >
          <Book size={24} />
          <span>{t('gospel')}</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'prayers' ? 'active' : ''}`}
          onClick={() => setCurrentPage('prayers')}
        >
          <Heart size={24} />
          <span>{t('prayers')}</span>
        </div>
      </div>
    </div>
  );
}

export default function MappaCattolico() {
  return (
    <LanguageProvider>
      <MappaCattolicoContent />
    </LanguageProvider>
  );
}
