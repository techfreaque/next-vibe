import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "LLM senza censura online, senza GPU | {{appName}}",
    description:
      "LLM senza censura online, senza scheda grafica. Quanta VRAM serve ai modelli locali, quali modelli abliterated girano nel browser e quanto costa un messaggio.",
    category: "Guida ai modelli",
    imageAlt: "Un LLM senza censura online, senza GPU",
    keywords:
      "LLM senza censura online, LLM senza censura senza GPU, alternativa online al LLM locale, IA senza censura senza scheda grafica, modello abliterated online, modello senza censura nel browser, VRAM per LLM locale, alternativa a Ollama online, alternativa a LM Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida ai modelli",
    readTime: "8 min di lettura",
    title: "LLM senza censura online. Niente GPU. Niente installazione.",
    subtitle:
      "Cosa chiede davvero al tuo hardware un modello senza censura in locale, e {{count}} modelli senza censura che girano invece in una scheda del browser. Prezzi e contesto letti in tempo reale dal nostro registro modelli.",
  },
  intro: {
    lead: "Ogni guida ai modelli senza censura dice la stessa cosa: scaricalo, fallo girare in locale. Poi guardi la tua scheda grafica. I modelli grandi chiedono più memoria di quanta ne abbia qualsiasi PC da gaming. Quelli piccoli che ci stanno non sono quelli di cui parlano tutti.",
    p2: "C'è una seconda strada. Lo stesso tipo di modelli, in hosting, in una scheda del browser. Niente GPU, niente driver, niente download da 40 GB. Questa guida mostra cosa richiede davvero il locale, quando vince ancora e quali {{count}} modelli senza censura girano su {{appName}} in questo momento.",
  },
  table: {
    model: "Modello",
    context: "Contesto",
    price: "Per messaggio",
  },
  hardware: {
    title: "Cosa richiede davvero il locale",
    intro:
      "Il muro è la memoria. I pesi del modello devono stare nella VRAM della scheda (o nella memoria unificata di un Mac) per girare a una velocità usabile. Ecco i modelli senza censura del nostro catalogo con numero di parametri pubblicato.",
    colParams: "Parametri",
    colMemory: "Pesi a 4 bit / 8 bit",
    paramsValue: "{{count}} mld",
    memoryValue: "{{q4}} GB / {{q8}} GB",
    unknown: "Non pubblicato",
    footnote:
      "Solo i pesi, calcolati dal numero di parametri: circa 0,5 GB per miliardo di parametri a 4 bit, 1 GB a 8 bit. Il contesto (KV cache) e il runtime vanno aggiunti, e le chat lunghe chiedono molto di più.",
    small:
      "Fino a circa 12 GB di pesi: ci sta una scheda da 16 GB con margine per il contesto.",
    mid: "Da 20 a 40 GB: una scheda da 24 GB a 4 bit con contesto breve, due schede, oppure un Mac con tanta memoria unificata.",
    large:
      "Centinaia di GB: nessun computer di casa. Sono i modelli di taglia frontier, e l'unico modo pratico per usarli è l'hosting.",
    callout:
      "La quantizzazione riduce il file e costa un po' di qualità. La versione a 4 bit di un modello medio non è la stessa esperienza del modello completo nel cloud.",
  },
  local: {
    title: "Quando il locale resta la scelta giusta",
    intro:
      "Il locale non è sbagliato. È uno scambio. Strumenti come Ollama e LM Studio lo rendono semplice se l'hardware regge.",
    winsTitle: "Dove vince il locale",
    offline:
      "Offline: niente internet, niente account, nessun fornitore in mezzo. Nulla lascia la macchina.",
    catchTitle: "Il rovescio",
    verdict:
      "In breve: hai una GPU potente, vuoi privacy totale e ti basta un modello medio? Fallo girare in locale. Vuoi i modelli grandi, un contesto lungo o semplicemente una risposta entro un minuto? Usalo online.",
  },
  online: {
    title: "{{count}} modelli senza censura direttamente nel browser",
    intro:
      "Tutti i modelli senza censura attuali su {{appName}}, dal più economico. Contesto e prezzo per messaggio arrivano direttamente dal nostro registro modelli. Clicca un modello e chatta.",
    colChat: "Provalo",
    chatLink: "Chatta con {{model}}",
    footnote:
      "Per messaggio significa uno scambio di riferimento sulla rotta più economica. Chat lunghe e risposte lunghe costano di più. Tutti girano su server, al tuo portatile basta un browser.",
    directoryLink: "Tutti i modelli abliterated, con contesto e prezzo",
  },
  steps: {
    title: "Da zero a una risposta in un minuto",
    intro: "Nessun download, nessun account per iniziare.",
    open: {
      title: "Apri una chat",
      body: "Clicca un modello qui sopra o avvia una chat in incognito. Gli ospiti ricevono {{guestCredits}} crediti gratuiti al mese.",
    },
    pick: {
      title: "Scegli il modello",
      body: "Nel selettore scegli il livello senza censura. Cambia a metà conversazione quando vuoi, la cronologia resta.",
    },
    confirm: {
      title: "Conferma i 18 anni",
      body: "I modelli senza censura chiedono una sola volta la conferma della maggiore età e i termini. Poi restano sbloccati.",
    },
    ask: {
      title: "Fai la domanda vera",
      body: "Quella che gli altri assistenti schivano. Niente prompt di jailbreak, niente travestimento da gioco di ruolo.",
    },
  },
  kinds: {
    title: "Due tipi di senza censura, entrambi online",
    intro: "Non tutti i modelli senza censura lo sono allo stesso modo.",
    abliterated:
      "Versioni abliterated e fine-tuned: modelli mainstream o aperti, leggermente modificati per non schivare più le domande. Stesso addestramento, stessa visione del mondo. Rispondono e basta.",
    own: "{{ownModel}}: addestrato su libri e documenti banditi dall'internet mainstream. Il risultato è un modello con opinioni politiche controcorrente. Gira in hosting, tramite uncensored.ai.",
    link: "Abliterated, fine-tuned o visione propria: le differenze",
  },
  privacy: {
    title: "Cosa vede un modello in hosting",
    intro:
      "Online vuol dire che il modello gira sul server di qualcun altro. Ecco esattamente chi vede cosa.",
    transit:
      "Ogni messaggio passa dal nostro server al fornitore che fa girare il modello. Il fornitore vede il prompt, secondo le sue condizioni. Ogni IA in hosting funziona così.",
    incognito:
      "Le chat in incognito sono salvate nella memoria locale del tuo browser, non sui nostri server. Cancella i dati del browser e spariscono.",
    selfHost:
      "{{appName}} è open source. Ospitalo tu e collegalo ai tuoi modelli locali quando nulla deve uscire dalla tua macchina.",
    selfHostLink: "Ospita {{appName}} in proprio",
    callout:
      "Se un prompt non deve mai lasciare il tuo hardware, usa il locale. Per tutto il resto l'hosting è la via veloce.",
  },
  cost: {
    title: "Quanto costa, locale contro online",
    intro: "In locale non c'è prezzo per messaggio. Il prezzo è l'hardware.",
    guest:
      "Online da noi: {{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account gratuito, {{maxCredits}} con la newsletter.",
    plan: "Piani da {{subPrice}} al mese. I pacchetti di crediti ricaricano un piano attivo e non scadono mai.",
    local:
      "In locale: gratis per messaggio, ma una GPU che regge i modelli grandi costa più di anni di chat in hosting. Più la corrente.",
  },
  pairs: {
    title: "Il modello base accanto alla sua versione senza censura",
    intro:
      "Stesso laboratorio, stessa taglia, senza rifiuti. Confronta contesto, prezzo e filtro fianco a fianco.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    gpu: {
      q: "Posso usare un LLM senza censura senza GPU?",
      a: "Sì, in hosting. Il modello gira sui server del fornitore, ti serve solo un browser. Su {{appName}} sono {{count}} modelli senza censura, compresi quelli di taglia frontier che nessun PC di casa può reggere.",
    },
    free: {
      q: "Esiste un LLM senza censura gratis online?",
      a: "Su {{appName}} ricevi {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account gratuito, {{maxCredits}} con la newsletter. Quanti messaggi siano dipende dal modello e dalla lunghezza della chat. I modelli senza censura chiedono una conferma 18+ una sola volta.",
    },
    vram: {
      q: "Quanta VRAM serve per un modello senza censura in locale?",
      a: "Regola pratica per i pesi: circa 0,5 GB per miliardo di parametri a 4 bit, 1 GB a 8 bit. Un modello 24B chiede circa 12 GB a 4 bit, un modello 70B circa 35-40 GB. Contesto e runtime si aggiungono.",
    },
    private: {
      q: "Un LLM senza censura online è privato?",
      a: "Meno del locale. Il fornitore che fa girare il modello vede il tuo prompt. Su {{appName}} le chat in incognito restano nella memoria del tuo browser, non sui nostri server. Per i prompt che non devono mai lasciare la macchina, usa il locale.",
    },
    offline: {
      q: "Posso usare un modello senza censura offline?",
      a: "Non uno in hosting. Offline vuol dire locale: scarica un modello che ti sta in memoria e fallo girare con uno strumento come Ollama o LM Studio.",
    },
    truly: {
      q: "I modelli abliterated sono davvero senza censura?",
      a: "Smettono di rifiutare, ma tengono l'addestramento e la visione del mondo del modello base. {{ownModel}} è diverso: addestrato su libri e documenti banditi dall'internet mainstream, con il risultato di un modello con opinioni politiche controcorrente.",
    },
    chatLink: "Chat IA senza censura nel browser",
    platformsLink:
      "Piattaforme IA senza censura a confronto, strumenti locali inclusi",
  },
  cta: {
    title: "Salta il download. Chiedi adesso.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, nessun account. Scegli un modello senza censura e cambia quando vuoi.",
    start: "Avvia una chat senza censura",
    models: "Confronta tutti i modelli",
  },
};
