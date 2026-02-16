import React, { useState, useEffect } from 'react';
import { Calendar, Book, Heart, Home, Menu, ChevronRight, Check } from 'lucide-react';

export default function MappaCattolico() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMystery, setSelectedMystery] = useState(null);
  const [rosaryProgress, setRosaryProgress] = useState({});
  const [userName, setUserName] = useState('');

  // Initialize from memory
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem('rosaryProgress') || '{}');
    const savedName = localStorage.getItem('userName') || 'Amigo';
    setRosaryProgress(savedProgress);
    setUserName(savedName);
  }, []);

  // Save progress
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
      name: 'Mistérios Gozosos',
      day: 'Segunda e Sábado',
      color: '#D4AF37',
      mysteries: [
        'Anunciação do Anjo a Maria',
        'Visitação de Maria a Isabel',
        'Nascimento de Jesus',
        'Apresentação de Jesus no Templo',
        'Perda e Encontro do Menino Jesus'
      ]
    },
    luminosos: {
      name: 'Mistérios Luminosos',
      day: 'Quinta-feira',
      color: '#FFD700',
      mysteries: [
        'Batismo de Jesus no Jordão',
        'Bodas de Caná',
        'Anúncio do Reino de Deus',
        'Transfiguração de Jesus',
        'Instituição da Eucaristia'
      ]
    },
    dolorosos: {
      name: 'Mistérios Dolorosos',
      day: 'Terça e Sexta',
      color: '#8B4513',
      mysteries: [
        'Agonia de Jesus no Horto',
        'Flagelação de Jesus',
        'Coroação de Espinhos',
        'Jesus Carrega a Cruz',
        'Crucificação e Morte de Jesus'
      ]
    },
    gloriosos: {
      name: 'Mistérios Gloriosos',
      day: 'Quarta e Domingo',
      color: '#DAA520',
      mysteries: [
        'Ressurreição de Jesus',
        'Ascensão de Jesus ao Céu',
        'Vinda do Espírito Santo',
        'Assunção de Maria',
        'Coroação de Maria'
      ]
    }
  };

  const gospelReading = {
    date: '16 de fevereiro de 2026',
    reference: 'Lucas 20, 27-40',
    title: 'A Ressurreição dos Mortos',
    text: `Naquele tempo, aproximaram-se de Jesus alguns saduceus, que negam a ressurreição, e lhe perguntaram: "Mestre, Moisés nos deixou escrito: Se alguém morrer e deixar a mulher sem filhos, o irmão dele deve casar-se com a viúva e dar descendentes a seu irmão.

Havia sete irmãos. O primeiro casou-se e morreu sem filhos. O segundo casou-se com a viúva, e também morreu sem filhos. O terceiro casou-se com ela, e da mesma forma os sete; e morreram sem deixar filhos. Por fim, morreu também a mulher. 

Agora, na ressurreição, de qual deles ela será esposa? Porque os sete foram casados com ela."

Jesus respondeu: "Os filhos deste mundo casam-se; mas os que são julgados dignos de participar do mundo futuro e da ressurreição dos mortos, não se casam mais, porque não podem mais morrer, pois são iguais aos anjos e são filhos de Deus, sendo filhos da ressurreição."`
  };

  const prayers = [
    {
      title: 'Ave Maria',
      text: 'Ave Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.'
    },
    {
      title: 'Pai Nosso',
      text: 'Pai nosso, que estais no céu, santificado seja o vosso nome, venha a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje, perdoai as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.'
    },
    {
      title: 'Glória ao Pai',
      text: 'Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.'
    },
    {
      title: 'Salve Rainha',
      text: 'Salve, Rainha, mãe de misericórdia, vida, doçura, esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria.'
    }
  ];

  // Home Page
  const HomePage = () => (
    <div className="page-content">
      <div className="greeting-card">
        <h1 className="greeting">Ciao, {userName}.</h1>
        <p className="subtitle">Benvenuto in Mappa della Bibbia</p>
        <p className="verse">La pace di Gesù e l'amore di Maria ✨</p>
      </div>

      <div className="feature-card gospel-card" onClick={() => setCurrentPage('gospel')}>
        <div className="card-header">
          <Book size={24} />
          <span className="card-badge">Hoje</span>
        </div>
        <div className="gospel-preview">
          <div className="gospel-image"></div>
          <div className="gospel-info">
            <p className="gospel-date">{gospelReading.date}</p>
            <h3 className="gospel-title">{gospelReading.reference}</h3>
            <p className="gospel-excerpt">{gospelReading.title}</p>
            <button className="read-more">Leggi di più</button>
          </div>
        </div>
      </div>

      <div className="feature-card rosary-card" onClick={() => setCurrentPage('rosary')}>
        <div className="card-header">
          <div className="rosary-icon">✿</div>
          <h3>Rosário Diário</h3>
        </div>
        <p className="card-description">Recita il Santo Rosario con i misteri del giorno</p>
      </div>

      <div className="quick-links">
        <div className="quick-link" onClick={() => setCurrentPage('prayers')}>
          <Heart size={20} />
          <span>Orações</span>
        </div>
        <div className="quick-link" onClick={() => setCurrentPage('novena')}>
          <Calendar size={20} />
          <span>Novenas</span>
        </div>
      </div>
    </div>
  );

  // Rosary Page
  const RosaryPage = () => (
    <div className="page-content rosary-page">
      <div className="page-header">
        <h1>Rosário Diário</h1>
        <p className="page-subtitle">Escolha os Mistérios para meditar</p>
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
                  {completed && <div className="completed-badge">✓ Completo</div>}
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

    const beadType = currentBead % 11 === 0 ? 'Pai Nosso' : 'Ave Maria';
    const currentMystery = mystery.mysteries[currentMysteryIndex];

    return (
      <div className="rosary-prayer">
        <button className="back-button" onClick={() => setSelectedMystery(null)}>
          ← Voltar
        </button>
        
        <div className="prayer-card">
          <h2 style={{ color: mystery.color }}>{mystery.name}</h2>
          
          {currentBead < 53 ? (
            <>
              <div className="current-mystery">
                <span className="mystery-number">{currentMysteryIndex + 1}º Mistério</span>
                <h3>{currentMystery}</h3>
              </div>

              <div className="prayer-display">
                <div className="prayer-icon" style={{ backgroundColor: mystery.color }}>
                  {beadType === 'Pai Nosso' ? '✕' : '✿'}
                </div>
                <h4>{beadType}</h4>
                <p className="prayer-text">
                  {beadType === 'Ave Maria' ? prayers[0].text : prayers[1].text}
                </p>
              </div>

              <div className="rosary-counter">
                <span>{currentBead + 1} / 53</span>
              </div>

              <button className="pray-button" onClick={advanceBead} style={{ backgroundColor: mystery.color }}>
                <Check size={20} />
                Rezar e Avançar
              </button>
            </>
          ) : (
            <div className="completion-message">
              <div className="completion-icon">✓</div>
              <h3>Rosário Completo!</h3>
              <p>Você completou os {mystery.name} hoje.</p>
              <button 
                className="pray-button" 
                onClick={() => {
                  setCurrentBead(0);
                  updateProgress(mystery.key, 0);
                  setCurrentMysteryIndex(0);
                }}
                style={{ backgroundColor: mystery.color }}
              >
                Rezar Novamente
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
        <h1>Evangelho do Dia</h1>
        <p className="page-subtitle">{gospelReading.date}</p>
      </div>

      <div className="gospel-card-full">
        <div className="gospel-book-icon"></div>
        <h2>{gospelReading.reference}</h2>
        <h3>{gospelReading.title}</h3>
        <div className="gospel-text">
          {gospelReading.text.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      <div className="reflection-section">
        <h3>Reflexão</h3>
        <p>Jesus nos ensina sobre a vida eterna e a ressurreição. A vida após a morte não é uma continuação desta vida terrena, mas uma nova realidade onde seremos como anjos, filhos de Deus na glória eterna.</p>
      </div>
    </div>
  );

  // Prayers Page
  const PrayersPage = () => (
    <div className="page-content prayers-page">
      <div className="page-header">
        <h1>Orações</h1>
        <p className="page-subtitle">Orações tradicionais católicas</p>
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
        <h1>Novenas</h1>
        <p className="page-subtitle">Novenas e devoções especiais</p>
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

        /* Greeting Card */
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

        /* Feature Cards */
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

        /* Quick Links */
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

        /* Page Header */
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

        /* Mysteries Grid */
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

        /* Rosary Prayer */
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

        /* Gospel Page */
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

        /* Prayers Page */
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

        /* Novena Page */
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

        /* Bottom Navigation */
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
          <span>Início</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'rosary' ? 'active' : ''}`}
          onClick={() => setCurrentPage('rosary')}
        >
          <span style={{ fontSize: '24px' }}>✿</span>
          <span>Rosário</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'gospel' ? 'active' : ''}`}
          onClick={() => setCurrentPage('gospel')}
        >
          <Book size={24} />
          <span>Evangelho</span>
        </div>
        <div 
          className={`nav-item ${currentPage === 'prayers' ? 'active' : ''}`}
          onClick={() => setCurrentPage('prayers')}
        >
          <Heart size={24} />
          <span>Orações</span>
        </div>
      </div>
    </div>
  );
}
