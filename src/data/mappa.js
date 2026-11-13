// Original Fideora editorial introductions. References link to the bundled reader;
// this first Mappa release does not claim a complete 73-book catalogue.
export const GOSPELS = [
  {
    id: "matteo",
    book: "Matt",
    chapters: 28,
    name: ["Matteo", "Mateus"],
    focus: ["Promessa e compimento", "Promessa e cumprimento"],
    summary: [
      "Gesù è presentato in continuità con le Scritture d’Israele. I suoi insegnamenti guidano il lettore verso una fede vissuta.",
      "Jesus é apresentado em continuidade com as Escrituras de Israel. Seus ensinamentos conduzem a uma fé vivida.",
    ],
    detail: [
      "La genealogia, i richiami alle Scritture e i grandi discorsi aiutano a riconoscere il Messia e a comprendere il Regno dei cieli.",
      "A genealogia, as referências às Escrituras e os grandes discursos ajudam a reconhecer o Messias e compreender o Reino dos céus.",
    ],
    reference: { chapter: 5, verse: 17, label: ["Mt 5,17", "Mt 5,17"] },
  },
  {
    id: "marco",
    book: "Mark",
    chapters: 16,
    name: ["Marco", "Marcos"],
    focus: ["Identità e sequela", "Identidade e seguimento"],
    summary: [
      "Un racconto essenziale, ricco di azioni e incontri. La domanda su chi sia Gesù accompagna il cammino dei discepoli.",
      "Um relato conciso, rico em ações e encontros. A pergunta sobre quem é Jesus acompanha a caminhada dos discípulos.",
    ],
    detail: [
      "La croce illumina il significato del suo servizio. Il discepolo è invitato a seguirlo, anche quando non comprende tutto.",
      "A cruz ilumina o sentido de seu serviço. O discípulo é convidado a segui-lo, mesmo quando ainda não compreende tudo.",
    ],
    reference: { chapter: 10, verse: 45, label: ["Mc 10,45", "Mc 10,45"] },
  },
  {
    id: "luca",
    book: "Luke",
    chapters: 24,
    name: ["Luca", "Lucas"],
    focus: ["Misericordia e cammino", "Misericórdia e caminho"],
    summary: [
      "Gesù incontra chi è ai margini e annuncia una salvezza aperta a tutti. Il viaggio verso Gerusalemme dà forma al racconto.",
      "Jesus encontra quem está à margem e anuncia uma salvação aberta a todos. A viagem a Jerusalém dá forma ao relato.",
    ],
    detail: [
      "Le parabole della misericordia, la preghiera e l’attenzione ai poveri aiutano a leggere il Vangelo. Il cammino prosegue negli Atti.",
      "As parábolas da misericórdia, a oração e a atenção aos pobres ajudam a ler o Evangelho. O caminho continua em Atos.",
    ],
    reference: { chapter: 15, verse: 20, label: ["Lc 15,20", "Lc 15,20"] },
  },
  {
    id: "giovanni",
    book: "John",
    chapters: 21,
    name: ["Giovanni", "João"],
    focus: ["Segni e fede", "Sinais e fé"],
    summary: [
      "I segni e le parole di Gesù invitano a riconoscerlo e a credere in lui. Luce, vita e amore attraversano il racconto.",
      "Os sinais e as palavras de Jesus convidam a reconhecê-lo e crer nele. Luz, vida e amor atravessam o relato.",
    ],
    detail: [
      "I dialoghi e i segni accompagnano il lettore verso la fede. La relazione con Gesù prende forma nell’amore e nel rimanere in lui.",
      "Os diálogos e sinais conduzem o leitor à fé. A relação com Jesus toma forma no amor e em permanecer nele.",
    ],
    reference: { chapter: 20, verse: 31, label: ["Gv 20,31", "Jo 20,31"] },
  },
];
export const MATTHEW = {
  summary: [
    "Dalle promesse ad Abramo all’invio dei discepoli a tutte le nazioni: Matteo aiuta a riconoscere in Gesù il Messia e a comprendere come vivere il suo insegnamento.",
    "Das promessas a Abraão ao envio dos discípulos a todas as nações: Mateus ajuda a reconhecer Jesus como o Messias e compreender como viver seu ensinamento.",
  ],
  themes: [
    {
      id: "fulfilment",
      title: ["Le promesse prendono forma", "As promessas ganham forma"],
      reference: "Mt 1,1 · 5,17",
      body: [
        "La genealogia collega Gesù ad Abramo e a Davide. I richiami alle Scritture invitano a leggere la sua storia dentro quella d’Israele.",
        "A genealogia liga Jesus a Abraão e a Davi. As referências às Escrituras convidam a ler sua história dentro da história de Israel.",
      ],
    },
    {
      id: "kingdom",
      title: ["Il Regno nella vita quotidiana", "O Reino na vida cotidiana"],
      reference: "Mt 5–7 · 13",
      body: [
        "Le beatitudini, la preghiera e le parabole mostrano uno stile di vita: fiducia in Dio, misericordia e giustizia che diventano scelte concrete.",
        "As bem-aventuranças, a oração e as parábolas mostram um modo de viver: confiança em Deus, misericórdia e justiça que se tornam escolhas concretas.",
      ],
    },
    {
      id: "discipleship",
      title: ["Dall’ascolto alla sequela", "Da escuta ao seguimento"],
      reference: "Mt 7,24 · 28,19–20",
      body: [
        "Ascoltare conduce ad agire. Il racconto si conclude con l’invio dei discepoli: ciò che hanno ricevuto è destinato a essere condiviso.",
        "Escutar conduz a agir. O relato termina com o envio dos discípulos: o que receberam se destina a ser compartilhado.",
      ],
    },
  ],
  people: [
    {
      name: ["Gesù", "Jesus"],
      role: [
        "Il Messia che insegna e chiama.",
        "O Messias que ensina e chama.",
      ],
    },
    {
      name: ["Giuseppe e Maria", "José e Maria"],
      role: [
        "Custodiscono gli inizi della sua vita.",
        "Cuidam do início de sua vida.",
      ],
    },
    {
      name: ["Pietro e i discepoli", "Pedro e os discípulos"],
      role: [
        "Imparano a riconoscerlo e a seguirlo.",
        "Aprendem a reconhecê-lo e segui-lo.",
      ],
    },
  ],
  structure: [
    {
      chapters: "1–2",
      title: ["Le origini", "As origens"],
      text: [
        "Genealogia e racconti dell’infanzia.",
        "Genealogia e relatos da infância.",
      ],
    },
    {
      chapters: "3–18",
      title: ["Annuncio e insegnamento", "Anúncio e ensinamento"],
      text: [
        "La vita pubblica, i discorsi e la formazione dei discepoli.",
        "A vida pública, os discursos e a formação dos discípulos.",
      ],
    },
    {
      chapters: "19–28",
      title: ["Verso Gerusalemme", "Rumo a Jerusalém"],
      text: [
        "Passione, risurrezione e invio.",
        "Paixão, ressurreição e envio.",
      ],
    },
  ],
  passages: [
    {
      book: "Matt",
      chapter: 5,
      verse: 3,
      label: ["Le beatitudini", "As bem-aventuranças"],
      ref: "Mt 5,3–12",
    },
    {
      book: "Matt",
      chapter: 6,
      verse: 9,
      label: ["Il Padre nostro", "O Pai-nosso"],
      ref: "Mt 6,9–13",
    },
    {
      book: "Matt",
      chapter: 28,
      verse: 19,
      label: ["L’invio dei discepoli", "O envio dos discípulos"],
      ref: "Mt 28,19–20",
    },
  ],
  question: [
    "Quale insegnamento di Gesù posso trasformare oggi in un gesto concreto?",
    "Qual ensinamento de Jesus posso transformar hoje em um gesto concreto?",
  ],
};
export const MAPPA_SOURCES = [
  { name: "Matteo", url: "https://www.bibbiaedu.it/CEI2008/nt/Mt/" },
  { name: "Marco", url: "https://www.bibbiaedu.it/CEI2008/nt/Mc/" },
  { name: "Luca", url: "https://www.bibbiaedu.it/CEI2008/nt/Lc/" },
  { name: "Giovanni", url: "https://www.bibbiaedu.it/CEI2008/nt/Gv/" },
];
export function mappaNote(language, body) {
  const text = String(body || "")
    .trim()
    .slice(0, 10000);
  if (!text) return null;
  return {
    title:
      language === "pt"
        ? "Mateus · Minha reflexão"
        : "Matteo · La mia riflessione",
    body: text,
    pinned: false,
  };
}
