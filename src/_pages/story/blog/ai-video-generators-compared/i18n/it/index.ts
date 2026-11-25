import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Generatori video IA a confronto: Kling, Seedance | {{appName}}",
    description:
      "{{modelCount}} AI generatori video confrontati: Kling vs Seedance, Veo 3.1 vs Sora 2, Wan 3.0, Hailuo. Testo e immagine a video, prezzi reali, nessun filigrana da noi.",
    category: "Comparazione del modello",
    imageAlt: "{{appName}}: generatori video AI confrontati fianco a fianco",
    keywords:
      "migliore AI generatore di video, AI generatore di video, Kling vs Seedance, Seedance 2.0, Seedance 2.5, Kling 3.0, Veo 3.1 vs Sora 2, Veo 3.1, Sora 2, Wan 3.0, Hailuo 3, Grok Immaginate il video, Gemini Omni, Runway Gen-4.5, immagine al video AI, testo in video AI, AI generatore di video senza filigrana, AI prezzo del generatore video al secondo, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Comparazione del modello",
    readTime: "10 min",
    title: "{{modelCount}} generatori video IA a confronto. Un solo saldo.",
    subtitle:
      "Kling e Seedance, Veo e Sora, Wan, Hailuo, Grok Imagine e Gemini Omni. Confronta costo al secondo, durata delle clip, controllo dei fotogrammi e audio. Scegli il modello per la tua scena e generala in qualsiasi chat su {{appName}}.",
  },
  intro: {
    lead: "Ogni laboratorio chiama il suo modello il miglior generatore video AI. Ognuno vuole la propria app, i propri crediti, il proprio abbonamento. Vuoi una cosa: il clip giusto per il lavoro, ad un prezzo che vedi prima di colpire generare.",
    p2: "{{appName}} gestisce i modelli video {{modelCount}} da laboratori {{labCount}} su un unico bilanciamento di credito: Veo, Sora, Kling, Seedance, Wan, Hailuo, Grok Imagine, Gemini Omni, Runway e altro ancora. Di seguito, tutti loro fianco a fianco, direttamente dal nostro registro di modello dal vivo: ingressi, controllo frame, lunghezza, risoluzione, suono e il prezzo reale al secondo. Poi le scelte per lavoro, la testa a testa, come fare una clip da qualsiasi chat, e i limiti che nessuno mette sulla pagina di atterraggio.",
  },
  table: {
    title: "Tutti i modelli video {{modelCount}}, fianco a fianco",
    intro:
      "Ogni modello attuale da laboratori {{labCount}}, prima più economico al secondo. I prezzi includono il nostro markup {{markup}} %. 1 credito = {{creditValue}}.",
    colModel: "Modello",
    colInput: "Input",
    colFrames: "Cornici",
    colLength: "Lunghezza",
    colResolution: "Risoluzione",
    colAudio: "Audio",
    colRate: "Crediti / sec",
    colClip: "Clip di chat",
    i2v: "Testo o immagine",
    t2v: "Testo",
    v2v: "Testo e video",
    videoAudio: "Video e audio",
    framesFirst: "Prima cornice",
    framesFirstLast: "Prima e ultima cornice",
    framesNone: "Nessun controllo della cornice",
    secondsFixed: "{{max}} s",
    seconds: "{{min}} a {{max}} s",
    resolutionDefault: "Predefinizione del provider",
    audioYes: "Audio nativo",
    audioNo: "Silente",
    withImage: "Con l'immagine: {{credits}}",
    clipValue: "Crediti {{credits}}, {{seconds}} s",
    footnote:
      "Credits / sec è la tariffa alla risoluzione predefinita del modello. Quando la risoluzione cambia il prezzo, la piccola linea elenca ogni tasso. \"Con l'immagine\" è il tasso in cui un'immagine attaccata sposta il lavoro sul percorso dell'immagine di quel modello. La clip di chat è la richiesta che si richiede dalla chat costa: {{seconds}} ha richiesto dei secondi, scattato alla lunghezza più vicina che il modello supporta.",
    allModels: "Vedi ogni modello con specifiche complete",
  },
  picks: {
    title: "Il miglior generatore video AI per ogni lavoro",
    intro:
      "Non c'e' niente di meglio. C'è la soluzione migliore per il colpo. Sei lavori, i modelli che li si adattano, i fatti difficili sotto ciascuno.",
    factLine:
      "Crediti/i {{rate}} · fino a {{max}} s · {{resolution}} · {{audio}} · {{frames}}",
    quality: {
      title: "Migliore qualità: il colpo finale",
      body: "Quando la clip è il consegnabile. Realismo cinematografico, fisica credibile, polacco. Questi siedono in cima alla fascia di prezzo, quindi chiodare il prompt su un modello economico prima, poi rendere qui.",
    },
    budget: {
      title: "Più economico: bozze e volume",
      body: "Prove di prova, iterare sul movimento, nutrire sociale a volume. Meno dettagli, una bolletta molto più piccola. La maggior parte dei tuoi tentativi appartengono a questo posto.",
    },
    long: {
      title: "clip più lunghi: una presa continua",
      body: "Fino a {{longestSeconds}} secondi in un singolo clip. Taglie basse, meno cuciture cucite. Impostare la lunghezza sulla pagina del generatore video; una richiesta di chat chiede secondi {{seconds}}.",
    },
    frames: {
      title: "Controllo del telaio di avvio e fine",
      body: "Passare il primo telaio e l'ultimo, il modello riempie il movimento tra. Transizioni, prodotti rivela, loop puliti. I modelli {{lastFrameCount}} prendono un ultimo telaio.",
    },
    audio: {
      title: "Suono nativo nello stesso passaggio",
      body: "Immagine e audio in una generazione: ambiente, effetti e su alcuni modelli dialogo. Nessun passo sonoro separato, nessuna sincronizzazione a mano. I modelli {{audioCount}} rendono il suono nativo.",
    },
    editing: {
      title: "Specialisti: avatar, sincronizzazione delle labbra, editing",
      body: "Non per scene fresche da un prompt. Omnihuman 1.5 anima una persona da una foto e una traccia audio. Lipsync 2 corrisponde alle bocche nel filmato esistente a una nuova voce. Gen4 Aleph modifica il filmato esistente: aggiungere o rimuovere oggetti, ridisegnare, rileggere, cambiare l'angolo della fotocamera.",
    },
  },
  versus: {
    title: "Testa a testa: i match-up che cercano",
    intro:
      "Quattro raffronti che risalgono di nuovo e ancora. Ciò che ogni modello è costruito per, e quando scegliere quale.",
    pairTitle: "{{a}} vs {{b}}",
    klingSeedance:
      "{{a}} è la scelta del valore della linea Kling 3: movimento vivace, convincente, audio nativo, primo e ultimo frame, clip fino a secondi {{aMax}}. La cattura: 720p è il soffitto. {{b}} raggiunge fino a 4K e prende l'ingresso di riferimento che mantiene i caratteri ricorrenti coerenti tra gli scatti. Al secondo: Crediti {{aRate}} per {{a}}, {{bRate}} per {{b}}. Progetti e clip sociali: {{a}}. La storia gira con la stessa scena del personaggio dopo la scena: {{b}}.",
    veoSora:
      "{{a}} è il fiore all'occhiello di Google: realismo cinematografico, audio nativo con dialogo ed effetti, primo e ultimo frame, un'immagine come il colpo di apertura, fino a 4K. {{b}} è OpenAI 's, noto per la fisica credibile. Su questa piattaforma ci vuole solo testo, solo paesaggio. Lunghezza massima: {{aMax}} secondi per {{a}}, {{bMax}} per {{b}}. Al secondo: Crediti {{aRate}} contro {{bRate}}. Serve un suono o un'immagine di partenza: {{a}}. Segnale di testo puro, più a lungo prendere: {{b}}.",
    hailuoWan:
      "{{a}} va per la nitidezza: uscita 2K, audio nativo, primo e ultimo frame, clip fino a secondi {{aMax}}. {{b}} va per la lunghezza: fino a {{bMax}} secondi in una presa, audio nativo, controllo frame, 480p a 1080p, più un livello di 480p economico per bozze. Al secondo: Crediti {{aRate}} per {{a}}, {{bRate}} per {{b}}. Coltelli corti: {{a}}. Lungo prende su un bilancio: {{b}}.",
    grokGemini:
      "{{a}} è xAI's: 480p a 1080p, un primo frame opzionale, nessun suono, clip fino a secondi {{aMax}}. {{b}} è Google 's: audio nativo, primo e ultimo frame, 360p fino a 4K, clip fino a secondi {{bMax}}. Al secondo: Crediti {{aRate}} contro {{bRate}}. Controllo del suono e della struttura: {{b}}. Clip silenziose veloci a qualsiasi lunghezza da un secondo: {{a}}.",
    verdict:
      "Nessun modello vince ogni lavoro. Iniziare a buon mercato: {{cheapestName}} viene eseguito ai crediti {{minRate}} un secondo. I modelli {{audioCount}} lo rendono nativo. Hai bisogno della chiusura? {{lastFrameCount}} prendere un ultimo frame. Paga il premio solo per il rendering che mantieni.",
  },
  chat: {
    title: "Fai un video da qualsiasi chat",
    intro:
      "Nessuna app separata, nessun nuovo account. Chiedere in qualsiasi chat su {{appName}} e AI chiama il generatore video per voi.",
    steps: {
      ask: {
        title: "Descrivi il colpo",
        body: 'Soggetto, movimento, telecamera, umore. "Una volpe attraversa la neve fresca all\'alba, un colpo di tracciamento basso." Lo AI lo trasforma in una richiesta di generazione.',
      },
      model: {
        title: "Utilizzare il default, o nominare un modello",
        body: 'L\'impostazione video della tua abilità sceglie il modello, {{defaultModel}} a meno che tu non lo abbia cambiato. Ne vuoi un altro? Dillo nel prompt: "usare Kling 3.0". La AI passa quel modello.',
      },
      image: {
        title: "Attaccare un'immagine per animarla",
        body: "Getta in un'immagine e diventa il telaio di apertura. Questa è immagine al video. Se il tuo modello non riesce a scattare immagini, il lavoro si sposta sul percorso dell'immagine di quel modello, o sul modello più economico che ne prende uno.",
      },
      lastFrame: {
        title: "Pin l'ultima cornice",
        body: "Attaccare una seconda immagine e dire che è il finale. Il modello anima da uno all'altro. Funziona sui modelli {{lastFrameCount}}, e entrambi i frame devono essere immagini. È inoltre possibile aggiungere immagini, audio o video come riferimenti per guidare il look.",
      },
      result: {
        title: "Attento, tienilo.",
        body: "La clip gioca proprio nella chat e salva al proprio storage. Incognito chats mantenere legato alla sessione del browser. Aspettatevi circa un minuto fino a diversi minuti per clip.",
      },
    },
    toolPage:
      "Un compromesso. In chat lo AI non può impostare la lunghezza, la risoluzione o il rapporto di aspetto: ogni clip di chat chiede i secondi {{seconds}} alla risoluzione predefinita del modello. Ti serve il pieno controllo? La pagina del generatore video imposta modello, durata, rapporto di aspetto, risoluzione, primo e ultimo frame, e un prompt negativo.",
    toolLink: "Aprire il generatore video",
  },
  pricing: {
    title: "Che cosa il video AI costa qui",
    intro:
      "Crediti al secondo tempo. Questa è l'intera formula. Un saldo paga per ogni modello.",
    perSecond:
      "Ogni modello ha un tasso al secondo: il prezzo del fornitore più il nostro markup {{markup}} %, arrotondato fino a un decimo di credito. 1 credito = {{creditValue}}.",
    cheapest:
      "clip di chat più economico in questo momento: {{cheapestClipName}}, {{cheapestClipCredits}} credits ({{cheapestClipPrice}}). Tasso più basso: {{cheapestName}} a {{minRate}} crediti un secondo.",
    priciest:
      "Graciest chat clip: {{priciestClipName}}, {{priciestClipCredits}} credits ({{priciestClipPrice}}). Tasso più alto: {{priciestName}} a {{maxRate}} crediti un secondo.",
    resolution:
      "Una risoluzione più alta costa più al secondo sui modelli che il prezzo per risoluzione. La tabella elenca i tassi.",
    failed:
      "I crediti vengono spenti solo dopo la consegna di una clip. Lavoro fallito, respinta richiesta, timeout: non si paga nulla.",
    reported:
      "Percorsi serviti attraverso la fattura OpenRouter il costo effettivo del fornitore più il markup, in modo che l'accusa finale può atterrare leggermente fuori dal tavolo.",
    sub: "Piani mensili: quattro dimensioni, a partire dai crediti {{subCredits}} per {{subPrice}}.",
    pack: "Pacchetti per ricaricare i crediti dell’abbonamento. {{packCredits}} crediti per {{packPrice}}. Non scadono mai. Paga con carta, PayPal o criptovalute.",
    link: "Vedi piani e pacchetti di credito",
  },
  watermark: {
    title: "Video AI senza filigrana",
    intro: "{{appName}} non timbra nulla sul tuo clip. Hai il file grezzo.",
    ours: "Nessun segno d'acqua, nessun logo, nessun sovrapposizione da noi. È possibile scaricare il video esattamente come il modello consegnato.",
    provenance:
      "Alcuni laboratori incorporano segni di provenienza invisibili o metadati stessi. Google mette SynthID nell'output dei suoi modelli video. OpenAI collega i metadati C2PA alle clip Sora. Quelli vengono dal laboratorio, non da noi.",
    storage:
      "Ogni clip salva al proprio storage. In incognito chats rimane di proprietà della sessione del browser.",
  },
  limits: {
    title: "I limiti, dritto",
    intro:
      "Il video è il modo difficile di generare AI. Conoscete i bordi prima di spendere.",
    time: "Una clip richiede circa un minuto fino a diversi minuti. I lavori lunghi possono time out, e un timeout non costa nulla.",
    cost: "Il video è il tipo di media più costoso su {{appName}}. Si tratta di un modello economico, rendere il custode su uno premium.",
    filters:
      "Ogni modello di video viene da un laboratorio mainstream e corre dietro la moderazione del suo fornitore. Contenuto sessuale esplicite, figure pubbliche reali, minori o gore possono essere rifiutati a monte. Quel rifiuto è quello del fornitore, non il nostro, e non costa nulla.",
    chatControls:
      "In chat, lunghezza, risoluzione e rapporto di aspetto rimangono ai loro valori predefiniti. La pagina dei generatori video sblocca tutti.",
    snap: "Ogni modello supporta il proprio set di lunghezze. Una richiesta scatta a quella più vicina, quindi alcune clip di chat funzionano un po 'più breve o più di {{seconds}} secondi.",
    legacy:
      "{{legacyCount}} vecchi modelli sono lasciati fuori da questo tavolo. Siedono ancora nella lista dei modelli.",
    callout:
      "Uncensored è la nostra promessa per i modelli di chat. Il video viene eseguito sui modelli tradizionali con i filtri dei loro fornitori. Nessuno di loro fa contenuti espliciti.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è il miglior generatore di video AI?",
      a: "Quello che si adatta al colpo. Realismo cinematografico con suono: Veo 3.1. Assunzioni continue lunghe: Wan 3.0 o Seedance 2.5. Personaggi coerenti tra le scene: Seedance 2.0. Progetti economici: {{cheapestName}}. Una persona parlante da una foto: Omnihuman 1.5. Tutti gli {{modelCount}} funzionano su un bilanciamento {{appName}}, in modo da poter passare per clip.",
    },
    klingVsSeedance: {
      q: "Kling vs Seedance: che è meglio?",
      a: "Lavori diversi. Kling 3.0 Std è la scelta del valore: movimento vivace, audio nativo, controllo frame, tappato a 720p. Seedance 2.0 costa più al secondo e sale fino a 4K, con ingresso di riferimento che mantiene un personaggio coerente da sparare a colpo. A proposito di Kling, finisci i colpi di storia su Seedance.",
    },
    imageToVideo: {
      q: "Come faccio a trasformare un'immagine in un video con AI?",
      a: "Collegare l'immagine in qualsiasi chat e descrivere il movimento. {{i2vCount}} dei modelli {{modelCount}} prende direttamente un'immagine; se il tuo non lo fa, il lavoro si sposta verso un percorso di immagine. Aggiungi una seconda immagine come l'ultima cornice su modelli che la supportano.",
    },
    watermark: {
      q: "C'è un generatore video AI senza filigrana?",
      a: "Si. {{appName}} non aggiunge filigrana, logo o sovrapposizione. Scaricate il file grezzo. Alcuni laboratori incorporano segni invisibili da soli: SynthID di Google sui suoi modelli video, metadati C2PA sulle clip Sora di OpenAI.",
    },
    cost: {
      q: "Quanto costa la generazione di video AI?",
      a: "Da {{cheapestClipPrice}} a {{priciestClipPrice}} per chat clip in questo momento, a seconda del modello. Ogni modello ha un tasso al secondo, prezzo del fornitore più marcatura {{markup}} %. 1 credito = {{creditValue}}. I posti di lavoro non costano niente.",
    },
    free: {
      q: "Posso fare video AI gratuitamente?",
      a: "I nuovi conti ottengono crediti gratuiti. Il video è una delle cose priciest che si possono generare, in modo da coprire un paio di clip al massimo. La clip più economica in questo momento è {{cheapestClipName}} ai crediti {{cheapestClipCredits}}. Dopo di che: un piano, da {{subPrice}} al mese.",
    },
    length: {
      q: "Quanto tempo può essere un video AI?",
      a: "Fino a {{longestSeconds}} secondi in un solo clip, su {{longestName}}. La maggior parte dei modelli si fermano bene prima di questo. Una richiesta di chat richiede secondi {{seconds}}; impostare una durata più lunga nella pagina del generatore video.",
    },
    uncensored: {
      q: "C'è un generatore di video AI non censurato?",
      a: "Non qui, e non faremo finta di niente. Ogni modello video su {{appName}} è un modello di laboratorio mainstream dietro i filtri del suo fornitore. Nessuno di loro fa contenuti espliciti. I nostri modelli non censurati sono modelli di chat.",
    },
    modelsLink: "Sfoglia tutti i modelli con specifiche e prezzi",
    pricingLink: "Vedi piani e prezzi",
  },
  partners: {
    body: "Rendere il contenuto video AI? Il programma partner {{appName}} ti paga una quota ricorrente di ogni pagamento che fai riferimento.",
    link: "Partecipa al programma partner",
  },
  cta: {
    title: "Scegli un modello. Fai il tiro.",
    subtitle:
      "Controllo completo sulla pagina del generatore video: modello, lunghezza, rapporto di aspetto, risoluzione, frame. O semplicemente chiedere in qualsiasi chat su {{appName}}.",
    generate: "Generare un video",
    models: "Sfoglia tutti i modelli",
  },
};
