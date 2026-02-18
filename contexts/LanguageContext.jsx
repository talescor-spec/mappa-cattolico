// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  it: {
    // Header
    appTitle: "Mappa del Cattolico",
    appSubtitle: "Il tuo compagno quotidiano di fede",
    
    // Navigation
    rosary: "Rosario",
    gospel: "Evangelo",
    liturgy: "Liturgia",
    prayers: "Orazioni",
    novenas: "Novene",
    bible: "Piano Bibbia",
    
    // Rosary
    rosaryTitle: "Santo Rosario",
    rosarySubtitle: "Prega con i misteri del giorno",
    mysteriesJoyful: "Misteri Gaudiosi",
    mysteriesLuminous: "Misteri Luminosi",
    mysteriesSorrowful: "Misteri Dolorosi",
    mysteriesGlorious: "Misteri Gloriosi",
    selectMystery: "Seleziona Mistero",
    startRosary: "Inizia Rosario",
    ourFather: "Padre Nostro",
    hailMary: "Ave Maria",
    gloryBe: "Gloria al Padre",
    fatimaPrayer: "Preghiera di Fatima",
    apostlesCreed: "Credo degli Apostoli",
    hailHolyQueen: "Salve Regina",
    mystery: "Mistero",
    bead: "Grano",
    completed: "Completato",
    progress: "Progresso",
    
    // Joyful Mysteries
    joyful1: "L'Annunciazione",
    joyful2: "La Visitazione",
    joyful3: "La Nascita di Gesù",
    joyful4: "La Presentazione al Tempio",
    joyful5: "Il Ritrovamento nel Tempio",
    
    // Luminous Mysteries
    luminous1: "Il Battesimo di Gesù",
    luminous2: "Le Nozze di Cana",
    luminous3: "L'Annuncio del Regno",
    luminous4: "La Trasfigurazione",
    luminous5: "L'Istituzione dell'Eucaristia",
    
    // Sorrowful Mysteries
    sorrowful1: "L'Agonia nel Getsemani",
    sorrowful2: "La Flagellazione",
    sorrowful3: "La Coronazione di Spine",
    sorrowful4: "Il Viaggio al Calvario",
    sorrowful5: "La Crocifissione",
    
    // Glorious Mysteries
    glorious1: "La Risurrezione",
    glorious2: "L'Ascensione",
    glorious3: "La Discesa dello Spirito Santo",
    glorious4: "L'Assunzione di Maria",
    glorious5: "L'Incoronazione di Maria",
    
    // Gospel
    gospelTitle: "Evangelo del Giorno",
    gospelSubtitle: "Lettura e riflessione quotidiana",
    reading: "Lettura",
    reflection: "Riflessione",
    todayGospel: "Evangelo di Oggi",
    
    // Liturgy
    liturgyTitle: "Liturgia Quotidiana",
    liturgySubtitle: "Letture del giorno",
    firstReading: "Prima Lettura",
    psalm: "Salmo Responsoriale",
    secondReading: "Seconda Lettura",
    gospel: "Evangelo",
    
    // Prayers
    prayersTitle: "Orazioni Tradizionali",
    prayersSubtitle: "Preghiere cattoliche",
    
    // Novenas
    novenasTitle: "Novene",
    novenasSubtitle: "9 giorni di preghiera",
    day: "Giorno",
    
    // Bible Plan
    bibleTitle: "Piano Bibbia 365 Giorni",
    bibleSubtitle: "Leggi tutta la Bibbia in un anno",
    readToday: "Leggi Oggi",
    daysCompleted: "Giorni Completati",
    oldTestament: "Antico Testamento",
    newTestament: "Nuovo Testamento",
    
    // Common
    close: "Chiudi",
    next: "Avanti",
    previous: "Indietro",
    finish: "Termina",
    start: "Inizia",
    continue: "Continua",
    markComplete: "Segna come Completato",
    reset: "Ricomincia",
    
    // Days of week
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",
    sunday: "Domenica",
  },
  
  en: {
    // Header
    appTitle: "Catholic Map",
    appSubtitle: "Your daily faith companion",
    
    // Navigation
    rosary: "Rosary",
    gospel: "Gospel",
    liturgy: "Liturgy",
    prayers: "Prayers",
    novenas: "Novenas",
    bible: "Bible Plan",
    
    // Rosary
    rosaryTitle: "Holy Rosary",
    rosarySubtitle: "Pray with the mysteries of the day",
    mysteriesJoyful: "Joyful Mysteries",
    mysteriesLuminous: "Luminous Mysteries",
    mysteriesSorrowful: "Sorrowful Mysteries",
    mysteriesGlorious: "Glorious Mysteries",
    selectMystery: "Select Mystery",
    startRosary: "Start Rosary",
    ourFather: "Our Father",
    hailMary: "Hail Mary",
    gloryBe: "Glory Be",
    fatimaPrayer: "Fatima Prayer",
    apostlesCreed: "Apostles' Creed",
    hailHolyQueen: "Hail Holy Queen",
    mystery: "Mystery",
    bead: "Bead",
    completed: "Completed",
    progress: "Progress",
    
    // Joyful Mysteries
    joyful1: "The Annunciation",
    joyful2: "The Visitation",
    joyful3: "The Nativity",
    joyful4: "The Presentation",
    joyful5: "Finding in the Temple",
    
    // Luminous Mysteries
    luminous1: "The Baptism of Jesus",
    luminous2: "The Wedding at Cana",
    luminous3: "The Proclamation of the Kingdom",
    luminous4: "The Transfiguration",
    luminous5: "The Institution of the Eucharist",
    
    // Sorrowful Mysteries
    sorrowful1: "The Agony in the Garden",
    sorrowful2: "The Scourging",
    sorrowful3: "The Crowning with Thorns",
    sorrowful4: "The Carrying of the Cross",
    sorrowful5: "The Crucifixion",
    
    // Glorious Mysteries
    glorious1: "The Resurrection",
    glorious2: "The Ascension",
    glorious3: "The Descent of the Holy Spirit",
    glorious4: "The Assumption of Mary",
    glorious5: "The Coronation of Mary",
    
    // Gospel
    gospelTitle: "Gospel of the Day",
    gospelSubtitle: "Daily reading and reflection",
    reading: "Reading",
    reflection: "Reflection",
    todayGospel: "Today's Gospel",
    
    // Liturgy
    liturgyTitle: "Daily Liturgy",
    liturgySubtitle: "Readings of the day",
    firstReading: "First Reading",
    psalm: "Responsorial Psalm",
    secondReading: "Second Reading",
    gospel: "Gospel",
    
    // Prayers
    prayersTitle: "Traditional Prayers",
    prayersSubtitle: "Catholic prayers",
    
    // Novenas
    novenasTitle: "Novenas",
    novenasSubtitle: "9 days of prayer",
    day: "Day",
    
    // Bible Plan
    bibleTitle: "365 Day Bible Plan",
    bibleSubtitle: "Read the entire Bible in one year",
    readToday: "Read Today",
    daysCompleted: "Days Completed",
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    
    // Common
    close: "Close",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    start: "Start",
    continue: "Continue",
    markComplete: "Mark as Complete",
    reset: "Reset",
    
    // Days of week
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },
  
  pt: {
    // Header
    appTitle: "Mapa do Católico",
    appSubtitle: "Seu companheiro diário de fé",
    
    // Navigation
    rosary: "Rosário",
    gospel: "Evangelho",
    liturgy: "Liturgia",
    prayers: "Orações",
    novenas: "Novenas",
    bible: "Plano Bíblia",
    
    // Rosary
    rosaryTitle: "Santo Rosário",
    rosarySubtitle: "Reze com os mistérios do dia",
    mysteriesJoyful: "Mistérios Gozosos",
    mysteriesLuminous: "Mistérios Luminosos",
    mysteriesSorrowful: "Mistérios Dolorosos",
    mysteriesGlorious: "Mistérios Gloriosos",
    selectMystery: "Selecionar Mistério",
    startRosary: "Iniciar Rosário",
    ourFather: "Pai Nosso",
    hailMary: "Ave Maria",
    gloryBe: "Glória ao Pai",
    fatimaPrayer: "Oração de Fátima",
    apostlesCreed: "Credo dos Apóstolos",
    hailHolyQueen: "Salve Rainha",
    mystery: "Mistério",
    bead: "Conta",
    completed: "Concluído",
    progress: "Progresso",
    
    // Joyful Mysteries
    joyful1: "A Anunciação",
    joyful2: "A Visitação",
    joyful3: "O Nascimento de Jesus",
    joyful4: "A Apresentação no Templo",
    joyful5: "O Encontro no Templo",
    
    // Luminous Mysteries
    luminous1: "O Batismo de Jesus",
    luminous2: "As Bodas de Caná",
    luminous3: "O Anúncio do Reino",
    luminous4: "A Transfiguração",
    luminous5: "A Instituição da Eucaristia",
    
    // Sorrowful Mysteries
    sorrowful1: "A Agonia no Horto",
    sorrowful2: "A Flagelação",
    sorrowful3: "A Coroação de Espinhos",
    sorrowful4: "O Caminho do Calvário",
    sorrowful5: "A Crucificação",
    
    // Glorious Mysteries
    glorious1: "A Ressurreição",
    glorious2: "A Ascensão",
    glorious3: "A Descida do Espírito Santo",
    glorious4: "A Assunção de Maria",
    glorious5: "A Coroação de Maria",
    
    // Gospel
    gospelTitle: "Evangelho do Dia",
    gospelSubtitle: "Leitura e reflexão diária",
    reading: "Leitura",
    reflection: "Reflexão",
    todayGospel: "Evangelho de Hoje",
    
    // Liturgy
    liturgyTitle: "Liturgia Diária",
    liturgySubtitle: "Leituras do dia",
    firstReading: "Primeira Leitura",
    psalm: "Salmo Responsorial",
    secondReading: "Segunda Leitura",
    gospel: "Evangelho",
    
    // Prayers
    prayersTitle: "Orações Tradicionais",
    prayersSubtitle: "Orações católicas",
    
    // Novenas
    novenasTitle: "Novenas",
    novenasSubtitle: "9 dias de oração",
    day: "Dia",
    
    // Bible Plan
    bibleTitle: "Plano Bíblia 365 Dias",
    bibleSubtitle: "Leia toda a Bíblia em um ano",
    readToday: "Ler Hoje",
    daysCompleted: "Dias Concluídos",
    oldTestament: "Antigo Testamento",
    newTestament: "Novo Testamento",
    
    // Common
    close: "Fechar",
    next: "Próximo",
    previous: "Anterior",
    finish: "Finalizar",
    start: "Iniciar",
    continue: "Continuar",
    markComplete: "Marcar como Concluído",
    reset: "Reiniciar",
    
    // Days of week
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Tentar pegar idioma salvo
    const saved = localStorage.getItem('appLanguage');
    return saved || 'it'; // Italiano como padrão
  });

  useEffect(() => {
    // Salvar idioma quando mudar
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
