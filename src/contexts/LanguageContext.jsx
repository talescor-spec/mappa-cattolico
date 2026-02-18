// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  it: {
    // Header
    appTitle: "Mappa del Cattolico",
    appSubtitle: "Il tuo compagno quotidiano di fede",
    greeting: "Ciao",
    peaceBless: "La pace di Gesù e l'amore di Maria ✨",
    
    // Navigation
    home: "Home",
    rosary: "Rosario",
    gospel: "Evangelo",
    liturgy: "Liturgia",
    prayers: "Orazioni",
    novenas: "Novene",
    bible: "Piano Bibbia",
    
    // Buttons
    readMore: "Leggi di più",
    reading: "Lettura",
    next: "Avanti",
    previous: "Indietro",
    finish: "Termina",
    start: "Inizia",
    continue: "Continua",
    close: "Chiudi",
    
    // Rosary
    rosaryTitle: "Santo Rosario",
    rosarySubtitle: "Prega con i misteri del giorno",
    mysteriesJoyful: "Misteri Gaudiosi",
    mysteriesLuminous: "Misteri Luminosi",
    mysteriesSorrowful: "Misteri Dolorosi",
    mysteriesGlorious: "Misteri Gloriosi",
    selectMystery: "Scegli i Misteri da meditare",
    startRosary: "Inizia Rosario",
    mystery: "Mistero",
    bead: "Grano",
    completed: "Completo",
    progress: "Progresso",
    prayAgain: "Prega di Nuovo",
    rosaryCompleted: "Rosario Completo!",
    
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
    
    // Prayers Names
    ourFather: "Padre Nostro",
    hailMary: "Ave Maria",
    gloryBe: "Gloria al Padre",
    fatimaPrayer: "Preghiera di Fatima",
    apostlesCreed: "Credo degli Apostoli",
    hailHolyQueen: "Salve Regina",
    
    // Full Prayer Texts
    ourFatherText: "Padre nostro, che sei nei cieli, sia santificato il tuo nome, venga il tuo regno, sia fatta la tua volontà, come in cielo così in terra. Dacci oggi il nostro pane quotidiano, e rimetti a noi i nostri debiti come anche noi li rimettiamo ai nostri debitori, e non abbandonarci alla tentazione, ma liberaci dal male. Amen.",
    
    hailMaryText: "Ave, o Maria, piena di grazia, il Signore è con te. Tu sei benedetta fra le donne e benedetto è il frutto del tuo seno, Gesù. Santa Maria, Madre di Dio, prega per noi peccatori, adesso e nell'ora della nostra morte. Amen.",
    
    gloryBeText: "Gloria al Padre e al Figlio e allo Spirito Santo. Come era nel principio, e ora e sempre nei secoli dei secoli. Amen.",
    
    hailHolyQueenText: "Salve, Regina, madre di misericordia, vita, dolcezza e speranza nostra, salve. A te ricorriamo, esuli figli di Eva; a te sospiriamo, gementi e piangenti in questa valle di lacrime. Orsù dunque, avvocata nostra, rivolgi a noi gli occhi tuoi misericordiosi. E mostraci, dopo questo esilio, Gesù, il frutto benedetto del tuo seno. O clemente, o pia, o dolce Vergine Maria.",
    
    // Gospel
    gospelTitle: "Evangelo del Giorno",
    gospelSubtitle: "Lettura e riflessione quotidiana",
    todayGospel: "Oggi",
    reflection: "Riflessione",
    
    // Gospel Sample Text
    gospelDate: "16 febbraio 2026",
    gospelReference: "Luca 20, 27-40",
    gospelTitleSample: "La Risurrezione dei Morti",
    gospelTextSample: "In quel tempo, si avvicinarono a Gesù alcuni sadducei – i quali dicono che non c'è risurrezione – e gli posero questa domanda: «Maestro, Mosè ci ha prescritto: Se muore il fratello di qualcuno che ha moglie, ma è senza figli, suo fratello prenda la moglie e dia una discendenza al proprio fratello.\n\nC'erano dunque sette fratelli: il primo, dopo aver preso moglie, morì senza figli. Allora la prese il secondo e poi il terzo e così tutti e sette morirono senza lasciare figli. Da ultimo morì anche la donna.\n\nLa donna dunque, alla risurrezione, di chi sarà moglie? Poiché tutti e sette l'hanno avuta in moglie».\n\nGesù rispose loro: «I figli di questo mondo prendono moglie e prendono marito; ma quelli che sono giudicati degni della vita futura e della risurrezione dai morti, non prendono né moglie né marito: infatti non possono più morire, perché sono uguali agli angeli e, poiché sono figli della risurrezione, sono figli di Dio».",
    
    gospelReflectionSample: "Gesù ci insegna sulla vita eterna e la risurrezione. La vita dopo la morte non è una continuazione di questa vita terrena, ma una nuova realtà dove saremo come angeli, figli di Dio nella gloria eterna.",
    
    // Liturgy
    liturgyTitle: "Liturgia Quotidiana",
    liturgySubtitle: "Letture del giorno",
    firstReading: "Prima Lettura",
    psalm: "Salmo Responsoriale",
    secondReading: "Seconda Lettura",
    
    // Prayers
    prayersTitle: "Orazioni Tradizionali",
    prayersSubtitle: "Preghiere cattoliche",
    
    // Novenas
    novenasTitle: "Novene",
    novenasSubtitle: "9 giorni di preghiera",
    day: "Giorno",
    
    // Days of week
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",
    sunday: "Domenica",
    
    // Common
    markComplete: "Segna come Completato",
    reset: "Ricomincia",
  },
  
  en: {
    // Header
    appTitle: "Catholic Map",
    appSubtitle: "Your daily faith companion",
    greeting: "Hello",
    peaceBless: "The peace of Jesus and the love of Mary ✨",
    
    // Navigation
    home: "Home",
    rosary: "Rosary",
    gospel: "Gospel",
    liturgy: "Liturgy",
    prayers: "Prayers",
    novenas: "Novenas",
    bible: "Bible Plan",
    
    // Buttons
    readMore: "Read More",
    reading: "Reading",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    start: "Start",
    continue: "Continue",
    close: "Close",
    
    // Rosary
    rosaryTitle: "Holy Rosary",
    rosarySubtitle: "Pray with the mysteries of the day",
    mysteriesJoyful: "Joyful Mysteries",
    mysteriesLuminous: "Luminous Mysteries",
    mysteriesSorrowful: "Sorrowful Mysteries",
    mysteriesGlorious: "Glorious Mysteries",
    selectMystery: "Choose the Mysteries to meditate",
    startRosary: "Start Rosary",
    mystery: "Mystery",
    bead: "Bead",
    completed: "Complete",
    progress: "Progress",
    prayAgain: "Pray Again",
    rosaryCompleted: "Rosary Complete!",
    
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
    
    // Prayers Names
    ourFather: "Our Father",
    hailMary: "Hail Mary",
    gloryBe: "Glory Be",
    fatimaPrayer: "Fatima Prayer",
    apostlesCreed: "Apostles' Creed",
    hailHolyQueen: "Hail Holy Queen",
    
    // Full Prayer Texts
    ourFatherText: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
    
    hailMaryText: "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
    
    gloryBeText: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
    
    hailHolyQueenText: "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve: to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious Advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.",
    
    // Gospel
    gospelTitle: "Gospel of the Day",
    gospelSubtitle: "Daily reading and reflection",
    todayGospel: "Today",
    reflection: "Reflection",
    
    // Gospel Sample Text
    gospelDate: "February 16, 2026",
    gospelReference: "Luke 20:27-40",
    gospelTitleSample: "The Resurrection of the Dead",
    gospelTextSample: "Some Sadducees, those who deny that there is a resurrection, came to Jesus and asked him a question, \"Teacher, Moses wrote for us that if a man's brother dies, leaving a wife but no children, the man shall marry the widow and raise up children for his brother.\n\nNow there were seven brothers; the first married, and died childless; then the second and the third married her, and so in the same way all seven died childless. Finally the woman also died.\n\nIn the resurrection, therefore, whose wife will the woman be? For the seven had married her.\"\n\nJesus said to them, \"Those who belong to this age marry and are given in marriage; but those who are considered worthy of a place in that age and in the resurrection from the dead neither marry nor are given in marriage. Indeed they cannot die anymore, because they are like angels and are children of God, being children of the resurrection.\"",
    
    gospelReflectionSample: "Jesus teaches us about eternal life and resurrection. Life after death is not a continuation of this earthly life, but a new reality where we will be like angels, children of God in eternal glory.",
    
    // Liturgy
    liturgyTitle: "Daily Liturgy",
    liturgySubtitle: "Readings of the day",
    firstReading: "First Reading",
    psalm: "Responsorial Psalm",
    secondReading: "Second Reading",
    
    // Prayers
    prayersTitle: "Traditional Prayers",
    prayersSubtitle: "Catholic prayers",
    
    // Novenas
    novenasTitle: "Novenas",
    novenasSubtitle: "9 days of prayer",
    day: "Day",
    
    // Days of week
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    
    // Common
    markComplete: "Mark as Complete",
    reset: "Reset",
  },
  
  pt: {
    // Header
    appTitle: "Mapa do Católico",
    appSubtitle: "Seu companheiro diário de fé",
    greeting: "Olá",
    peaceBless: "A paz de Jesus e o amor de Maria ✨",
    
    // Navigation
    home: "Início",
    rosary: "Rosário",
    gospel: "Evangelho",
    liturgy: "Liturgia",
    prayers: "Orações",
    novenas: "Novenas",
    bible: "Plano Bíblia",
    
    // Buttons
    readMore: "Ler Mais",
    reading: "Leitura",
    next: "Avançar",
    previous: "Voltar",
    finish: "Finalizar",
    start: "Iniciar",
    continue: "Continuar",
    close: "Fechar",
    
    // Rosary
    rosaryTitle: "Santo Rosário",
    rosarySubtitle: "Reze com os mistérios do dia",
    mysteriesJoyful: "Mistérios Gozosos",
    mysteriesLuminous: "Mistérios Luminosos",
    mysteriesSorrowful: "Mistérios Dolorosos",
    mysteriesGlorious: "Mistérios Gloriosos",
    selectMystery: "Escolha os Mistérios para meditar",
    startRosary: "Iniciar Rosário",
    mystery: "Mistério",
    bead: "Conta",
    completed: "Concluído",
    progress: "Progresso",
    prayAgain: "Rezar Novamente",
    rosaryCompleted: "Rosário Completo!",
    
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
    
    // Prayers Names
    ourFather: "Pai Nosso",
    hailMary: "Ave Maria",
    gloryBe: "Glória ao Pai",
    fatimaPrayer: "Oração de Fátima",
    apostlesCreed: "Credo dos Apóstolos",
    hailHolyQueen: "Salve Rainha",
    
    // Full Prayer Texts
    ourFatherText: "Pai nosso, que estais no céu, santificado seja o vosso nome, venha a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje, perdoai as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.",
    
    hailMaryText: "Ave Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.",
    
    gloryBeText: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.",
    
    hailHolyQueenText: "Salve, Rainha, mãe de misericórdia, vida, doçura, esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria.",
    
    // Gospel
    gospelTitle: "Evangelho do Dia",
    gospelSubtitle: "Leitura e reflexão diária",
    todayGospel: "Hoje",
    reflection: "Reflexão",
    
    // Gospel Sample Text
    gospelDate: "16 de fevereiro de 2026",
    gospelReference: "Lucas 20, 27-40",
    gospelTitleSample: "A Ressurreição dos Mortos",
    gospelTextSample: "Naquele tempo, aproximaram-se de Jesus alguns saduceus, que negam a ressurreição, e lhe perguntaram: \"Mestre, Moisés nos deixou escrito: Se alguém morrer e deixar a mulher sem filhos, o irmão dele deve casar-se com a viúva e dar descendentes a seu irmão.\n\nHavia sete irmãos. O primeiro casou-se e morreu sem filhos. O segundo casou-se com a viúva, e também morreu sem filhos. O terceiro casou-se com ela, e da mesma forma os sete; e morreram sem deixar filhos. Por fim, morreu também a mulher.\n\nAgora, na ressurreição, de qual deles ela será esposa? Porque os sete foram casados com ela.\"\n\nJesus respondeu: \"Os filhos deste mundo casam-se; mas os que são julgados dignos de participar do mundo futuro e da ressurreição dos mortos, não se casam mais, porque não podem mais morrer, pois são iguais aos anjos e são filhos de Deus, sendo filhos da ressurreição.\"",
    
    gospelReflectionSample: "Jesus nos ensina sobre a vida eterna e a ressurreição. A vida após a morte não é uma continuação desta vida terrena, mas uma nova realidade onde seremos como anjos, filhos de Deus na glória eterna.",
    
    // Liturgy
    liturgyTitle: "Liturgia Diária",
    liturgySubtitle: "Leituras do dia",
    firstReading: "Primeira Leitura",
    psalm: "Salmo Responsorial",
    secondReading: "Segunda Leitura",
    
    // Prayers
    prayersTitle: "Orações Tradicionais",
    prayersSubtitle: "Orações católicas",
    
    // Novenas
    novenasTitle: "Novenas",
    novenasSubtitle: "9 dias de oração",
    day: "Dia",
    
    // Days of week
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
    
    // Common
    markComplete: "Marcar como Concluído",
    reset: "Reiniciar",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('appLanguage');
    return saved || 'it';
  });

  useEffect(() => {
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
