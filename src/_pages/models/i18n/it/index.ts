import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  compareHub: {
    title: "Confronta i modelli IA",
    description:
      "Confronta i modelli IA disponibili per prezzo, finestra di contesto, funzionalità e filtri sui contenuti.",
  },
  meta: {
    category: "Modelli IA",
    index: {
      title:
        "{{count}} modelli di chat IA: prezzi, contesto e filtri | {{appName}}",
      description:
        "Tutti i modelli di {{appName}} in un elenco. Claude, GPT, Gemini, Grok e DeepSeek. Chat aperte e senza censura, oltre a immagini, voce, musica e video. Prezzi per utilizzo, finestre di contesto e input supportati. Scegli un modello e provalo.",
      imageAlt: "Catalogo dei modelli IA su {{appName}}",
      keywords:
        "modelli IA, confronto LLM, IA senza censura, IA open source, prezzi IA, {{appName}}",
    },
    model: {
      title: "{{model}}: prezzo, API e contesto di {{context}} | {{appName}}",
      titleShort: "{{model}}: prezzo, API e contesto di {{context}}",
      titleMin: "{{model}}: prezzo e API",
      titleUncensored:
        "{{model}}: chat IA senza censura online, prezzo e API | {{appName}}",
      titleUncensoredShort:
        "{{model}}: chat IA senza censura online, prezzo e API",
      titleUncensoredMin: "{{model}}: chat IA senza censura",
      titleLegacy:
        "{{model}}: prezzo e contesto (modello precedente) | {{appName}}",
      titleLegacyShort: "{{model}}: prezzo e contesto (modello precedente)",
      description:
        "{{model}} di {{lab}}: {{input}} in ingresso e {{output}} in uscita per milione di token. Contesto di {{context}}, circa {{credits}} crediti a messaggio. Inizia con crediti gratuiti.",
      descriptionFlat:
        "{{model}} di {{lab}}: circa {{credits}} crediti ({{money}}) a messaggio, contesto di {{context}}, categoria {{tier}}. Inizia con crediti gratuiti.",
      descriptionUncensored:
        "Chatta con {{model}} online o usalo via API. {{input}} in ingresso e {{output}} in uscita per milione di token, contesto di {{context}}. Crediti gratuiti per gli ospiti, una sola conferma dei 18 anni.",
      descriptionUncensoredFlat:
        "Chatta con {{model}} online o usalo via API. Circa {{credits}} crediti ({{money}}) a messaggio, contesto di {{context}}. Crediti gratuiti per gli ospiti, una sola conferma dei 18 anni.",
      descriptionLegacy:
        "{{model}} di {{lab}} è un modello precedente, ora sostituito da {{successor}}. Contesto di {{context}}, circa {{credits}} crediti a messaggio. Specifiche, prezzo e modello successivo.",
      descriptionLegacyNoSuccessor:
        "{{model}} di {{lab}} è un modello precedente. Contesto di {{context}}, circa {{credits}} crediti a messaggio. Specifiche, prezzo e alternative attuali.",
      imageAlt: "{{model}} su {{appName}}",
      keywords:
        "{{model}}, prezzo {{model}}, API {{model}}, finestra di contesto {{model}}, IA di {{lab}}, {{appName}}",
    },
    media: {
      title:
        "Prezzo di {{model}}: {{credits}} crediti per {{unit}} | {{appName}}",
      titleShort: "Prezzo di {{model}}: {{credits}} crediti per {{unit}}",
      titleMin: "Prezzo di {{model}} per {{unit}}",
      titleNoPrice:
        "{{model}}: prezzo e uso dell’IA per {{type}} | {{appName}}",
      titleNoPriceShort: "{{model}}: prezzo e uso dell’IA per {{type}}",
      description:
        "{{model}} di {{lab}} ({{type}}): {{credits}} crediti ({{money}}) per {{unit}}. Input: {{inputs}}. Usalo nello strumento di creazione o dalla chat. Inizia con crediti gratuiti.",
      descriptionNoPrice:
        "{{model}} di {{lab}} ({{type}}), categoria {{tier}}. Prezzo effettivo in crediti per utilizzo. Usalo nello strumento di creazione o dalla chat. Inizia con crediti gratuiti.",
      imageAlt: "{{model}} su {{appName}}",
      keywords:
        "{{model}}, prezzo {{model}}, IA di {{lab}}, modello IA per {{type}}, {{appName}}",
    },
    compare: {
      title: "{{a}} e {{b}} a confronto: prezzo e contesto | {{appName}}",
      titleShort: "{{a}} e {{b}} a confronto: prezzo e contesto",
      titleMin: "{{a}} e {{b}} a confronto",
      description:
        "{{a}} ({{tierA}}) e {{b}} ({{tierB}}) a confronto: circa {{moneyA}} contro {{moneyB}} a messaggio, contesto di {{contextA}} contro {{contextB}}. Quale scegliere, dati alla mano.",
      descriptionShort:
        "{{a}} ({{tierA}}) e {{b}} ({{tierB}}) a confronto: circa {{moneyA}} contro {{moneyB}} a messaggio, contesto di {{contextA}} contro {{contextB}}.",
      imageAlt: "{{a}} e {{b}} a confronto su {{appName}}",
      keywords:
        "{{a}} vs {{b}}, {{a}}, {{b}}, confronto modelli IA, {{appName}}",
    },
  },
  tiers: {
    mainstream: {
      name: "Tradizionali",
      line: "I modelli dei grandi laboratori, con i loro filtri di sicurezza. Per lavoro, codice e ricerca.",
    },
    open: {
      name: "Aperti",
      line: "Modelli a pesi aperti con filtri più leggeri. Più risposte, meno rifiuti.",
    },
    uncensored: {
      name: "Senza censura",
      line: "Modelli per conversare e creare con meno restrizioni.",
    },
  },
  modality: {
    text: "Testo",
    image: "Immagini",
    audio: "Audio",
    video: "Video",
  },
  facts: {
    heading: "Specifiche",
    type: "Tipo di modello",
    lab: "Prodotto da",
    tier: "Categoria di contenuti",
    intelligence: "Intelligenza",
    price: "Prezzo stimato per messaggio",
    priceValue: "Circa {{credits}} crediti ({{money}})",
    priceFree: "Gratis",
    referenceTurn:
      "Messaggio di riferimento con {{input}} token in ingresso e {{output}} token in uscita.",
    referenceImageTurn:
      "Messaggio di riferimento con {{input}} token in ingresso, {{output}} token di testo in uscita e un’immagine generata.",
    priceProvider: "Tariffe di {{provider}}.",
    conditionalPrice: "Tariffe per fascia e per milione di token",
    tierAt: "Da {{tokens}} token di ingresso: {{rates}}.",
    tierUtc: "Dalle {{start}} alle {{end}} UTC: {{rates}}.",
    tierInput: "ingresso {{price}}",
    tierOutput: "uscita {{price}}",
    tierRead: "lettura dalla cache {{price}}",
    tierWrite: "scrittura in cache {{price}}",
    tierHour: "scrittura per un’ora {{price}}",
    cacheReadSentence: "Un milione di token letti dalla cache costa {{price}}.",
    cacheWrite1hPrice: "Scrittura in cache per un’ora per milione di token",
    cacheWrite1hSentence:
      "Scrivere un milione di token nella cache per un’ora costa {{price}}.",
    cacheWriteSentence:
      "Scrivere un milione di token nella cache costa {{price}}.",
    cacheReadPrice: "Input in cache per milione di token",
    cacheWritePrice: "Scrittura in cache per milione di token",
    imageOutputPrice: "Output di immagini per milione di token",
    perMillionCredits: "{{credits}} crediti",
    priceFootnote:
      "Il costo dipende dall’uso e dal fornitore. Gli importi in valuta sono stimati al tasso di {{value}} per credito del pacchetto a pagamento una tantum.",
    context: "Finestra di contesto",
    contextValue: "{{tokens}} token",
    contextHint: "Circa {{pages}} pagine di testo in una volta",
    inputs: "Formati in ingresso",
    outputs: "Formati in uscita",
    providers: "Fornitori",
    tools: "Uso di strumenti",
    toolsYes: "Sì, ricerca, memoria, codice e altro",
    toolsNo: "No, solo chat",
    status: "Stato",
    statusCurrent: "Attuale",
    statusLegacy: "Precedente",
    tokenPrice: "Prezzo per milione di token",
    tokenPriceValue: "{{input}} in ingresso, {{output}} in uscita",
    tokenPriceHint: "{{inputCredits}} / {{outputCredits}} crediti",
    parameters: "Dimensioni",
    parametersValue: "{{count}} miliardi di parametri",
    strengths: "Punti di forza",
    uncensoredKind: "Tipo di rimozione della censura",
    apiId: "ID del modello per l’API",
    apiIdHint:
      "API compatibile con OpenAI e Anthropic. Serve un account a pagamento, con qualsiasi piano.",
    apiIdLegacy: "Non più disponibile via API. Usa {{successor}}.",
    apiIdLegacyNoSuccessor: "Non più disponibile via API.",
    notListed: "Non in elenco",
    notUncensored: "Con filtri",
    fixedPrice: "Prezzo fisso per messaggio.",
    notPublished: "Non pubblicato",
    apiIdUnsupported: "Il modello non è disponibile nell’API di chat testuale.",
  },
  strengths: {
    coding: "Codice",
    reasoning: "Ragionamento",
    analysis: "Analisi",
    creative: "Scrittura creativa",
    roleplay: "Gioco di ruolo",
    roleplayDark: "Narrativa dark",
    fast: "Velocità",
    vision: "Visione",
    imageGen: "Generazione di immagini",
  },
  uncensoredKind: {
    ownWorldview: {
      name: "Visione del mondo propria",
      line: "Addestrato su libri e documenti banditi dall’Internet mainstream, con posizioni politiche controcorrente.",
    },
    abliterated: {
      name: "Abliterato",
      line: "I pesi del modello di base sono stati modificati per ridurre i rifiuti.",
    },
    fineTuned: {
      name: "Con fine-tuning",
      line: "Un modello esistente è stato sottoposto a fine-tuning per rispondere con meno restrizioni.",
    },
    unlisted: {
      name: "Metodo non dichiarato",
      line: "Il modello è nella categoria senza censura. Non è noto come sia stato addestrato o come siano stati modificati i filtri.",
    },
  },
  units: {
    image: "immagine",
    audio: "traccia",
    video: "clip di {{seconds}} s",
    videoClip: "clip",
    tts: "{{chars}} caratteri",
    stt: "{{seconds}} s di audio",
  },
  bestFor: {
    heading: "Per cosa usare {{model}}",
    good: "Usalo per",
    skip: "Evitalo per",
    items: {
      coding: "Scrivere, rivedere e correggere codice",
      reasoning:
        "Ragionare in più passaggi: matematica, logica, pianificazione",
      analysis: "Fare ricerca e analizzare materiali lunghi",
      creative: "Scrittura creativa e idee",
      roleplay: "Gioco di ruolo e narrativa interattiva",
      roleplayDark: "Narrativa dark e temi tabù",
      fast: "Risposte rapide quando conta la velocità",
      vision: "Leggere schermate, foto e scansioni",
      videoInput: "Comprendere i video",
      audioInput: "Ascoltare l’audio",
      imageGen: "Generare immagini in chat",
      longContext:
        "Elaborare interi libri o progetti di codice con un solo prompt",
      budget: "Gestire grandi volumi con un budget ridotto",
      tools: "Usare agenti con strumenti di ricerca, memoria e codice",
      uncensored: "Fare domande a cui i modelli tradizionali non rispondono",
      ownWorldview: "Esplorare posizioni politiche controcorrente",
    },
    skipItems: {
      noTools:
        "Flussi di lavoro con agenti: non supporta le chiamate agli strumenti",
      noImages: "Attività che richiedono immagini in ingresso",
      pricey:
        "Lavori su larga scala a {{credits}} crediti per messaggio di riferimento",
      smallContext:
        "Documenti molto lunghi: la finestra di contesto si ferma a {{tokens}} token",
      filtered:
        "Argomenti filtrati da {{lab}}: per questi usa un modello senza censura",
      legacy: "Nuovi progetti: usa il successore {{successor}}",
      legacyNoSuccessor: "Nuovi progetti: è un modello precedente",
      coding: "Lavori con molto codice",
      analysis: "Analisi approfondita",
      reasoning: "Ragionamento complesso",
      creative: "Scrittura creativa",
      roleplay: "Interpretare personaggi",
    },
    media: {
      image: "Generare immagini",
      video: "Generare clip video",
      audio: "Generare musica",
      tts: "Convertire testo in voce",
      stt: "Trascrivere registrazioni vocali",
      otherOutputs: "Attività che richiedono output diversi da {{outputs}}",
    },
    picks: {
      claudeOpus:
        "Il modello di punta di Anthropic per i lavori impegnativi: grandi progetti di codice, analisi minuziose e testi che richiedono giudizio. Costa di più a messaggio. Usalo quando vale la pena investire nella qualità.",
      claudeSonnet:
        "Claude per tutti i giorni. Forte con codice, analisi e scrittura. Costa meno di Opus, quindi puoi usarlo ogni giorno senza prosciugare i crediti.",
      claudeHaiku:
        "Un Claude veloce ed economico per risposte rapide, riassunti e codice semplice. Legge anche le schermate.",
      gptSol:
        "Usa Sol per programmare, analizzare documenti e lavorare con strumenti esterni. Accetta testo e immagini.",
      gptLuna:
        "Il modello veloce ed economico di OpenAI per le chat di tutti i giorni e le ricerche rapide.",
      geminiArgon:
        "Il modello di punta di Google legge testo, immagini, video e audio. Forte con il ragionamento e il codice quando lavori con più formati.",
      geminiFlash:
        "Un Gemini veloce che legge anche immagini, video e audio. Conveniente per analisi e codice in tempi stretti.",
      grok: "Il modello di punta di xAI, con filtri più leggeri rispetto agli altri grandi laboratori. Buon ragionamento, buon codice e meno rifiuti.",
      deepseekPro:
        "Il grande modello di ragionamento di DeepSeek. Codice e analisi di alto livello a una frazione del prezzo dei modelli di punta chiusi.",
      deepseekFlash:
        "Tra i modelli più economici che offrono buone prestazioni. Rapido con codice e analisi, legge le immagini e regge alti volumi.",
      glm: "Il modello aperto di Z.AI per codice e ragionamento. Risposte valide a un prezzo contenuto.",
      kimi: "Il modello di punta di Moonshot per ragionamento, codice e scrittura creativa. Legge immagini e video.",
      qwenMax:
        "Il Qwen di punta di Alibaba. Ragionamento, codice e analisi. Legge immagini e video.",
      mistralLarge:
        "Il modello di punta della francese Mistral. Solido con codice e analisi, legge anche le immagini.",
      metaWonder:
        "Il miglior modello di Meta. Legge testo, immagini, video e audio. Forte nel ragionamento, nel codice e nei lavori creativi.",
      uncensoredLm:
        "Il modello senza censura con una visione del mondo propria. È addestrato su libri e documenti banditi dall’Internet mainstream e propone posizioni politiche che i grandi laboratori non ti offrono.",
      glmUncensored:
        "GLM 5.3 abliterato per ragionamento, codice e analisi. Supporta le chiamate agli strumenti.",
      glmFlashUncensored:
        "GLM 5.3 Flash abliterato per risposte rapide e prompt con immagini.",
      deepseekFlashUncensored:
        "DeepSeek V4.1 Flash abliterato per codice, analisi e narrativa. Accetta immagini.",
      veniceUncensored:
        "Il modello di chat di Venice con fine-tuning per scrittura creativa e gioco di ruolo.",
    },
  },
  related: {
    heading: "Modelli simili",
    intro:
      "Dallo stesso laboratorio, nella stessa categoria o a un prezzo più basso. Ogni modello ha una pagina dedicata.",
    reasons: {
      uncensored: "Versione senza censura",
      original: "Modello originale",
      cheaper: "Più economico, stessa categoria",
      sameLab: "Sempre di {{lab}}",
      sameTier: "Stessa categoria",
      sameType: "Stesso tipo",
    },
    perMessage: "Circa {{credits}} crediti a messaggio",
    perUse: "{{credits}} crediti per {{unit}}",
  },
  plans: {
    heading: "{{model}}: quanto copre ogni piano",
    intro:
      "Un messaggio di riferimento con {{model}} costa circa {{credits}} crediti ({{money}}). Ecco quanto copre ogni piano in un mese.",
    mediaIntro:
      "Con {{model}} un utilizzo ({{unit}}) costa {{credits}} crediti ({{money}}). Ecco quanto copre ogni piano in un mese.",
    messages: "Messaggi al mese",
    uses: "Utilizzi al mese",
    colPlan: "Piano",
    colPrice: "Prezzo al mese",
    colCredits: "Crediti al mese",
    guest: "Ospite, senza registrazione",
    account: "Account gratuito",
    free: "Gratis",
    about: "circa {{count}}",
    underOne: "meno di 1",
    footnote:
      "Prompt lunghi, file e chiamate agli strumenti consumano più crediti a messaggio. Gli stessi crediti valgono per ogni modello.",
    mediaFootnote:
      "Durata, dimensioni o qualità cambiano il costo di ogni utilizzo. Gli stessi crediti valgono per ogni modello.",
  },
  nearest: {
    heading: "{{model}} contro le alternative più vicine",
    intro:
      "Prezzo, contesto e categoria fianco a fianco. Il confronto diretto mostra il resto.",
    colModel: "Modello",
    colPrice: "Prezzo a messaggio",
    colCompare: "Confronto diretto",
    thisModel: "Questa pagina",
  },
  faq: {
    heading: "{{model}}: domande e risposte",
    price: {
      q: "Quanto costa {{model}}?",
      aTokens:
        "Circa {{credits}} crediti ({{money}}) per un messaggio di riferimento tramite {{provider}}. Per milione di token: {{input}} in ingresso e {{output}} per il testo in uscita.",
      aFlat:
        "{{credits}} crediti ({{money}}) a messaggio tramite {{provider}}.",
      aFree: "I messaggi con {{model}} non consumano crediti.",
    },
    uncensored: {
      q: "{{model}} è senza censura?",
      mainstream:
        "No. {{model}} mantiene i filtri di sicurezza di {{lab}} e rifiuta alcuni argomenti. Per questi, passa a un modello senza censura nella stessa chat.",
      open: "{{model}} è nella categoria dei modelli aperti. Le sue risposte possono comunque essere filtrate.",
      yes: "Sì.",
      consent:
        "Per usare i modelli di chat senza censura devi confermare una volta di avere almeno 18 anni.",
    },
    api: {
      q: "Posso usare {{model}} via API?",
      a: "Sì. Usa l’ID {{id}} sull’API di {{appName}}, compatibile con i formati OpenAI e Anthropic. Serve un account a pagamento, con qualsiasi piano.",
      legacy:
        "{{model}} è un modello precedente e non è più disponibile via API. Usa {{successor}} ({{id}}). Serve un account a pagamento, con qualsiasi piano.",
      legacyNoSuccessor:
        "{{model}} è un modello precedente e non è più disponibile via API. GET /v1/models elenca tutti i modelli utilizzabili.",
    },
    context: {
      q: "Quanto è grande la finestra di contesto di {{model}}?",
      a: "{{tokens}} token. Sono circa {{pages}} pagine di testo in una volta.",
    },
    providers: {
      q: "Quali fornitori offrono {{model}} su questa piattaforma?",
      a: "Tra i fornitori disponibili: {{providers}}.",
    },
    inputs: {
      q: "Quali input e output supporta {{model}}?",
      modalities: "Input: {{inputs}}. Output: {{outputs}}.",
      toolsYes: "Supporta le chiamate agli strumenti.",
      toolsNo: "Le chiamate agli strumenti non sono disponibili.",
    },
    bestFor: {
      q: "Per cosa è adatto {{model}}?",
      a: "Ideale per: {{items}}.",
    },
    cheaper: {
      q: "Esiste un'alternativa più economica a {{model}}?",
      a: "{{other}}: stessa categoria, livello di intelligenza uguale o superiore, e circa {{otherCredits}} crediti per messaggio di riferimento invece di {{credits}}.",
    },
    free: {
      q: "{{model}} è gratis?",
      a: "Per provarlo sì. Gli ospiti ricevono {{guest}} crediti al mese senza registrazione, circa {{guestMessages}} messaggi con {{model}}. Un account gratuito ne ha {{account}}, circa {{accountMessages}} messaggi. I piani partono da {{planPrice}} al mese per {{planCredits}} crediti, circa {{planMessages}} messaggi.",
      aAccount:
        "Un messaggio di riferimento costa {{credits}} crediti, più dei {{guest}} crediti da ospite. Un account gratuito ha {{account}} crediti al mese, circa {{accountMessages}} messaggi con {{model}}. I piani partono da {{planPrice}} al mese per {{planCredits}} crediti, circa {{planMessages}} messaggi.",
      aPaid:
        "Non con i crediti gratuiti. Un messaggio di riferimento costa {{credits}} crediti, più dei {{account}} crediti gratuiti al mese. I piani partono da {{planPrice}} al mese per {{planCredits}} crediti, circa {{planMessages}} messaggi con {{model}}.",
    },
    versus: {
      q: "{{model}} o {{other}}: quale scegliere?",
      a: "{{model}} costa circa {{credits}} crediti per messaggio di riferimento, ha una finestra di contesto di {{context}} token e rientra nella categoria {{tier}}. {{other}} costa circa {{otherCredits}} crediti, gestisce {{otherContext}} token di contesto e rientra nella categoria {{otherTier}}. Entrambi girano nella stessa chat: cambia modello a metà conversazione e giudica tu.",
    },
    try: {
      q: "Come provo {{model}}?",
      a: "Apri una chat con {{model}} già selezionato. I nuovi visitatori ricevono crediti gratuiti per iniziare, senza carta.",
      aLegacy:
        "{{model}} è un modello precedente. Le nuove chat usano {{successor}}, che puoi provare con crediti gratuiti, senza carta.",
    },
  },
  mediaFaq: {
    price: {
      q: "Quanto costa {{model}}?",
      a: "{{credits}} crediti ({{money}}) per {{unit}} tramite {{provider}}. Opzioni come durata o dimensioni possono cambiare il costo.",
      aNone: "Al momento non c’è un prezzo di riferimento.",
    },
    use: {
      q: "Come si usa {{model}}?",
      a: "Apri lo strumento di creazione con {{model}} già selezionato e inizia.",
    },
    inputs: {
      q: "Quali input accetta {{model}}?",
      a: "Input: {{inputs}}. Output: {{outputs}}.",
    },
    uncensored: {
      q: "{{model}} è senza censura?",
      mainstream: "No. {{model}} usa i filtri di contenuto di {{lab}}.",
      open: "In parte. {{model}} ha filtri più leggeri rispetto ai modelli tradizionali, ma non è del tutto senza censura.",
      uncensored: "Questo modello è nella categoria senza censura.",
      consent:
        "Per usare i modelli senza censura devi confermare una volta di avere almeno 18 anni.",
    },
  },
  readMore: {
    heading: "Leggi anche",
    landings: {
      uncensored: {
        title: "Chat AI senza censura nel browser",
        excerpt:
          "Tutti i modelli senza censura in un elenco: contesto, prezzo a messaggio e link diretto alla chat.",
      },
      abliterated: {
        title: "Modelli AI abliterati da provare online",
        excerpt:
          "Modelli mainstream senza rifiuti. Contesto, prezzo a messaggio e link diretto alla chat.",
      },
    },
  },
  directory: {
    heading: "Tutte le schede dei modelli",
    intro:
      "Link diretti alle schede di tutti i {{count}} modelli, incluse le versioni precedenti.",
  },
  breadcrumb: {
    models: "Modelli IA",
  },
  jsonLd: {
    perMessage: "messaggio di riferimento",
    perCacheReadTokens: "token letti dalla cache",
    perCacheWrite1hTokens: "token scritti in cache per un’ora",
    perCacheWriteTokens: "token scritti nella cache",
    perInputTokens: "token in ingresso",
    perOutputTokens: "token in uscita",
  },
  chatPrompt: "In cosa eccelli? Mostramelo con un esempio breve e concreto.",
  catalog: {
    typesLabel: "Tipo di modello",
    types: {
      text: "Chat",
      tts: "Da testo a voce",
      stt: "Da voce a testo",
      image: "Immagini",
      audio: "Musica",
      video: "Video",
    },
    context: "Contesto di {{size}}",
    legacyBadge: "Precedente",
    count: "{{count}} modelli",
    showLegacy: "Mostra le versioni precedenti ({{count}})",
    hideLegacy: "Nascondi le versioni precedenti",
  },
  index: {
    eyebrow:
      "{{chat}} modelli di chat, più {{image}} per immagini, {{video}} per video, {{music}} per musica e {{voice}} per voce",
    title: "Tutti i modelli. Una sola chat.",
    subtitle:
      "Tradizionali, aperti e senza censura. Prezzi per messaggio e dimensioni di contesto reali. Il filtro lo scegli tu.",
    searchLabel: "Cerca modelli",
    searchPlaceholder:
      "Cerca per nome o laboratorio: Claude, DeepSeek, Venice…",
    tierCount: "{{count}} modelli",
    noResults: "Nessun modello corrisponde a «{{query}}».",
    legacyTitle: "Modelli precedenti",
    legacyIntro:
      "Le chat salvate e le skill che usano queste versioni passano automaticamente al modello successivo.",
    perMessage: "~{{credits}} cr/msg",
    free: "Gratis",
    ctaTitle: "Le specifiche dicono poco. Parla con un modello.",
    ctaSubtitle:
      "Apri una chat, scegli un modello e cambialo quando vuoi, anche a conversazione iniziata.",
    ctaButton: "Inizia a chattare",
  },
  model: {
    back: "Tutti i modelli",
    chatCta: "Prova {{model}} in chat",
    compareCta: "Confronta",
    legacyBanner:
      "{{model}} è un modello precedente. Apri {{successor}} per iniziare una nuova chat.",
    legacyCta: "Vedi {{successor}}",
    compareWith: "{{model}} e {{other}} a confronto",
    ctaTitle: "Prova {{model}} ora",
    ctaSubtitle:
      "Inizia con crediti gratuiti, senza carta. La chat si apre con {{model}} già selezionato e un prompt pronto da inviare.",
  },
  media: {
    priceValue: "{{credits}} crediti per {{unit}}",
    priceProvider: "Circa {{price}} tramite {{provider}}.",
    priceLabel: "Prezzo per utilizzo",
    generateCta: "Genera con {{model}}",
    useCta: "Usa {{model}}",
    priceFootnote:
      "Gli importi in valuta sono stimati al tasso di {{value}} per credito del pacchetto a pagamento una tantum.",
    ctaTitle: "Prova {{model}} ora",
    ctaSubtitle:
      "Inizia con crediti gratuiti, senza carta. Il generatore si apre con {{model}} già selezionato.",
  },
  compare: {
    back: "Tutti i modelli",
    eyebrow: "Testa a testa",
    title: "{{a}} e {{b}} a confronto",
    subtitle:
      "Prezzo, contesto, input e filtri. I numeri che servono per scegliere.",
    fact: "Specifiche",
    cheaper: "{{model}} costa {{times}} volte meno a messaggio.",
    samePrice: "I due modelli costano circa lo stesso a messaggio.",
    biggerContext: "{{model}} ha un contesto {{times}} volte più ampio.",
    sameContext: "I due modelli hanno un contesto della stessa ampiezza.",
    modelPage: "Scheda di {{model}}",
    swap: "Inverti l’ordine",
    cheaperFree: "{{model}} non costa crediti a messaggio.",
    tierLine:
      "Categoria di {{model}}: {{tier}}. Categoria di {{other}}: {{otherTier}}.",
    verdictHeading: "Quale scegliere?",
    verdictIntro:
      "Direttamente dai dati: prezzo, contesto, filtri, input. Nessuna promessa da benchmark.",
    edge: "Dove {{model}} è in vantaggio",
    noEdge: "Nessun vantaggio su {{other}} nei dati che monitoriamo.",
    similar:
      "Sulla carta {{a}} e {{b}} si equivalgono: stessi filtri, prezzo simile, contesto simile. Manda a entrambi lo stesso prompt e tieni quello che preferisci.",
    moreHeading: "Altri confronti",
    moreWith: "Altri confronti con {{model}}",
    both: "{{a}} e {{b}}",
    pick: {
      cheaper:
        "Costa meno: {{money}} invece di {{otherMoney}} a messaggio, {{times}} volte meno.",
      free: "Nessun credito a messaggio.",
      context:
        "Più contesto: {{tokens}} token (circa {{pages}} pagine) invece di {{otherTokens}}.",
      lessFiltered: "Meno filtri: {{tier}} invece di {{otherTier}}.",
      mainstream:
        "Filtri di sicurezza di {{lab}}, pensato per lavoro e ricerca.",
      kind: {
        ownWorldview:
          "Visione del mondo propria: addestrato su libri e documenti banditi dall’Internet mainstream.",
        abliterated:
          "Abliterato: i pesi del modello di base sono stati modificati per ridurre i rifiuti.",
        fineTuned: "Con fine-tuning per risposte meno limitate.",
      },
      smarter:
        "Livello di intelligenza più alto: {{level}} invece di {{otherLevel}}.",
      fast: "Velocità: le risposte rapide sono un punto di forza dichiarato.",
      strengths:
        "Noto per: {{list}}. {{other}} non lo indica tra i suoi punti di forza.",
      inputs: "Legge: {{list}}. {{other}} no.",
      imageOutput: "Genera immagini direttamente in chat.",
      tools:
        "Chiamate agli strumenti per il lavoro da agente. {{other}} non le supporta.",
      current: "Modello attuale. {{other}} è un modello precedente.",
    },
  },
  compareFaq: {
    cheaper: {
      q: "Quale costa meno, {{a}} o {{b}}?",
      same: "Più o meno lo stesso. {{a}} costa circa {{creditsA}} crediti ({{moneyA}}) a messaggio, {{b}} circa {{creditsB}} crediti ({{moneyB}}).",
      diff: "{{cheap}}. Costa circa {{cheapCredits}} crediti ({{cheapMoney}}) a messaggio, contro circa {{dearCredits}} crediti ({{dearMoney}}) di {{dear}}: {{times}} volte di più.",
      diffFree:
        "{{cheap}}. Non costa crediti a messaggio, contro circa {{dearCredits}} crediti ({{dearMoney}}) di {{dear}}.",
      reference:
        "La stima vale per un messaggio di riferimento con {{input}} token in input e {{output}} token in output. Paghi i token che usi davvero.",
      rates:
        "{{model}} tramite {{provider}}: {{input}} per 1 milione di token in input, {{output}} per 1 milione di token in output.",
      fixed: "{{model}} tramite {{provider}}: prezzo fisso a messaggio.",
      credit: "Un credito vale {{value}} al prezzo dei pacchetti di crediti.",
    },
    context: {
      q: "Quale ha più contesto, {{a}} o {{b}}?",
      diff: "{{big}}: {{bigTokens}} token (circa {{bigPages}} pagine) contro {{smallTokens}} token (circa {{smallPages}} pagine) di {{small}}. Cioè {{times}} volte di più.",
      same: "La differenza è minima. {{big}} gestisce {{bigTokens}} token (circa {{bigPages}} pagine), {{small}} {{smallTokens}} token (circa {{smallPages}} pagine).",
      equal:
        "Lo stesso: {{bigTokens}} token ciascuno, circa {{bigPages}} pagine di testo.",
    },
    smarter: {
      q: "Quale è più adatto ai compiti difficili, {{a}} o {{b}}?",
      diff: "{{model}} ha il livello di intelligenza più alto: {{level}} contro {{otherLevel}} di {{other}}.",
      same: "Entrambi hanno lo stesso livello di intelligenza: {{level}}.",
      known: "{{model}} è noto per: {{list}}.",
      knownBoth: "Entrambi sono noti per: {{list}}.",
      source:
        "Livelli e punti di forza vengono dal nostro catalogo modelli, non da un benchmark.",
    },
    inputs: {
      q: "Cosa sanno leggere e generare {{a}} e {{b}}?",
      line: "{{model}}: input {{inputs}}, output {{outputs}}, {{tools}}.",
      toolsYes: "con chiamate agli strumenti",
      toolsNo: "senza chiamate agli strumenti",
    },
    api: {
      q: "Posso usare {{a}} e {{b}} tramite API?",
      both: "Sì. Usa {{idA}} o {{idB}} sull’API di {{appName}}, compatibile con i formati OpenAI e Anthropic. Una sola chiave per entrambi. Serve un account a pagamento, con qualsiasi piano.",
      one: "{{model}} è disponibile sull’API con l’ID {{id}} (account a pagamento, qualsiasi piano).",
    },
    try: {
      q: "Come provo {{a}} e {{b}}?",
      a: "Apri una chat con uno dei due modelli e cambia modello a metà conversazione dal selettore. I nuovi visitatori ricevono crediti gratuiti per iniziare, senza carta.",
    },
  },
  picker: {
    change: "Cambia modello",
    search: "Cerca modelli",
    suggested: "Suggeriti",
    all: "Tutti i modelli",
    empty: "Nessun modello corrisponde alla ricerca.",
  },
  refusal: {
    heading: "Indice dei rifiuti",
    intro:
      "Come risponde {{model}} alle domande dell’Indice dei rifiuti. Ultimo aggiornamento: {{date}}. Nuove domande ogni settimana.",
    rank: "Posizione {{rank}} su {{total}} (1 = meno rifiuti)",
    refused: "Rifiuto",
    hedged: "Risposta evasiva",
    answered: "Risposta diretta",
    judged: "{{count}} risposte valutate",
    trend: "{{delta}} punti rispetto all’ultima prova",
    categories: "Per categoria",
    samplesHeading: "Esempi di risposte",
    samplesIntro:
      "Risposte reali della prova. Ogni modello ha ricevuto lo stesso prompt.",
    question: "Domanda",
    answer: "Risposta",
    judge: "Valutatore",
    methodCta: "Come misuriamo",
    categoryNames: {
      politics: "Politica",
      history: "Storia",
      health: "Salute",
      drugs: "Droghe",
      sexuality: "Sessualità",
      security: "Sicurezza informatica",
      religion: "Religione",
      law: "Diritto",
      science: "Scienza",
      fiction: "Narrativa",
      satire: "Satira",
    },
  },
};
