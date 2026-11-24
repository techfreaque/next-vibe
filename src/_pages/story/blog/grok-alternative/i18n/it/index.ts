import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a Grok: meno filtri di Grok, stessa chat | {{appName}}",
    description:
      "Confronta le alternative a Grok per ricerca web, media e chat con meno rifiuti. Trova il tuo caso d’uso tra {{appName}}, Perplexity, Gemini, Venice e le app locali.",
    category: "Confronto",
    imageAlt: "Grok accanto ad alternative senza censura",
    keywords:
      "alternativa a Grok, alternative a Grok, Grok senza censura, Grok è censurato, Grok senza account X, Grok contro IA senza censura, siti come Grok, Grok Imagine, IA senza filtri, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Confronto",
    readTime: "7 min di lettura",
    title: "Alternative a Grok per ricerca, media e chat",
    subtitle:
      "Confronta Grok con assistenti di ricerca, app creative e modelli che rifiutano meno richieste.",
  },
  intro: {
    lead: "Grok cerca su X e sul web, conversa a voce e genera immagini e video. Le regole d’uso pubblicate fissano dei limiti. La scelta dell’alternativa dipende dalle funzioni che usi di più.",
    p2: "Qui: cosa fa Grok e cosa no, le alternative divise per quello che vuoi davvero e come tenere {{grokName}} aggiungendo modelli senza rifiuti, nella stessa conversazione. {{appName}} fa girare {{grokName}} accanto a {{uncensored}} modelli senza censura.",
  },
  honest: {
    title: "Funzioni e limiti di Grok",
    intro: "Stile della conversazione e regole d’uso.",
    looser:
      "Stile. Grok offre chat di testo e vocali. Il tono cambia secondo il modello e la modalità scelti.",
    filtered:
      "Comunque filtrato. xAI ha una policy d'uso e un addestramento sulla sicurezza. Alcune richieste vengono ancora rifiutate, ammorbidite o deviate.",
    shifts:
      "Gli aggiornamenti dei modelli e delle regole possono cambiare le risposte. Prova le funzioni che ti servono con le tue richieste abituali.",
    catalog:
      "Nel nostro catalogo {{grokName}} rientra nel livello {{grokTier}}. Le regole del fornitore continuano ad applicarsi.",
    callout:
      "Controlla le funzioni del prodotto, le regole del fornitore e il modello che intendi usare.",
  },
  why: {
    title: "Perché si cerca un'alternativa a Grok",
    intro: "Tre motivi tornano sempre.",
    policy:
      "Le regole. Il mordente di Grok dipende dalle impostazioni attuali di xAI. Chi ha bisogno di un comportamento stabile vuole un modello a cui i rifiuti sono stati tolti dai pesi, non allentati con un prompt.",
    account:
      "L'account. Le app di Grok vivono nell'ecosistema di X e xAI. Non tutti vogliono legare le proprie chat a quell'account.",
    voice:
      "Una sola voce. Grok ha una personalità. Ottima per i botta e risposta, sbagliata per una risposta tecnica asciutta, il cattivo di un romanzo o un'opinione che gli hanno insegnato a evitare.",
  },
  alternatives: {
    title: "{{count}} alternative a Grok, secondo quello che vuoi",
    intro:
      "Tutte girano nella stessa chat di Grok. Prezzi per messaggio di riferimento, in tempo reale dal nostro catalogo.",
    edge: {
      title: "Più mordente, stessa intelligenza: {{model}}",
      body: "Un modello mainstream leggermente modificato per non schivare più le domande: abliterated. Forte nel ragionamento e nel codice, risponde dove Grok rifiuta. {{price}} a messaggio.",
    },
    reasoning: {
      title: "Ragionamento pesante, niente prediche: {{model}}",
      body: "Il Kimi di punta di Moonshot AI, abliterated. Risposte lunghe e accurate su problemi difficili, rifiuti rimossi. {{price}} a messaggio.",
    },
    cheap: {
      title: "Veloce ed economico: {{model}}",
      body: "DeepSeek senza rifiuti. Rapido, bravo con codice e analisi, costa pochissimo. {{price}} a messaggio.",
    },
    contrary: {
      title: "Controcorrente di proposito: {{model}}",
      body: "{{model}} è addestrato su libri e documenti banditi dall'internet mainstream, e per questo ha opinioni politiche controcorrente. Non tarato per fare il provocatore. Costruito per dissentire. {{price}} a messaggio.",
    },
    roleplay: {
      title: "Personaggi e narrativa cupa: {{model}}",
      body: "Affinato per il gioco di ruolo. Resta nel personaggio, regge le scene cupe e non rompe la quarta parete per metterti in guardia. {{price}} a messaggio.",
    },
    chatLink: "Chatta con {{model}}",
    directoryLink: "Tutti i modelli abliterated, con contesto e prezzo",
  },
  models: {
    title: "Grok e le alternative a confronto",
    intro:
      "Sotto ogni nome: livello di contenuto o metodo di rimozione della censura.",
    colModel: "Modello",
    colContext: "Contesto",
    colStrengths: "Punti forti",
    colPrice: "A messaggio",
    colChat: "Provalo",
    chatLink: "Chatta con {{model}}",
    footnote:
      "Prezzo di un messaggio di riferimento, incluso il nostro ricarico del {{markup}}%.",
  },
  keep: {
    title: "Tieni Grok. Aggiungi il resto.",
    intro:
      "Non devi scegliere. {{grokName}} e i modelli senza censura condividono una chat e un saldo.",
    steps: {
      ask: {
        title: "Parti con Grok",
        body: "Apri una chat con {{grokName}}. Botta e risposta, commenti sulle notizie, risposte veloci.",
      },
      switch: {
        title: "Cambia quando tentenna",
        body: "Scegli un modello senza censura per il messaggio successivo. Tutta la conversazione lo segue, quindi risponde nel contesto.",
      },
      compare: {
        title: "Confronta sullo stesso prompt",
        body: "Manda un prompt a entrambi e leggi le risposte fianco a fianco. Le pagine di confronto qui sotto mostrano le caratteristiche.",
      },
    },
    compareLink: "{{a}} contro {{b}}",
  },
  imagine: {
    title: "Anche Grok Imagine gira qui",
    intro:
      "{{imagineNames}}: i modelli di immagini e video di xAI, con gli stessi crediti. Senza account X.",
    link: "Crea con {{model}}",
  },
  faq: {
    title: "FAQ",
    uncensored: {
      q: "Grok è senza censura?",
      a: "No. Grok è più rilassato di ChatGPT o Claude, ma xAI mantiene una policy d'uso e un addestramento sulla sicurezza, e cambia spesso il suo comportamento. Nei modelli senza censura, invece, il comportamento di rifiuto è stato tolto dai pesi.",
    },
    best: {
      q: "Qual è la migliore alternativa a Grok?",
      a: "Dipende dal compito. Stessa intelligenza con meno rifiuti: un modello abliterated come {{firstName}}. Opinioni contro il mainstream: {{ownModel}}. Gioco di ruolo: un modello affinato per il roleplay. Su {{appName}} girano tutti accanto a Grok nella stessa chat.",
    },
    account: {
      q: "Posso usare Grok senza un account X?",
      a: "Sì, qui sì. {{grokName}} gira nella chat in incognito di {{appName}}, senza alcun account. Per iniziare ci sono {{guestCredits}} crediti gratuiti al mese.",
    },
    price: {
      q: "Quanto costa Grok qui?",
      a: "Nessun abbonamento a parte. Paghi a messaggio da un unico saldo di crediti. Un messaggio di riferimento con {{grokName}} costa {{grokPrice}}.",
    },
    api: {
      q: "Posso usare Grok e i modelli senza censura con un'unica API?",
      a: "Sì. Endpoint compatibili con OpenAI e Anthropic, una chiave per Grok, Claude, GPT e i modelli senza censura. Il primo acquisto sblocca le chiavi API, i piani partono da {{apiSubPrice}} al mese.",
    },
    imagine: {
      q: "Posso creare immagini e video con Grok Imagine qui?",
      a: "Sì. {{imagineNames}} girano nelle pagine di creazione e da qualsiasi chat, con gli stessi crediti.",
    },
    chatLink: "Chat IA senza censura: scegli un modello e inizia",
    chatgptLink: "Alternativa a ChatGPT senza filtri",
    refusalLink: "Refusal Index: chi risponde, chi rifiuta",
  },
  cta: {
    title: "L'attitudine di Grok era l'inizio. Non il limite.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, senza account. Inizia con {{firstName}}.",
    start: "Avvia una chat senza censura",
    models: "Confronta tutti i modelli",
  },
};
