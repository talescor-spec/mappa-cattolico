import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { safeGet, safeSet } from "../utils/storage";
const LanguageContext = createContext(null);
export const languages = {
  it: { label: "Italiano", locale: "it-IT", flag: "IT" },
  pt: { label: "Português", locale: "pt-BR", flag: "PT" },
};
const translations = {
  it: {
    appName: "Fideora",
    tagline: "La tua fede, ogni giorno.",
    navToday: "Oggi",
    navBible: "Bibbia",
    navPray: "Prega",
    navPaths: "Percorsi",
    navProfile: "Profilo",
    morning: "Buongiorno",
    afternoon: "Buon pomeriggio",
    evening: "Buonasera",
    friend: "Amico",
    dayIntro: "Uno spazio per ritrovare pace, presenza e fede.",
    yourDay: "Il tuo giorno",
    continue: "Continua",
    gospel: "Vangelo e riflessione",
    gospelEyebrow: "LETTURA",
    readMeditate: "Leggi e medita",
    reflection: "Riflessione",
    gospelRef: "Luca 20, 27–40",
    gospelTitle: "La risurrezione dei morti",
    gospelText:
      "Gesù ci ricorda che la vita eterna supera i confini della vita presente. La speranza cristiana non è soltanto continuità: è una vita nuova in Dio.",
    gospelReflection:
      "Oggi prova a lasciare a Dio una preoccupazione che stai trattenendo. La fede cresce quando smettiamo di controllare tutto e ricominciamo a fidarci.",
    rosary: "Santo Rosario",
    rosarySubtitle: "Prega con i misteri del giorno",
    prayerOfDay: "Preghiera del giorno",
    prayers: "Preghiere",
    novenas: "Novene",
    minutes: "min",
    progress: "Progresso",
    chooseMystery: "Scegli i misteri",
    mysteryProgress: "passi completati",
    advancePrayer: "Continua la preghiera",
    reset: "Ricomincia",
    completed: "Completato",
    back: "Indietro",
    joyful: "Misteri Gaudiosi",
    luminous: "Misteri Luminosi",
    sorrowful: "Misteri Dolorosi",
    glorious: "Misteri Gloriosi",
    joyfulDays: "Lunedì e sabato",
    luminousDays: "Giovedì",
    sorrowfulDays: "Martedì e venerdì",
    gloriousDays: "Mercoledì e domenica",
    prayTitle: "Prega con calma",
    praySubtitle: "Rosario, preghiere e novene in un unico luogo.",
    openRosary: "Apri il Rosario",
    pathsTitle: "Percorsi di fede",
    pathsSubtitle: "Piccoli passi, ogni giorno.",
    novenaProgress: "Progresso novena",
    day: "Giorno",
    of: "di",
    markDay: "Completa il giorno",
    startNovena: "Inizia novena",
    profileTitle: "Il tuo spazio",
    profileSubtitle: "Preferenze e progresso Fideora.",
    editName: "Modifica nome",
    yourName: "Il tuo nome",
    save: "Salva",
    cancel: "Annulla",
    language: "Lingua",
    streak: "Giorni con Fideora",
    localProgress: "Progresso salvato su questo dispositivo",
    version: "Fideora Preview · 1.0",
    ourFather: "Padre Nostro",
    hailMary: "Ave Maria",
    gloryBe: "Gloria al Padre",
    hailQueen: "Salve Regina",
    ourFatherText:
      "Padre nostro, che sei nei cieli, sia santificato il tuo nome, venga il tuo regno, sia fatta la tua volontà, come in cielo così in terra. Dacci oggi il nostro pane quotidiano e rimetti a noi i nostri debiti come anche noi li rimettiamo ai nostri debitori, e non abbandonarci alla tentazione, ma liberaci dal male. Amen.",
    hailMaryText:
      "Ave, o Maria, piena di grazia, il Signore è con te. Tu sei benedetta fra le donne e benedetto è il frutto del tuo seno, Gesù. Santa Maria, Madre di Dio, prega per noi peccatori, adesso e nell’ora della nostra morte. Amen.",
    gloryBeText:
      "Gloria al Padre e al Figlio e allo Spirito Santo. Come era nel principio, ora e sempre, nei secoli dei secoli. Amen.",
    hailQueenText:
      "Salve, Regina, madre di misericordia, vita, dolcezza e speranza nostra, salve. A te ricorriamo, esuli figli di Eva; a te sospiriamo, gementi e piangenti in questa valle di lacrime. Orsù dunque, avvocata nostra, rivolgi a noi gli occhi tuoi misericordiosi. E mostraci, dopo questo esilio, Gesù, il frutto benedetto del tuo seno. O clemente, o pia, o dolce Vergine Maria. Amen.",
    novena1: "Madonna di Fatima",
    novena1Purpose: "Affidare intenzioni e chiedere protezione materna.",
    novena2: "Spirito Santo",
    novena2Purpose: "Chiedere luce, discernimento e forza.",
    novena3: "San Giuseppe",
    novena3Purpose: "Per il lavoro, la famiglia e le necessità quotidiane.",
    novena4: "Sacro Cuore di Gesù",
    novena4Purpose: "Crescere nella fiducia e nell’amore di Cristo.",
    novena5: "Santa Rita",
    novena5Purpose:
      "Per le cause difficili e le situazioni che sembrano impossibili.",
    novenaPrayer:
      "Signore, ricevi questa intenzione con misericordia. Donami perseveranza nella preghiera, pace nelle prove e un cuore aperto alla tua volontà. Amen.",
  },
  pt: {
    appName: "Fideora",
    tagline: "Sua fé, todos os dias.",
    navToday: "Hoje",
    navBible: "Bíblia",
    navPray: "Rezar",
    navPaths: "Caminhos",
    navProfile: "Perfil",
    morning: "Bom dia",
    afternoon: "Boa tarde",
    evening: "Boa noite",
    friend: "Amigo",
    dayIntro: "Um espaço para reencontrar paz, presença e fé.",
    yourDay: "O seu dia",
    continue: "Continuar",
    gospel: "Evangelho e reflexão",
    gospelEyebrow: "LEITURA",
    readMeditate: "Ler e meditar",
    reflection: "Reflexão",
    gospelRef: "Lucas 20, 27–40",
    gospelTitle: "A ressurreição dos mortos",
    gospelText:
      "Jesus nos lembra que a vida eterna ultrapassa os limites da vida presente. A esperança cristã não é apenas continuidade: é uma vida nova em Deus.",
    gospelReflection:
      "Hoje, entregue a Deus uma preocupação que você vem carregando. A fé cresce quando deixamos de tentar controlar tudo e voltamos a confiar.",
    rosary: "Santo Rosário",
    rosarySubtitle: "Reze com os mistérios do dia",
    prayerOfDay: "Oração do dia",
    prayers: "Orações",
    novenas: "Novenas",
    minutes: "min",
    progress: "Progresso",
    chooseMystery: "Escolha os mistérios",
    mysteryProgress: "etapas concluídas",
    advancePrayer: "Continuar a oração",
    reset: "Recomeçar",
    completed: "Concluído",
    back: "Voltar",
    joyful: "Mistérios Gozosos",
    luminous: "Mistérios Luminosos",
    sorrowful: "Mistérios Dolorosos",
    glorious: "Mistérios Gloriosos",
    joyfulDays: "Segunda-feira e sábado",
    luminousDays: "Quinta-feira",
    sorrowfulDays: "Terça-feira e sexta-feira",
    gloriousDays: "Quarta-feira e domingo",
    prayTitle: "Reze com calma",
    praySubtitle: "Rosário, orações e novenas em um só lugar.",
    openRosary: "Abrir o Rosário",
    pathsTitle: "Caminhos de fé",
    pathsSubtitle: "Pequenos passos, todos os dias.",
    novenaProgress: "Progresso da novena",
    day: "Dia",
    of: "de",
    markDay: "Concluir o dia",
    startNovena: "Iniciar novena",
    profileTitle: "Seu espaço",
    profileSubtitle: "Preferências e progresso no Fideora.",
    editName: "Editar nome",
    yourName: "Seu nome",
    save: "Salvar",
    cancel: "Cancelar",
    language: "Idioma",
    streak: "Dias com o Fideora",
    localProgress: "Progresso salvo neste dispositivo",
    version: "Fideora Preview · 1.0",
    ourFather: "Pai-Nosso",
    hailMary: "Ave-Maria",
    gloryBe: "Glória ao Pai",
    hailQueen: "Salve-Rainha",
    ourFatherText:
      "Pai nosso que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.",
    hailMaryText:
      "Ave Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém.",
    gloryBeText:
      "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.",
    hailQueenText:
      "Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve. A vós bradamos, os degredados filhos de Eva; a vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei; e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.",
    novena1: "Nossa Senhora de Fátima",
    novena1Purpose: "Confiar intenções e pedir sua proteção materna.",
    novena2: "Espírito Santo",
    novena2Purpose: "Pedir luz, discernimento e força.",
    novena3: "São José",
    novena3Purpose:
      "Pelo trabalho, pela família e pelas necessidades do dia a dia.",
    novena4: "Sagrado Coração de Jesus",
    novena4Purpose: "Crescer na confiança e no amor de Cristo.",
    novena5: "Santa Rita",
    novena5Purpose:
      "Pelas causas difíceis e situações que parecem impossíveis.",
    novenaPrayer:
      "Senhor, acolhei esta intenção com misericórdia. Dai-me perseverança na oração, paz nas provações e um coração aberto à vossa vontade. Amém.",
  },
};
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() =>
    safeGet("fideoraLanguage") === "pt" ? "pt" : "it",
  );
  useEffect(() => {
    safeSet("fideoraLanguage", language);
    document.documentElement.lang = languages[language].locale;
  }, [language]);
  useEffect(() => {
    const hydrate = () =>
      setLanguage(safeGet("fideoraLanguage") === "pt" ? "pt" : "it");
    window.addEventListener("fideora:hydrated", hydrate);
    return () => window.removeEventListener("fideora:hydrated", hydrate);
  }, []);
  const value = useMemo(
    () => ({
      language,
      changeLanguage: (code) => setLanguage(code === "pt" ? "pt" : "it"),
      l: (it, pt) => (language === "pt" ? pt : it),
      t: (key) => translations[language]?.[key] ?? translations.it[key] ?? key,
      getFormattedDate: (date = new Date()) =>
        date.toLocaleDateString(languages[language].locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
    }),
    [language],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider required");
  return context;
}
