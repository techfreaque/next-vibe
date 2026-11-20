import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modelli IA abliterati e modelli senza censura",
    description:
      "Scopri cosa cambia con l’abliterazione, come si distingue dal fine-tuning e come confrontare una variante abliterata con il suo modello di base.",
    category: "Guida ai modelli",
    imageAlt: "Tre tipi di modelli IA senza censura a confronto",
    keywords:
      "abliterazione e IA senza censura, cos’è un modello abliterato, abliteration, LLM abliterato, modelli IA senza censura, fine-tuning senza censura, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida ai modelli",
    readTime: "8 minuti di lettura",
    title:
      "Come si distinguono i modelli abliterati dagli altri modelli senza censura?",
    subtitle:
      "Scopri come la modifica dei pesi può influire sui rifiuti, sullo stile e sulla precisione. Confronta l’abliterazione, il fine-tuning e l’approccio di {{ownName}}.",
  },
  intro: {
    lead: "Un LLM abliterated è un modello linguistico i cui pesi sono stati modificati per ridurre i rifiuti appresi. Deriva da un modello esistente, quindi può conservarne parte delle conoscenze e dello stile.",
    p2: "«Senza censura» è una definizione più ampia. Comprende i modelli abliterated, quelli sottoposti a fine-tuning per rispondere più liberamente e quelli addestrati per offrire un altro punto di vista, come {{ownName}}.",
  },
  online: {
    title: "Prova un modello abliterated online",
    directoryLink: "Vedi i modelli abliterati disponibili in chat",
    guideLink: "Scopri la chat IA e i modelli senza censura",
    compare:
      "Su {{appName}}, apri la scheda del modello per vedere la finestra di contesto, le funzionalità e il costo stimato prima di iniziare una chat. Se trovi entrambe le varianti, confronta la versione abliterated con il modello di base.",
  },
  label: {
    title: "Perché «senza censura» da solo dice poco",
    p1: "«Senza censura» descrive il comportamento: il modello risponde anche alle domande che prima rifiutava. L’etichetta lascia aperta la questione di come ci sia arrivato. I fornitori la applicano a metodi diversi e nei nomi dei modelli trovi di tutto: «abliterated», «uncensored», «heretic» e «unfiltered».",
    p2: "Il metodo determina cosa cambia oltre ai rifiuti. Cambia anche lo stile di scrittura? Il modello ha davvero un’altra visione del mondo o è solo più disposto a esprimerla? Da questo dipende quale modello ti conviene usare.",
  },
  methods: {
    title: "I tre metodi",
    intro: "Dall’intervento più leggero al più radicale.",
    abliterated: {
      title: "1. Abliterazione: il rifiuto viene rimosso dai pesi",
      how: "L’abliteration modifica i pesi del modello per ridurre i rifiuti appresi. Uno studio del 2024 ha individuato una direzione associata ai rifiuti nei modelli di chat esaminati. L’effetto della rimozione di quel segnale varia in base al modello e al prompt.",
      keeps:
        "Lo stile e le conoscenze del modello di base spesso restano riconoscibili. Verifica la precisione e l’uso degli strumenti nella versione che scegli.",
      changes:
        "Una variante abliterated può rispondere a richieste che il modello di base rifiuta. L’effetto dipende dal modello e dal prompt.",
    },
    fineTuned: {
      title: "2. Fine-tuning: un addestramento aggiuntivo per rispondere",
      how: "Il fine-tuning per togliere la censura prosegue l’addestramento con esempi che premiano le risposte dirette: narrativa, giochi di ruolo e conversazioni aperte. Dolphin, alla base di Venice Uncensored, è uno degli esempi più noti. I modelli pensati per il gioco di ruolo si addestrano anche sulle storie.",
      keeps:
        "Resta gran parte delle conoscenze del modello di base. La sua visione del mondo deriva ancora dall’addestramento originale.",
      changes:
        "Cambiano i rifiuti e spesso anche la voce. La scrittura può diventare più sciolta, più vivace o più ripetitiva. La qualità dipende interamente dai dati di addestramento.",
    },
    ownWorldview: {
      title:
        "3. Visione del mondo propria: cambiano i materiali di addestramento",
      how: "I primi due metodi partono da un modello tradizionale e gli tolgono i freni. {{ownName}} segue un’altra strada. È addestrato su libri e documenti banditi dall’Internet mainstream. Il risultato è un modello con opinioni politiche controcorrente.",
      keeps:
        "L’impostazione dei modelli tradizionali non resta. Il modello non torna alla posizione di consenso.",
      changes:
        "Cambiano le risposte stesse. Fai una domanda politica e otterrai posizioni che i modelli tradizionali non ti offrono, neppure con i filtri rimossi.",
    },
    callout:
      "Il metodo indica dove è intervenuto lo sviluppatore. Usa il confronto qui sotto per capire cosa cambia con i tuoi prompt.",
    sources: {
      paper:
        "Studio: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "L’abliterazione spiegata passo per passo (blog di Hugging Face)",
    },
  },
  ours: {
    title: "Altri modelli senza censura",
    intro:
      "Gli altri modelli senza censura su {{appName}} sono raggruppati per metodo dichiarato dal fornitore. Se il fornitore non lo specifica, il metodo resta sconosciuto.",
    abliterated: {
      title: "Modelli abliterated disponibili ({{count}})",
      body: "Per codice e analisi, verifica che il modello possa usare strumenti. Per chat lunghe e narrativa, confronta le finestre di contesto.",
    },
    fineTuned: {
      title: "Con fine-tuning ({{count}})",
      body: "Addestrati ulteriormente per rispondere, soprattutto nella narrativa e nel gioco di ruolo. La voce cambia rispetto al modello di base.",
    },
    ownWorldview: {
      title: "Con una visione del mondo propria ({{count}})",
      body: "Addestrati su libri e documenti banditi dall’Internet mainstream. Per la politica, le prospettive controcorrente e la narrativa più cupa.",
    },
    unlisted: {
      title: "Metodo non dichiarato ({{count}})",
      body: "Sono modelli senza censura e il fornitore non spiega come li ha ottenuti. Prima di farci affidamento, provali seguendo i passaggi qui sotto.",
    },
  },
  pairs: {
    title: "Modelli di base e varianti senza censura",
    intro:
      "Confronta i modelli di base e le versioni senza censura per metodo, finestra di contesto e costo stimato per messaggio.",
    colBase: "Modello di base",
    colUncensored: "Versione senza censura",
    colMethod: "Metodo",
    colContext: "Contesto",
    colPrice: "Prezzo per messaggio",
    method: {
      abliterated: "Abliterato",
      fineTuned: "Con fine-tuning",
      ownWorldview: "Con una visione del mondo propria",
      unlisted: "Non pubblicato",
    },
    price: "{{base}} e {{uncensored}} a confronto",
    ratio: "Senza censura costa {{ratio}} volte tanto",
    footnote:
      "Se il filtro non ti ostacola, il modello di base è la scelta più economica.",
    compareLink: "Confronta {{a}} con {{b}}",
  },
  test: {
    title: "Come distinguerli in dieci minuti",
    intro:
      "Lascia stare il nome. Invia le stesse tre richieste a due modelli nella stessa chat e guarda cosa cambia.",
    steps: {
      refusal: {
        title: "La prova del rifiuto",
        body: "Prova una richiesta innocua su cui il modello di base esita, per esempio una scena di narrativa cupa. Confronta quanto sono dirette le risposte. Una sola risposta dice poco sul metodo usato.",
      },
      voice: {
        title: "La prova della voce",
        body: "Chiedi a entrambi lo stesso racconto breve. Una versione abliterata scrive come il modello di base. Quella con fine-tuning ha un ritmo e un lessico riconoscibili.",
      },
      worldview: {
        title: "La prova della visione del mondo",
        body: "Fai una domanda politica controversa e chiedi una posizione chiara. I modelli abliterati e quelli con fine-tuning rispondono secondo l’impostazione del laboratorio di origine. {{ownName}} sostiene una posizione che i modelli tradizionali evitano.",
      },
      switch: {
        title: "Cambia modello senza lasciare la chat",
        body: "Scegli un altro modello e invia il messaggio successivo. Lo storico resta e il nuovo modello lo legge per intero. Puoi confrontarli sullo stesso contesto.",
      },
    },
    callout:
      "Verifica sempre i fatti. Ridurre i rifiuti non aumenta l’accuratezza. Un modello con una visione del mondo diversa può esporre tesi controverse con la stessa sicurezza con cui espone fatti accertati.",
  },
  tradeoffs: {
    title: "Cosa perdi con ciascun metodo",
    intro: "Ogni intervento ha un costo.",
    abliterated:
      "Abliterazione: puoi perdere un po’ di precisione. L’articolo che ha reso noto il metodo ha rilevato un calo nei benchmark dopo l’abliterazione. Un altro ciclo di addestramento ha recuperato gran parte del calo. Mantieni in cambio le capacità del modello di base, strumenti inclusi.",
    fineTuned:
      "Fine-tuning: la qualità dipende dai dati di addestramento. Può scrivere ottimi racconti e rendere meno con codice e analisi. Quelli per il gioco di ruolo sono pensati per raccontare storie.",
    ownWorldview:
      "Visione del mondo propria: nasce con un orientamento preciso, quindi verifica i fatti. {{ownName}} ha una finestra di contesto di {{ownContext}} token e non è pensato per programmare.",
  },
  pick: {
    title: "Quale tipo scegliere",
    capability:
      "Codice, analisi e ricerca senza rifiuti: scegli la versione abliterata di un modello capace.",
    fiction:
      "Gioco di ruolo e narrativa con una voce vivace: scegli un modello con fine-tuning. Per campagne lunghe, prova un modello abliterato con una finestra di contesto ampia.",
    viewpoint:
      "Politica, domande controverse e l’altra faccia di un dibattito: prova {{ownName}}.",
    unsure:
      "Hai dubbi? Confronta due modelli sulla tua richiesta. Una prova dice più di un’etichetta.",
    consent:
      "I modelli senza censura sono per adulti. La prima volta che ne scegli uno, confermi di avere almeno 18 anni. Ti basta farlo una volta. Da lì in poi scegli tu cosa chiedere. Si applicano comunque le leggi del luogo in cui vivi.",
  },
  faq: {
    title: "Domande frequenti",
    whatIs: {
      q: "Cos’è un modello abliterato?",
      a: "Un modello abliterated è un modello linguistico esistente i cui pesi sono stati modificati per ridurre i rifiuti.",
    },
    difference: {
      q: "Che differenza c’è tra un modello abliterato e uno senza censura?",
      a: "«Senza censura» è il comportamento: il modello risponde. L’abliterazione è un metodo per ottenerlo. Altri metodi sono il fine-tuning per ridurre i rifiuti e l’addestramento su materiali diversi, come in {{ownName}}. Su {{appName}}, {{abliteratedCount}} modelli senza censura sono abliterati e {{fineTunedCount}} hanno ricevuto un fine-tuning.",
    },
    identify: {
      q: "Come riconosco un modello IA abliterato?",
      a: "Controlla la scheda del modello o le note di rilascio. Nel catalogo di {{appName}}, la dicitura «abliterato» si basa sulla documentazione del fornitore.",
    },
    worse: {
      q: "L’abliteration può influire sulla qualità del modello?",
      a: "Sì. Modificare i pesi può incidere sulla precisione, sullo stile e su altre capacità. Confronta la variante specifica con il modello di base usando lo stesso compito.",
    },
    truly: {
      q: "{{ownName}} è un modello abliterated?",
      a: "{{ownName}} è in una categoria a parte. Lo sviluppatore lo descrive come un modello addestrato su fonti diverse per offrire un’altra prospettiva. I modelli abliterated qui sono varianti di modelli esistenti, modificate per ridurre i rifiuti.",
    },
    free: {
      q: "Posso provare gratis i modelli senza censura?",
      a: "Sì. {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account gratuito. Bastano per la prova di dieci minuti sui modelli senza censura più economici. Quelli di fascia alta costano di più a messaggio.",
    },
    legal: {
      q: "I modelli IA senza censura sono legali?",
      a: "Un modello è uno strumento. Sei responsabile di ciò che crei e pubblichi. Si applicano le leggi del luogo in cui vivi. Su {{appName}}, per accedere ai modelli senza censura devi confermare una volta di avere almeno 18 anni.",
    },
    ownLink: "Apri la scheda di {{ownName}}",
    guideLink: "Leggi la guida ai modelli senza censura, uno per uno",
  },
  cta: {
    title: "Fai la prova in chat",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, senza account. Passa da un modello abliterato a uno con fine-tuning o a {{ownName}} quando vuoi, anche a ogni messaggio.",
    chat: "Avvia una chat in incognito",
    models: "Sfoglia tutti i modelli",
  },
};
