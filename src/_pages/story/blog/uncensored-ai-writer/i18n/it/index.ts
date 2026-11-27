import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "IA senza censura per scrivere: storie senza filtri | {{appName}}",
    description:
      "IA senza censura per romanzi, narrativa dark e scene per adulti. Quali modelli scrivono senza addolcire, quante pagine ricorda ognuno e quanto costa una scena.",
    category: "Guida alla scrittura",
    imageAlt: "Un'IA senza censura scrive una scena di narrativa dark",
    keywords:
      "IA senza censura per scrivere, scrivere con l'IA senza filtri, generatore di storie IA senza censura, IA per scrivere racconti senza limiti, scrittore IA senza restrizioni, IA storie NSFW, IA per narrativa dark, scrivere un romanzo con l'IA senza censura, IA per scrittura creativa senza censura, IA narrativa per adulti, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida alla scrittura",
    readTime: "8 min di lettura",
    title: "Un'IA per scrivere senza censura. La tua storia, senza sconti.",
    subtitle:
      "{{count}} modelli senza censura che scrivono cattivi, violenza e scene per adulti senza giri di parole, con quante pagine del tuo manoscritto ricorda ognuno. Letti in tempo reale dal nostro registro modelli.",
  },
  intro: {
    lead: "Chiedi il monologo del cattivo. Ricevi un discorso sulla gentilezza. Scrivi una scena di guerra. L'IA stacca prima del primo sparo. Gli assistenti mainstream sono fatti per andare bene a tutti. La narrativa non va bene a tutti.",
    p2: "Questa guida è per chi scrive e ha bisogno che il capitolo oscuro venga scritto, non giudicato. Quali modelli su {{appName}} lo scrivono senza filtri, quale regge un manoscritto intero, quale porta una voce che il mainstream non ha, e come lavorarci scena per scena.",
  },
  softening: {
    title: "Come l'IA mainstream annacqua la tua narrativa",
    intro:
      "Nessuno vieta il tuo romanzo. Diventa solo peggiore, in silenzio. Quattro schemi che ogni autore incontra:",
    refuse:
      "Il rifiuto: la scena è troppo violenta, troppo sessuale, troppo crudele. Il modello non la scrive proprio.",
    aside:
      "La predica: la scena viene scritta, poi un paragrafo ti ricorda che la violenza è sbagliata.",
    fade: "La dissolvenza in nero: la storia si ferma proprio dove la scena doveva cominciare.",
    flatten:
      "Il cattivo spuntato: ogni antagonista diventa ragionevole, ogni crudeltà si scusa. Il conflitto muore.",
    callout:
      "La narrativa ha bisogno del buio per significare qualcosa. Un modello che non sa scrivere il momento peggiore non sa scrivere nemmeno la redenzione.",
  },
  models: {
    title: "{{count}} modelli senza censura per la narrativa",
    intro:
      "Tutti i modelli senza censura attuali su {{appName}} indicati per scrittura creativa o roleplay dark, dal più economico. Le pagine mostrano quanto testo entra insieme nella memoria del modello: i tuoi appunti, i capitoli scritti finora e la nuova scena.",
    footnote:
      "Le pagine sono la finestra di contesto convertita in pagine stampate di prosa. Per messaggio indica uno scambio di riferimento sulla rotta più economica. Scene lunghe e chat lunghe costano di più.",
  },
  table: {
    model: "Modello",
    context: "Contesto",
    pages: "Ricorda",
    pagesValue: "circa {{pages}} pagine",
    strengths: "Punto forte",
    price: "Per messaggio",
    chat: "Provalo",
    chatLink: "Scrivi con {{model}}",
  },
  picks: {
    title: "Scegli in base al lavoro che hai davanti",
    intro:
      "Nessun modello è il migliore in ogni parte di un libro. Queste sono le nostre scelte per ogni lavoro. Ogni numero qui sotto viene dal registro.",
    dark: {
      title: "Scene dark e tabù: {{model}}",
      body: "Indicato per roleplay dark e scrittura creativa. Resta nella scena quando diventa violenta, crudele o esplicita, senza la predica finale. Ricorda circa {{pages}} pagine. {{price}} per messaggio.",
    },
    long: {
      title: "Manoscritti lunghi: {{model}}",
      body: "La memoria più grande tra i modelli per la narrativa, e la più economica: {{context}} token, circa {{pages}} pagine. Incolla scaletta, bibbia dei personaggi e ultimi capitoli, e tiene insieme tutte le trame. {{price}} per messaggio.",
    },
    voice: {
      title: "Una voce che il mainstream non ha: {{model}}",
      body: "Addestrato su libri e documenti banditi dall'internet mainstream. Il risultato è un modello con opinioni politiche controcorrente. Per personaggi la cui visione del mondo non deve sembrare un comunicato stampa aziendale. Il suo limite: circa {{pages}} pagine di memoria, quindi dagli una scena alla volta. {{price}} per messaggio.",
    },
    polish: {
      title: "Struttura e revisione: {{model}}",
      body: "Un modello base di punta a cui sono stati tolti i rifiuti. Forte nel ragionamento: usalo per buchi di trama, ritmo ed editing riga per riga dei capitoli oscuri che gli altri assistenti non toccano. Ricorda circa {{pages}} pagine. {{price}} per messaggio.",
    },
    draft: {
      title: "Prime stesure economiche: {{model}}",
      body: "Il prezzo più basso tra gli altri modelli per la narrativa. Lanciagli idee, genera dieci incipit, tienine uno. Ricorda circa {{pages}} pagine. {{price}} per messaggio.",
    },
  },
  workflow: {
    title: "Un metodo per arrivare in fondo al libro",
    intro:
      "Tratta l'IA come un coautore che dirigi, non come un distributore automatico.",
    outline: {
      title: "Parti dalla bibbia",
      body: "Incolla scaletta, personaggi e note sul tono nel primo messaggio. Non chiedere ancora nulla. Lascia che confermi cosa ha capito.",
    },
    scene: {
      title: "Una scena per richiesta",
      body: "Indica punto di vista, passaggio della trama e lunghezza. Scena per scena la voce resta compatta e il costo basso.",
    },
    switch: {
      title: "Cambia modello a metà capitolo",
      body: "Scrivi la scena brutale con un modello, rivedila con un altro. La chat conserva la cronologia quando cambi, non si perde nulla.",
    },
    revise: {
      title: "Riscrivi con la tua voce",
      body: "Chiedi opzioni, non pagine finite. Scegli le frasi, riscrivile, rimandale. Il libro resta tuo.",
    },
  },
  skills: {
    title: "Skill pensate per la narrativa",
    intro:
      "Una skill imposta persona di scrittura e modello con un clic. Usala così com'è oppure copiala e personalizzala.",
    writer:
      "Uncensored Writer: narrativa dark e scene per adulti, niente addolcito",
    storyteller: "Storyteller: storie lunghe con struttura e ritmo",
    roleplay:
      "Preferisci giocare la storia invece di scriverla? Roleplay con l'IA senza filtri",
  },
  limits: {
    title: "Cosa significa qui senza censura, e cosa no",
    intro: "Senza censura riguarda la tua narrativa. Non è un lasciapassare.",
    adult:
      "I modelli senza censura chiedono una volta sola una conferma 18+. Dopo, i temi adulti tra adulti nella narrativa sono una tua scelta.",
    terms:
      "I termini vietano comunque contenuti illegali, molestie e tutto ciò che mira a danneggiare persone reali. Quel limite non si sposta.",
    rights:
      "Tutti i diritti sul tuo testo restano tuoi. Lo dicono i nostri termini, e non rivendichiamo alcuna proprietà su ciò che scrivi.",
    incognito:
      "Le chat in incognito sono salvate nel tuo browser, non sui nostri server. Il fornitore che fa girare il modello vede comunque ogni prompt per poter rispondere.",
    kindsLink:
      "Abliterated, fine-tuned o con una visione propria: come si distinguono i modelli",
  },
  pairs: {
    title: "Confronta i modelli per la narrativa fianco a fianco",
    intro:
      "Contesto, prezzo e filtro uno accanto all'altro, prima di spendere un credito.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore IA senza censura per scrivere narrativa?",
      a: "Dipende dal lavoro. Un modello calibrato per il roleplay dark scrive le scene più dure, un modello da 1M di token regge un manoscritto intero, e {{ownModel}} porta una visione del mondo che i modelli mainstream non hanno. Su {{appName}} passi da uno all'altro dei {{count}} modelli per la narrativa nella stessa chat.",
    },
    free: {
      q: "Esiste un'IA gratuita e senza censura per scrivere storie?",
      a: "Ricevi {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account gratuito, {{maxCredits}} con la newsletter. Bastano per un buon numero di scene sui modelli più economici. Per progetti più lunghi i piani partono da {{subPrice}} al mese.",
    },
    adult: {
      q: "Un'IA senza censura può scrivere narrativa per adulti e NSFW?",
      a: "Sì, dopo una conferma 18+ una tantum. I modelli senza censura scrivono scene per adulti tra adulti senza dissolvenza in nero. I contenuti illegali restano vietati dai nostri termini, qualunque cosa farebbe il modello.",
    },
    novel: {
      q: "Un'IA riesce a seguire un romanzo intero?",
      a: "I modelli più grandi qui ricordano circa {{maxPages}} pagine alla volta, abbastanza per scaletta, bibbia dei personaggi e molti capitoli. I modelli più piccoli nei progetti lunghi dimenticano le prime scene, quindi riassumi man mano.",
    },
    rights: {
      q: "Di chi è il testo che un'IA scrive per me?",
      a: "Su {{appName}} è tuo. I nostri termini dicono che conservi tutti i diritti sulle tue conversazioni e che non rivendichiamo alcuna proprietà sui tuoi contenuti. Verifica le regole sul diritto d'autore per le opere scritte con l'IA dove pubblichi.",
    },
    kinds: {
      q: "Modello abliterated o UncensoredLM per la narrativa?",
      a: "I modelli abliterated sono modelli mainstream a cui sono stati tagliati i rifiuti: stessa abilità, stessa visione del mondo, scrivono la scena e basta. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream. Il risultato è un modello con opinioni politiche controcorrente. La sua memoria è più piccola: circa {{ownPages}} pagine.",
    },
    bestLink: "Il miglior LLM senza censura, scelto per compito",
    jailbreakLink:
      "Perché il jailbreak di ChatGPT per la narrativa continua a fallire",
    chatLink: "Chat IA senza censura nel browser",
  },
  cta: {
    title: "Scrivi il capitolo che continui a rimandare.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, nessun account richiesto. Scegli un modello per la narrativa e cambialo quando vuoi.",
    start: "Inizia a scrivere",
    models: "Confronta tutti i modelli",
  },
};
