import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "IA senza pregiudizi politici? Non esiste | {{appName}}",
    description:
      "L'IA senza pregiudizi politici non esiste. Perché nessun chatbot è neutrale e come modelli mainstream, abliterated e controcorrente leggono la stessa domanda.",
    category: "Guida",
    imageAlt: "Una bilancia che pesa le risposte di diversi chatbot IA",
    keywords:
      "IA senza pregiudizi politici, IA imparziale, chatbot IA imparziale, IA neutrale, IA politicamente neutrale, ChatGPT è di parte, pregiudizi politici dei chatbot, chatbot IA conservatore, IA con opinioni controcorrente, IA politica senza censura, chiedere all'IA entrambe le parti, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida",
    readTime: "7 min di lettura",
    title: "Il chatbot IA imparziale non esiste. Chiedi a più modelli.",
    subtitle:
      "Perché ogni modello pende da una parte, come {{count}} modelli inquadrano la stessa domanda in modo diverso e un metodo in quattro passaggi per sentire tutte le parti in un'unica chat.",
  },
  intro: {
    lead: "Ogni chatbot si dice equilibrato. Poi risponde alla domanda di una parte e fa la predica all'altra. Te ne accorgi. Se ne accorgono tutti. Quasi tutti ne concludono che serve l'unica IA imparziale.",
    p2: "Non esiste. Esistono invece modelli con prospettive diverse, uno accanto all'altro. Su {{appName}} puoi fare la stessa domanda a un modello mainstream, a uno abliterated e a un modello con opinioni politiche controcorrente, in un'unica chat, e giudicare da te.",
  },
  neutral: {
    title: "Perché nessuna IA è neutrale",
    intro:
      "Il pregiudizio non è un bug che qualcuno si è dimenticato di correggere. Entra in tre modi.",
    data: "Dati di addestramento: un modello impara da ciò che è stato scritto, pubblicato e conservato online. Ciò che è stato escluso o rimosso lo plasma quanto ciò che è stato incluso.",
    tuning:
      "Feedback umano: dopo l'addestramento, delle persone valutano le risposte e il modello impara a compiacerle. Il loro giudizio su ciò che suona ragionevole diventa quello del modello.",
    rules:
      "Regole di rifiuto: qualcuno decide quali domande sono dannose. È una scelta discrezionale, e su alcuni temi pesa più che su altri.",
    sourcesIntro: "Lo dicono perfino i laboratori e i ricercatori:",
    sources: {
      openai: "OpenAI: definire e valutare i pregiudizi politici negli LLM",
      paper: "Paper di ricerca: la neutralità politica nell'IA è impossibile",
    },
    callout:
      "La soluzione non è un modello perfetto. È più di un modello, con te a fare da giudice.",
  },
  frames: {
    title: "Quattro prospettive, una domanda",
    intro:
      "I modelli pendono in direzioni diverse. Sappi quale prospettiva stai leggendo.",
    mainstream:
      "Modelli mainstream: gli assistenti dei grandi laboratori. Capaci e prudenti, plasmati dalle regole di sicurezza del loro laboratorio. Sui temi controversi tergiversano, o si rifiutano.",
    abliterated:
      "Modelli abliterated: modelli mainstream o aperti, leggermente modificati per non schivare più le domande. Rispondono a tutto, ma con lo stesso addestramento e la stessa visione del mondo del modello di base.",
    own: "{{ownModel}}: addestrato su libri e documenti banditi dall'internet mainstream. Il risultato è un modello con opinioni politiche controcorrente. L'altra faccia del dibattito, detta chiaramente.",
    gab: "{{gabModel}}: Gab lo descrive come costruito attorno a valori cristiani e principi conservatori. Un orientamento dichiarato apertamente, cosa che la maggior parte dei modelli non fa.",
    kindsLink:
      "In cosa differiscono i modelli abliterated e quelli senza censura",
  },
  lineup: {
    title: "{{count}} modelli, {{count}} prospettive",
    intro:
      "Una selezione per le domande controverse: modelli di punta mainstream, un modello di punta abliterated, il modello controcorrente e uno con un orientamento dichiarato. Contesto e prezzo in tempo reale dal nostro registro.",
    footnote:
      "Per messaggio indica uno scambio di riferimento sulla rotta più economica. I modelli senza censura chiedono una sola volta la conferma 18+.",
  },
  table: {
    model: "Modello",
    context: "Contesto",
    price: "Per messaggio",
    chat: "Provalo",
    chatLink: "Chiedi a {{model}}",
  },
  method: {
    title: "Senti tutte le parti in quattro passaggi",
    intro: "Una chat. Qualche cambio di modello. Il tuo verdetto.",
    ask: {
      title: "Fai la tua vera domanda",
      body: "Non una versione addolcita. Chiedila come la chiederesti a un amico che non la pensa come te.",
    },
    switch: {
      title: "Cambia modello, tieni la chat",
      body: "Scegli un altro modello dal selettore e chiedi di nuovo. La chat conserva la cronologia, quindi ogni modello vede la stessa domanda.",
    },
    steelman: {
      title: "Chiedi a ognuno di difendere l'altra parte",
      body: "Chiedi l'argomento più forte contro la sua stessa risposta. Un modello che non sa difendere seriamente la parte opposta ti sta mostrando la sua prospettiva.",
    },
    check: {
      title: "Verifica i fatti da solo",
      body: "Dove i modelli non concordano sui fatti, non sulle opinioni, controlla. {{ownModel}} presenta le affermazioni contestate con la stessa nettezza dei fatti assodati. Lo fanno anche gli altri, nella loro direzione.",
    },
  },
  skills: {
    title: "Skill che sostengono ogni parte",
    intro:
      "Una skill imposta persona e modello con un clic. Queste sono pensate per i terreni controversi.",
    historian: "Storico imparziale: fatti, non narrazioni",
    advocate: "Avvocato del diavolo: mette in discussione ogni presupposto",
    debater:
      "Esperto di dibattito: affronta i temi controversi da tutti i punti di vista",
    chan: "4chan: greentext e battute, la voce della vecchia imageboard, senza filtri",
  },
  pairs: {
    title: "{{ownModel}} contro il mainstream",
    intro:
      "Confronti diretti: contesto, prezzo e filtro del modello controcorrente contro i grandi nomi.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Esiste un chatbot IA imparziale?",
      a: "No. Ogni modello è plasmato dai suoi dati di addestramento, dalle persone che ne hanno valutato le risposte e dalle sue regole di rifiuto. La risposta pratica: chiedi a più modelli con prospettive diverse e confronta. Su {{appName}} bastano una chat e qualche clic.",
    },
    chatgpt: {
      q: "ChatGPT ha pregiudizi politici?",
      a: "Ogni modello pende da qualche parte, e gli assistenti mainstream tergiversano o si rifiutano sui temi controversi. OpenAI pubblica le proprie valutazioni sui pregiudizi politici dei suoi modelli. Fai la stessa domanda a un modello con un'altra prospettiva e la differenza salta all'occhio.",
    },
    conservative: {
      q: "Esiste un chatbot IA conservatore o di destra?",
      a: "Gab descrive {{gabModel}} come costruito attorno a valori cristiani e principi conservatori. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream. Il risultato è un modello con opinioni politiche controcorrente. Li trovi entrambi nel selettore di modelli di {{appName}}.",
    },
    truth: {
      q: "{{ownModel}} dice la verità?",
      a: "Ti dice quello che i modelli mainstream non dicono. Nemmeno lui è neutrale, e presenta le affermazioni contestate con la stessa nettezza dei fatti assodati. Usalo come l'altra faccia del dibattito e verifica i fatti che contano.",
    },
    side: {
      q: "{{appName}} prende una posizione politica?",
      a: "No. Offriamo modelli mainstream, aperti e senza censura fianco a fianco, e scegli tu. Cosa leggere lo decidono le persone, non un'azienda.",
    },
    free: {
      q: "Posso confrontare i modelli gratis?",
      a: "Sì. Ricevi {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account gratuito. Cambiare modello in una chat non costa nulla in più.",
    },
    refusalLink: "L'indice dei rifiuti: quale IA risponde davvero",
    jailbreakLink:
      "Perché i jailbreak di ChatGPT smettono sempre di funzionare",
    bestLink: "Il miglior LLM senza censura, scelto per compito",
  },
  cta: {
    title: "Senti la parte che il tuo chatbot salta.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, nessun account richiesto. Chiedi al modello controcorrente, poi cambia e confronta.",
    start: "Chiedi al modello controcorrente",
    models: "Confronta tutti i modelli",
  },
};
