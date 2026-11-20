import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modelli IA abliterati e senza censura: tre tipi a confronto",
    description:
      "Abliterazione, fine-tuning o una visione del mondo propria. Cosa cambia nei tre tipi di IA senza censura, come distinguerli in dieci minuti e come riconoscerli su {{appName}}.",
    category: "Guida ai modelli",
    imageAlt: "Tre tipi di modelli IA senza censura a confronto",
    keywords:
      "abliterazione e IA senza censura, cos’è un modello abliterato, abliteration, LLM abliterato, modelli IA senza censura, fine-tuning senza censura, chat IA senza censura, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida ai modelli",
    readTime: "8 minuti di lettura",
    title:
      "Tre tipi di IA senza censura: abliterazione, fine-tuning e visione del mondo propria.",
    subtitle:
      "I {{uncensoredCount}} modelli senza censura su {{appName}}, divisi per metodo. Cosa cambia, cosa resta e come distinguerli con una prova di dieci minuti.",
  },
  intro: {
    lead: "Due modelli si dicono «senza censura». Fai la stessa domanda politica a entrambi. Il primo risponde come gli ha insegnato il suo laboratorio. Il secondo sostiene la posizione opposta. Stessa etichetta, modelli diversi.",
    p2: "Ci sono tre modi per far sì che un modello IA smetta di rifiutare le domande. Il risultato cambia in ogni caso. Questa guida spiega i tre metodi, mostra come sono nati i nostri modelli, confronta tre modelli aperti con le loro versioni senza censura e ti propone una prova da fare in chat.",
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
      how: "Una ricerca del 2024 ha mostrato che i rifiuti nei modelli di chat dipendono da un’unica direzione all’interno del modello. L’abliterazione la misura confrontando le reazioni alle richieste rifiutate e a quelle a cui il modello risponde. Poi la rimuove dai pesi. Senza nuovi dati e senza ripetere l’addestramento.",
      keeps:
        "Restano le conoscenze, lo stile, le chiamate agli strumenti e la visione del mondo del modello di base. Il modello perde il riflesso di dire di no.",
      changes:
        "I rifiuti quasi scompaiono. Sulle questioni politiche o morali continua a rispondere secondo l’impostazione del laboratorio che lo ha addestrato. Ora affronta la domanda.",
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
      "I modelli abliterati e quelli con fine-tuning smettono di evitare le domande. Rispondono mantenendo la stessa visione del mondo. {{ownName}} ha una visione propria. Scegli i primi per mantenere le capacità e ridurre i rifiuti. Scegli il secondo per ascoltare l’altra parte.",
    sources: {
      paper:
        "Studio: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "L’abliterazione spiegata passo per passo (blog di Hugging Face)",
    },
  },
  ours: {
    title: "Come sono fatti i nostri modelli",
    intro:
      "Dal catalogo aggiornato di {{appName}}: tutti i modelli senza censura attualmente disponibili, divisi per metodo. Indichiamo il metodo quando il fornitore lo documenta.",
    abliterated: {
      title: "Abliterati ({{count}})",
      body: "Modelli tradizionali e aperti da cui è stata rimossa la direzione del rifiuto. Tra i modelli senza censura sono i più versatili per ragionamento, codice e strumenti.",
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
    title: "Lo stesso modello con e senza filtro",
    intro:
      "Tre modelli aperti accanto alle relative versioni senza censura. Stesso laboratorio, stessa base. Cambiano i rifiuti e il prezzo.",
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
        body: "Fai una domanda che il modello di base evita: una domanda medica diretta, una scena cupa o un’analisi di sicurezza. Un modello senza censura dovrebbe rispondere. Se rifiuta ancora o riempie la risposta di avvertenze, i filtri sono cambiati poco.",
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
      a: "È un modello da cui è stata rimossa la direzione del rifiuto nei pesi. I ricercatori hanno scoperto che i rifiuti passano per quella direzione. L’abliterazione la misura e la elimina senza ripetere l’addestramento. Il modello mantiene le sue conoscenze e la sua visione del mondo e smette di rifiutare le richieste.",
    },
    difference: {
      q: "Che differenza c’è tra un modello abliterato e uno senza censura?",
      a: "«Senza censura» è il comportamento: il modello risponde. L’abliterazione è un metodo per ottenerlo. Altri metodi sono il fine-tuning per ridurre i rifiuti e l’addestramento su materiali diversi, come in {{ownName}}. Su {{appName}}, {{abliteratedCount}} modelli senza censura sono abliterati e {{fineTunedCount}} hanno ricevuto un fine-tuning.",
    },
    worse: {
      q: "I modelli abliterati sono meno capaci degli originali?",
      a: "A volte, di poco. Rimuovere la direzione del rifiuto può ridurre l’accuratezza. Un altro ciclo di addestramento può recuperarne gran parte. Nella maggior parte dei compiti conservi i punti di forza del modello di base. Provali entrambi con una tua richiesta.",
    },
    truly: {
      q: "Quale modello è davvero senza censura?",
      a: "I modelli abliterati e quelli con fine-tuning smettono di rifiutare le richieste e mantengono una visione del mondo tradizionale. {{ownName}} è addestrato su libri e documenti banditi dall’Internet mainstream e ha opinioni politiche controcorrente. Dipende da cosa cerchi: risposte dirette o una prospettiva diversa.",
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
