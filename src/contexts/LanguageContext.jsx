// src/contexts/LanguageContext.jsx - VERSÃO LIMPA E TESTADA
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Função para formatar data
const formatDate = (language) => {
  const date = new Date();
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const locales = {
    it: 'it-IT',
    en: 'en-US',
    pt: 'pt-BR'
  };
  
  return date.toLocaleDateString(locales[language], options);
};

export const translations = {
  it: {
    // Header
    appTitle: "Mappa del Cattolico",
    appSubtitle: "Il tuo compagno quotidiano di fede",
    greeting: "Ciao",
    peaceBless: "La pace di Gesù e l'amore di Maria ✨",
    defaultName: "Amico",
    
    // Name Edit
    editName: "Modifica Nome",
    enterYourName: "Inserisci il tuo nome",
    save: "Salva",
    cancel: "Annulla",
    
    // Navigation
    home: "Home",
    rosary: "Rosario",
    gospel: "Evangelo",
    prayers: "Orazioni",
    novenas: "Novene",
    
    // Buttons
    reading: "Lettura",
    next: "Avanti",
    previous: "Indietro",
    
    // Rosary
    rosaryTitle: "Santo Rosario",
    rosarySubtitle: "Prega con i misteri del giorno",
    mysteriesJoyful: "Misteri Gaudiosi",
    mysteriesLuminous: "Misteri Luminosi",
    mysteriesSorrowful: "Misteri Dolorosi",
    mysteriesGlorious: "Misteri Gloriosi",
    selectMystery: "Scegli i Misteri da meditare",
    mystery: "Mistero",
    completed: "Completo",
    prayAgain: "Prega di Nuovo",
    rosaryCompleted: "Rosario Completo!",
    
    // Mysteries
    joyful1: "L'Annunciazione",
    joyful2: "La Visitazione",
    joyful3: "La Nascita di Gesù",
    joyful4: "La Presentazione al Tempio",
    joyful5: "Il Ritrovamento nel Tempio",
    
    luminous1: "Il Battesimo di Gesù",
    luminous2: "Le Nozze di Cana",
    luminous3: "L'Annuncio del Regno",
    luminous4: "La Trasfigurazione",
    luminous5: "L'Istituzione dell'Eucaristia",
    
    sorrowful1: "L'Agonia nel Getsemani",
    sorrowful2: "La Flagellazione",
    sorrowful3: "La Coronazione di Spine",
    sorrowful4: "Il Viaggio al Calvario",
    sorrowful5: "La Crocifissione",
    
    glorious1: "La Risurrezione",
    glorious2: "L'Ascensione",
    glorious3: "La Discesa dello Spirito Santo",
    glorious4: "L'Assunzione di Maria",
    glorious5: "L'Incoronazione di Maria",
    
    // Prayers
    ourFather: "Padre Nostro",
    hailMary: "Ave Maria",
    gloryBe: "Gloria al Padre",
    hailHolyQueen: "Salve Regina",
    
    ourFatherText: "Padre nostro, che sei nei cieli, sia santificato il tuo nome, venga il tuo regno, sia fatta la tua volontà, come in cielo così in terra. Dacci oggi il nostro pane quotidiano, e rimetti a noi i nostri debiti come anche noi li rimettiamo ai nostri debitori, e non abbandonarci alla tentazione, ma liberaci dal male. Amen.",
    
    hailMaryText: "Ave, o Maria, piena di grazia, il Signore è con te. Tu sei benedetta fra le donne e benedetto è il frutto del tuo seno, Gesù. Santa Maria, Madre di Dio, prega per noi peccatori, adesso e nell'ora della nostra morte. Amen.",
    
    gloryBeText: "Gloria al Padre e al Figlio e allo Spirito Santo. Come era nel principio, e ora e sempre nei secoli dei secoli. Amen.",
    
    hailHolyQueenText: "Salve, Regina, madre di misericordia, vita, dolcezza e speranza nostra, salve. A te ricorriamo, esuli figli di Eva; a te sospiriamo, gementi e piangenti in questa valle di lacrime. Orsù dunque, avvocata nostra, rivolgi a noi gli occhi tuoi misericordiosi. E mostraci, dopo questo esilio, Gesù, il frutto benedetto del tuo seno. O clemente, o pia, o dolce Vergine Maria.",
    
    // Gospel
    gospelTitle: "Evangelo del Giorno",
    todayGospel: "Oggi",
    reflection: "Riflessione",
    gospelReference: "Luca 20, 27-40",
    gospelTitleSample: "La Risurrezione dei Morti",
    gospelTextSample: "In quel tempo, si avvicinarono a Gesù alcuni sadducei – i quali dicono che non c'è risurrezione – e gli posero questa domanda: «Maestro, Mosè ci ha prescritto: Se muore il fratello di qualcuno che ha moglie, ma è senza figli, suo fratello prenda la moglie e dia una discendenza al proprio fratello.\n\nC'erano dunque sette fratelli: il primo, dopo aver preso moglie, morì senza figli. Allora la prese il secondo e poi il terzo e così tutti e sette morirono senza lasciare figli. Da ultimo morì anche la donna.\n\nLa donna dunque, alla risurrezione, di chi sarà moglie? Poiché tutti e sette l'hanno avuta in moglie».\n\nGesù rispose loro: «I figli di questo mondo prendono moglie e prendono marito; ma quelli che sono giudicati degni della vita futura e della risurrezione dai morti, non prendono né moglie né marito: infatti non possono più morire, perché sono uguali agli angeli e, poiché sono figli della risurrezione, sono figli di Dio».",
    gospelReflectionSample: "Gesù ci insegna sulla vita eterna e la risurrezione. La vita dopo la morte non è una continuazione di questa vita terrena, ma una nuova realtà dove saremo come angeli, figli di Dio nella gloria eterna.",
    
    // Prayers Page
    prayersTitle: "Orazioni Tradizionali",
    prayersSubtitle: "Preghiere cattoliche",
    
    // Novenas
    novenasTitle: "Novene",
    novenasSubtitle: "9 giorni di preghiera",
    day: "Giorno",
    dayOf: "di",
    startNovena: "Inizia Novena",
    continueNovena: "Continua Novena",
    novenaCompleted: "Novena Completa!",
    markComplete: "Segna come Completato",
    
    novena1Name: "Novena alla Madonna di Fatima",
    novena1Purpose: "Per ottenere grazie e protezione della Madonna",
    novena1Prayer: "O Immacolata Vergine Maria, Madre di Dio e Madre nostra, Regina del cielo e della terra, rifugio dei peccatori, noi ci consacriamo interamente a te. Siamo tuoi in spirito e corpo, e desideriamo essere sempre più tuoi. Conserva in noi un vivo ricordo delle tue misericordie, affinché possiamo ringraziare te e Dio per tutti i benefici che ci elargite. Accetta, o Madre pietosa, la nostra umile richiesta e ottienici le grazie di cui abbiamo bisogno. Soprattutto, aiutaci a vivere come veri figli tuoi, affinché, dopo questa vita, possiamo lodarti eternamente in Paradiso. Amen.",
    
    novena2Name: "Novena allo Spirito Santo",
    novena2Purpose: "Per ricevere i doni dello Spirito Santo",
    novena2Prayer: "Veni, Sancte Spiritus! Vieni, Santo Spirito, riempi i cuori dei tuoi fedeli e accendi in essi il fuoco del tuo amore. Manda il tuo Spirito e tutto sarà creato, e rinnoverai la faccia della terra. O Dio, che hai istruito i cuori dei tuoi fedeli con la luce dello Spirito Santo, fa' che per il medesimo Spirito Santo conosciamo ciò che è retto e godiamo sempre del suo conforto. Per Cristo nostro Signore. Amen.",
    
    novena3Name: "Novena a San Giuseppe",
    novena3Purpose: "Per ottenere protezione e aiuto nelle necessità",
    novena3Prayer: "O glorioso San Giuseppe, sposo della Vergine Maria e padre putativo di Gesù Cristo, intercedi per noi presso Dio. Tu che hai custodito con amore la Santa Famiglia, proteggi anche noi dalle tentazioni del male. Aiutaci nel nostro lavoro quotidiano e nelle nostre necessità. Fa' che, come te, viviamo sempre nella presenza di Dio, compiendo fedelmente la sua volontà. Ottienici le grazie di cui abbiamo bisogno, specialmente quella di una buona morte. Amen.",
    
    novena4Name: "Novena al Sacro Cuore di Gesù",
    novena4Purpose: "Per consacrarsi al Cuore di Gesù",
    novena4Prayer: "O Sacro Cuore di Gesù, fonte inesauribile di amore e misericordia, io mi consacro completamente a te. Prendi possesso del mio cuore e trasformalo secondo il tuo. Fa' che io ami ciò che tu ami e che eviti ciò che tu detesti. Dammi la grazia di vivere sempre unito a te, di soffrire con pazienza le prove della vita e di glorificarti in tutte le mie azioni. Sacro Cuore di Gesù, confido in te! Amen.",
    
    novena5Name: "Novena a Santa Rita da Cascia",
    novena5Purpose: "Per i casi impossibili e difficili",
    novena5Prayer: "O gloriosa Santa Rita, tu che davanti a Dio sei l'avvocata dei casi disperati, guarda la mia afflizione e vieni in mio aiuto. Intercedi per me presso il Signore, affinché ciò che sembra impossibile agli uomini diventi possibile per tua intercessione. O Santa delle cause impossibili, prega per me! Ottienimi la grazia di cui ho tanto bisogno [fare la richiesta]. Prometterò di diffondere la tua devozione e di ringraziare pubblicamente le grazie ricevute. Amen.",
    
    // Days
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",
    sunday: "Domenica"
  },
  
  en: {
    // Header
    appTitle: "Catholic Map",
    appSubtitle: "Your daily faith companion",
    greeting: "Hello",
    peaceBless: "The peace of Jesus and the love of Mary ✨",
    defaultName: "Friend",
    
    // Name Edit
    editName: "Edit Name",
    enterYourName: "Enter your name",
    save: "Save",
    cancel: "Cancel",
    
    // Navigation
    home: "Home",
    rosary: "Rosary",
    gospel: "Gospel",
    prayers: "Prayers",
    novenas: "Novenas",
    
    // Buttons
    reading: "Reading",
    next: "Next",
    previous: "Previous",
    
    // Rosary
    rosaryTitle: "Holy Rosary",
    rosarySubtitle: "Pray with the mysteries of the day",
    mysteriesJoyful: "Joyful Mysteries",
    mysteriesLuminous: "Luminous Mysteries",
    mysteriesSorrowful: "Sorrowful Mysteries",
    mysteriesGlorious: "Glorious Mysteries",
    selectMystery: "Choose the Mysteries to meditate",
    mystery: "Mystery",
    completed: "Complete",
    prayAgain: "Pray Again",
    rosaryCompleted: "Rosary Complete!",
    
    // Mysteries
    joyful1: "The Annunciation",
    joyful2: "The Visitation",
    joyful3: "The Nativity",
    joyful4: "The Presentation",
    joyful5: "Finding in the Temple",
    
    luminous1: "The Baptism of Jesus",
    luminous2: "The Wedding at Cana",
    luminous3: "The Proclamation of the Kingdom",
    luminous4: "The Transfiguration",
    luminous5: "The Institution of the Eucharist",
    
    sorrowful1: "The Agony in the Garden",
    sorrowful2: "The Scourging",
    sorrowful3: "The Crowning with Thorns",
    sorrowful4: "The Carrying of the Cross",
    sorrowful5: "The Crucifixion",
    
    glorious1: "The Resurrection",
    glorious2: "The Ascension",
    glorious3: "The Descent of the Holy Spirit",
    glorious4: "The Assumption of Mary",
    glorious5: "The Coronation of Mary",
    
    // Prayers
    ourFather: "Our Father",
    hailMary: "Hail Mary",
    gloryBe: "Glory Be",
    hailHolyQueen: "Hail Holy Queen",
    
    ourFatherText: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
    
    hailMaryText: "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
    
    gloryBeText: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
    
    hailHolyQueenText: "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve: to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious Advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.",
    
    // Gospel
    gospelTitle: "Gospel of the Day",
    todayGospel: "Today",
    reflection: "Reflection",
    gospelReference: "Luke 20:27-40",
    gospelTitleSample: "The Resurrection of the Dead",
    gospelTextSample: "Some Sadducees, those who deny that there is a resurrection, came to Jesus and asked him a question, \"Teacher, Moses wrote for us that if a man's brother dies, leaving a wife but no children, the man shall marry the widow and raise up children for his brother.\n\nNow there were seven brothers; the first married, and died childless; then the second and the third married her, and so in the same way all seven died childless. Finally the woman also died.\n\nIn the resurrection, therefore, whose wife will the woman be? For the seven had married her.\"\n\nJesus said to them, \"Those who belong to this age marry and are given in marriage; but those who are considered worthy of a place in that age and in the resurrection from the dead neither marry nor are given in marriage. Indeed they cannot die anymore, because they are like angels and are children of God, being children of the resurrection.\"",
    gospelReflectionSample: "Jesus teaches us about eternal life and resurrection. Life after death is not a continuation of this earthly life, but a new reality where we will be like angels, children of God in eternal glory.",
    
    // Prayers Page
    prayersTitle: "Traditional Prayers",
    prayersSubtitle: "Catholic prayers",
    
    // Novenas
    novenasTitle: "Novenas",
    novenasSubtitle: "9 days of prayer",
    day: "Day",
    dayOf: "of",
    startNovena: "Start Novena",
    continueNovena: "Continue Novena",
    novenaCompleted: "Novena Complete!",
    markComplete: "Mark as Complete",
    
    novena1Name: "Novena to Our Lady of Fatima",
    novena1Purpose: "To obtain graces and protection from Our Lady",
    novena1Prayer: "O Immaculate Virgin Mary, Mother of God and our Mother, Queen of Heaven and Earth, refuge of sinners, we consecrate ourselves entirely to you. We are yours in spirit and body, and we desire to be ever more yours. Keep alive in us a vivid memory of your mercies, so that we may thank you and God for all the benefits you grant us. Accept, O merciful Mother, our humble request and obtain for us the graces we need. Above all, help us to live as your true children, so that after this life we may praise you eternally in Paradise. Amen.",
    
    novena2Name: "Novena to the Holy Spirit",
    novena2Purpose: "To receive the gifts of the Holy Spirit",
    novena2Prayer: "Come, Holy Spirit! Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love. Send forth your Spirit and they shall be created, and you shall renew the face of the earth. O God, who instructed the hearts of the faithful by the light of the Holy Spirit, grant that by the same Spirit we may know what is right and always rejoice in his comfort. Through Christ our Lord. Amen.",
    
    novena3Name: "Novena to Saint Joseph",
    novena3Purpose: "To obtain protection and help in our needs",
    novena3Prayer: "O glorious Saint Joseph, spouse of the Virgin Mary and foster father of Jesus Christ, intercede for us with God. You who lovingly guarded the Holy Family, protect us also from the temptations of evil. Help us in our daily work and in our needs. May we, like you, always live in God's presence, faithfully fulfilling his will. Obtain for us the graces we need, especially that of a happy death. Amen.",
    
    novena4Name: "Novena to the Sacred Heart of Jesus",
    novena4Purpose: "To consecrate ourselves to the Heart of Jesus",
    novena4Prayer: "O Sacred Heart of Jesus, inexhaustible source of love and mercy, I consecrate myself completely to you. Take possession of my heart and transform it according to yours. May I love what you love and avoid what you detest. Give me the grace to always live united to you, to suffer patiently life's trials, and to glorify you in all my actions. Sacred Heart of Jesus, I trust in you! Amen.",
    
    novena5Name: "Novena to Saint Rita of Cascia",
    novena5Purpose: "For impossible and difficult cases",
    novena5Prayer: "O glorious Saint Rita, you who before God are the advocate of desperate cases, look upon my affliction and come to my aid. Intercede for me with the Lord, so that what seems impossible to men may become possible through your intercession. O Saint of impossible causes, pray for me! Obtain for me the grace I so greatly need [make your request]. I will promise to spread your devotion and publicly thank you for graces received. Amen.",
    
    // Days
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  },
  
  pt: {
    // Header
    appTitle: "Mapa do Católico",
    appSubtitle: "Seu companheiro diário de fé",
    greeting: "Olá",
    peaceBless: "A paz de Jesus e o amor de Maria ✨",
    defaultName: "Amigo",
    
    // Name Edit
    editName: "Editar Nome",
    enterYourName: "Digite seu nome",
    save: "Salvar",
    cancel: "Cancelar",
    
    // Navigation
    home: "Início",
    rosary: "Rosário",
    gospel: "Evangelho",
    prayers: "Orações",
    novenas: "Novenas",
    
    // Buttons
    reading: "Leitura",
    next: "Avançar",
    previous: "Voltar",
    
    // Rosary
    rosaryTitle: "Santo Rosário",
    rosarySubtitle: "Reze com os mistérios do dia",
    mysteriesJoyful: "Mistérios Gozosos",
    mysteriesLuminous: "Mistérios Luminosos",
    mysteriesSorrowful: "Mistérios Dolorosos",
    mysteriesGlorious: "Mistérios Gloriosos",
    selectMystery: "Escolha os Mistérios para meditar",
    mystery: "Mistério",
    completed: "Concluído",
    prayAgain: "Rezar Novamente",
    rosaryCompleted: "Rosário Completo!",
    
    // Mysteries
    joyful1: "A Anunciação",
    joyful2: "A Visitação",
    joyful3: "O Nascimento de Jesus",
    joyful4: "A Apresentação no Templo",
    joyful5: "O Encontro no Templo",
    
    luminous1: "O Batismo de Jesus",
    luminous2: "As Bodas de Caná",
    luminous3: "O Anúncio do Reino",
    luminous4: "A Transfiguração",
    luminous5: "A Instituição da Eucaristia",
    
    sorrowful1: "A Agonia no Horto",
    sorrowful2: "A Flagelação",
    sorrowful3: "A Coroação de Espinhos",
    sorrowful4: "O Caminho do Calvário",
    sorrowful5: "A Crucificação",
    
    glorious1: "A Ressurreição",
    glorious2: "A Ascensão",
    glorious3: "A Descida do Espírito Santo",
    glorious4: "A Assunção de Maria",
    glorious5: "A Coroação de Maria",
    
    // Prayers
    ourFather: "Pai Nosso",
    hailMary: "Ave Maria",
    gloryBe: "Glória ao Pai",
    hailHolyQueen: "Salve Rainha",
    
    ourFatherText: "Pai nosso, que estais no céu, santificado seja o vosso nome, venha a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje, perdoai as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.",
    
    hailMaryText: "Ave Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.",
    
    gloryBeText: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.",
    
    hailHolyQueenText: "Salve, Rainha, mãe de misericórdia, vida, doçura, esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria.",
    
    // Gospel
    gospelTitle: "Evangelho do Dia",
    todayGospel: "Hoje",
    reflection: "Reflexão",
    gospelReference: "Lucas 20, 27-40",
    gospelTitleSample: "A Ressurreição dos Mortos",
    gospelTextSample: "Naquele tempo, aproximaram-se de Jesus alguns saduceus, que negam a ressurreição, e lhe perguntaram: \"Mestre, Moisés nos deixou escrito: Se alguém morrer e deixar a mulher sem filhos, o irmão dele deve casar-se com a viúva e dar descendentes a seu irmão.\n\nHavia sete irmãos. O primeiro casou-se e morreu sem filhos. O segundo casou-se com a viúva, e também morreu sem filhos. O terceiro casou-se com ela, e da mesma forma os sete; e morreram sem deixar filhos. Por fim, morreu também a mulher.\n\nAgora, na ressurreição, de qual deles ela será esposa? Porque os sete foram casados com ela.\"\n\nJesus respondeu: \"Os filhos deste mundo casam-se; mas os que são julgados dignos de participar do mundo futuro e da ressurreição dos mortos, não se casam mais, porque não podem mais morrer, pois são iguais aos anjos e são filhos de Deus, sendo filhos da ressurreição.\"",
    gospelReflectionSample: "Jesus nos ensina sobre a vida eterna e a ressurreição. A vida após a morte não é uma continuação desta vida terrena, mas uma nova realidade onde seremos como anjos, filhos de Deus na glória eterna.",
    
    // Prayers Page
    prayersTitle: "Orações Tradicionais",
    prayersSubtitle: "Orações católicas",
    
    // Novenas
    novenasTitle: "Novenas",
    novenasSubtitle: "9 dias de oração",
    day: "Dia",
    dayOf: "de",
    startNovena: "Iniciar Novena",
    continueNovena: "Continuar Novena",
    novenaCompleted: "Novena Completa!",
    markComplete: "Marcar como Concluído",
    
    novena1Name: "Novena a Nossa Senhora de Fátima",
    novena1Purpose: "Para obter graças e proteção de Nossa Senhora",
    novena1Prayer: "Ó Imaculada Virgem Maria, Mãe de Deus e Mãe nossa, Rainha do céu e da terra, refúgio dos pecadores, nós nos consagramos inteiramente a vós. Somos vossos em espírito e corpo, e desejamos ser sempre mais vossos. Conservai em nós uma viva lembrança de vossas misericórdias, a fim de podermos agradecer a vós e a Deus por todos os benefícios que nos concedeis. Aceitai, ó Mãe piedosa, o nosso humilde pedido e obtende-nos as graças de que necessitamos. Sobretudo, ajudai-nos a viver como verdadeiros filhos vossos, para que, depois desta vida, possamos louvar-vos eternamente no Paraíso. Amém.",
    
    novena2Name: "Novena ao Espírito Santo",
    novena2Purpose: "Para receber os dons do Espírito Santo",
    novena2Prayer: "Vinde, Espírito Santo! Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor. Enviai o vosso Espírito e tudo será criado, e renovareis a face da terra. Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que pelo mesmo Espírito Santo conheçamos o que é reto e gozemos sempre de seu conforto. Por Cristo nosso Senhor. Amém.",
    
    novena3Name: "Novena a São José",
    novena3Purpose: "Para obter proteção e ajuda nas necessidades",
    novena3Prayer: "Ó glorioso São José, esposo da Virgem Maria e pai putativo de Jesus Cristo, intercedei por nós junto a Deus. Vós que guardastes com amor a Sagrada Família, protegei-nos também das tentações do mal. Ajudai-nos no nosso trabalho quotidiano e nas nossas necessidades. Fazei que, como vós, vivamos sempre na presença de Deus, cumprindo fielmente a sua vontade. Obtende-nos as graças de que necessitamos, especialmente a de uma boa morte. Amém.",
    
    novena4Name: "Novena ao Sagrado Coração de Jesus",
    novena4Purpose: "Para nos consagrarmos ao Coração de Jesus",
    novena4Prayer: "Ó Sagrado Coração de Jesus, fonte inesgotável de amor e misericórdia, eu me consagro completamente a vós. Tomai posse do meu coração e transformai-o segundo o vosso. Fazei que eu ame o que vós amais e que evite o que vós detestais. Dai-me a graça de viver sempre unido a vós, de sofrer com paciência as provas da vida e de vos glorificar em todas as minhas ações. Sagrado Coração de Jesus, em vós confio! Amém.",
    
    novena5Name: "Novena a Santa Rita de Cássia",
    novena5Purpose: "Para os casos impossíveis e difíceis",
    novena5Prayer: "Ó gloriosa Santa Rita, vós que diante de Deus sois a advogada dos casos desesperados, olhai a minha aflição e vinde em meu auxílio. Intercedei por mim junto ao Senhor, para que aquilo que parece impossível aos homens se torne possível por vossa intercessão. Ó Santa das causas impossíveis, rogai por mim! Obtende-me a graça de que tanto necessito [fazer o pedido]. Prometo difundir a vossa devoção e agradecer publicamente as graças recebidas. Amém.",
    
    // Days
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
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

  const getFormattedDate = () => {
    return formatDate(language);
  };

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      changeLanguage, 
      t, 
      getFormattedDate 
    }}>
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
