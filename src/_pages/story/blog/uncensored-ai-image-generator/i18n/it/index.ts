import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Generatori di immagini IA senza censura e prezzi | {{appName}}",
    description:
      "{{uncensoredCount}} generatori di immagini IA senza censura accanto a Flux, Seedream, GPT Image e Recraft: {{modelCount}} modelli, prezzo reale, niente sfocature.",
    category: "Comparazione del modello",
    imageAlt:
      "{{appName}}: generatori di immagini non censurati AI confrontati",
    keywords:
      "non censurato AI generatore di immagini, AI generatore di immagini senza restrizioni, AI generatore di immagini senza filtro, NSFW AI generatore di immagini, editing di immagini non censurato, Chroma, Lustify, Qwen Modifica non censurato, FLUX.3, Seedream 5.5, GPT Immagine, Recraft, AI immagine generatore prezzo per immagine, più economico AI generatore di immagini, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Comparazione del modello",
    readTime: "8 minuti di lettura",
    title:
      "Generatori di immagini IA senza censura. Prezzi reali, senza sfocature.",
    subtitle:
      "{{modelCount}} modelli per immagini da {{labCount}} laboratori, con un solo saldo. {{uncensoredCount}} sono senza censura. Scopri cosa fa ogni modello, quanto costa un’immagine e quali limiti ha.",
  },
  intro: {
    lead: "Hai digitato un prompt normale. L'immagine è tornata offuscata, ritagliata o rifiutata. Uno studio di figura, una copertura horror, una scena del tuo romanzo. I generatori di immagini a monte principale filtrano per l'utente più cauto sulla terra, e si paga una tassa mensile per il privilegio.",
    p2: "{{appName}} esegue modelli di immagine {{modelCount}} da laboratori {{labCount}}, {{uncensoredCount}} non censurati, tutti su un unico bilanciamento del credito. Di seguito: quali modelli generano effettivamente senza filtro, ogni modello fianco a fianco con il suo livello di filtro e prezzo reale per immagine, le scelte per lavoro, e come fare o modificare un'immagine direttamente da una chat.",
  },
  exists: {
    title: "C'è un generatore di immagini AI non censurato?",
    intro:
      "Si', {{uncensoredCount}} di loro corre qui, servito da Venice.ai senza sfocatura e nessun rifiuto. Due fanno immagini dal testo, due modificano un'immagine che date loro.",
    models: {
      lustify:
        "Immagini per adulti fotoreali. Costruito per i corpi e la pelle. Debole al testo in immagini e scene complesse.",
      chroma:
        "Pesi aperti, riqualificati senza filtraggio dei contenuti. Segnali lunghi, ampia gamma di stili d'arte, contenuti espliciti inclusi.",
      qwenEdit:
        "Edizioni non censurate. Consegnare una foto e un'istruzione: scambiare abiti, ridisegnare, rielaborare la scena.",
      fireRed:
        "Precise modifiche. Cambia quello che si descrive e lascia il resto dell'immagine da solo.",
      other:
        "Modello di immagine non censurato. Vedere la pagina del modello per quello che fa meglio.",
    },
    consent:
      "I modelli non censurati sono per gli adulti. La prima volta che ne usi uno, confermi di avere 18 anni o meno. Una volta. Dopodiche', decidi quello che fai, non una societa'.",
  },
  levels: {
    title: "Che cosa significano i livelli di filtro per le immagini",
    intro: "Ogni modello di immagine porta uno dei tre livelli.",
    mainstream:
      "Mainstream (modelli {{mainstreamCount}}): OpenAI e Recraft. Filtri rigidi. Ottimo nel testo e nel design, inutile per qualsiasi cosa un team di sicurezza del marchio sarebbe bandiera.",
    open: "Open (modelli {{openCount}}): FLUX, Seedream, Qwen, Grok Imagine, Wan e altro ancora. Filtri più leggeri, fine per l'arte scura e temi maturi, ma non espliciti.",
    uncensored:
      "Uncensored (modelli {{uncensoredCount}}): nessun filtro da noi, nessun rifiuto a monte. Uscita esplicita sui modelli costruiti per esso.",
    p1: "Scegli il livello per immagine, non per conto. Hai bisogno di un prodotto pulito? Utilizzare un modello aperto. Hai bisogno della scena per cui la tua storia chiama? Usate uno non censurato. Stesso saldo, stessa chat.",
  },
  table: {
    title: "Tutti i modelli di immagine {{modelCount}}, fianco a fianco",
    intro:
      "Incensored prima, poi aperto, poi mainstream. Il più economico prima all'interno di ogni livello. I prezzi includono il nostro markup {{markup}} %. 1 credito = {{creditValue}}.",
    colModel: "Modello",
    colFilter: "Livello di filtro",
    colInput: "Input",
    colCredits: "Crediti / immagine",
    colPrice: "Prezzo / immagine",
    inputText: "Testo",
    inputEdit: "Testo o immagine",
    perUnit: "Immagini {{perUnit}} per {{unit}}",
    footnote:
      '"Testo o immagine" significa che il modello prende un\'immagine di riferimento: modifiche, immagine a immagine, caratteri coerenti. Il prezzo è la dimensione predefinita; alcuni modelli caricano di più per dimensioni più grandi. Modelli fatturati per token invece di per immagine siedono nella lista completa dei modelli.',
    allModels: "Vedi ogni modello con specifiche complete",
  },
  picks: {
    title: "Il miglior generatore di immagini AI per ogni lavoro",
    intro:
      "Nessun singolo modello vince. Sei lavori, i modelli che li si adattano, i fatti difficili sotto ciascuno.",
    factLine:
      "Crediti {{credits}} ({{price}}) · {{perUnit}} per {{unit}} · {{tier}} · {{input}}",
    uncensored: {
      title: "Nessun filtro: esplicito e tabù",
      body: "Dal testo, niente di sfocato. Chroma per gamma: illustrazione, pittura, fantasia, lunghi suggerimenti dettagliati. Lustify per i corpi fotoreali. Entrambi sono tra i modelli più economici sulla piattaforma.",
    },
    uncensoredEdit: {
      title: "Nessun filtro: modifica la tua immagine",
      body: "Caricare un'immagine, dire che cosa cambia. Qwen Modifica Uncensored è quello contrassegnato per l'output esplicito. FireRed è la precisa. Su modifiche dure, eseguire entrambi.",
    },
    cheap: {
      title: "Più economico: bozze e volume",
      body: "Le lumache, le tavole d'umore, provano un prompt prima del rendering reale. {{cheapestName}} costa i crediti {{cheapestCredits}}, le immagini {{cheapestPerUnit}} per {{unit}}.",
    },
    quality: {
      title: "Il miglior dettaglio: il render finale",
      body: "Quando l'immagine è la consegnabile. Dettaglio più nitido, più stretto prompt seguente. Si tratta di un modello economico, rendere il custode qui.",
    },
    text: {
      title: "Testo nell'immagine: manifesti, loghi, annunci",
      body: "La maggior parte dei modelli mangle lettere. Questi non lo fanno. Recraft è costruito per il lavoro di progettazione. GPT Image mantiene intatti i layout densi. Qwen Image 3 Pro è l'opzione aperta. Tutti sono filtrati.",
    },
    references: {
      title: "Immagini di riferimento e caratteri coerenti",
      body: "Stessa faccia, stesso prodotto, sparato dopo il colpo. Questi prendono una o più immagini di riferimento. Modelli {{editCount}} qui prendere un'immagine come input.",
    },
  },
  chat: {
    title: "Fare un'immagine da qualsiasi chat",
    intro:
      "Nessuna app separata. Chiedere in qualsiasi chat su {{appName}} e AI chiama il generatore di immagini per voi.",
    steps: {
      ask: {
        title: "Descrivi l'immagine",
        body: "Soggetto, stile, luce, inquadratura. Parole false. La AI scrive il prompt di generazione.",
      },
      model: {
        title: "Utilizzare il default, o nominare un modello",
        body: "L'impostazione dell'immagine della tua abilità sceglie il modello: {{defaultModel}} a meno che tu non lo abbia cambiato. Ne vuoi un altro? Dillo: \"usare FLUX.3\".",
      },
      edit: {
        title: "Attaccare una foto per modificarla",
        body: "Getta un'immagine e di' che cosa cambia. Le modifiche hanno bisogno di un modello che prenda immagini, come Qwen Modifica Uncensored o Seedream. I modelli di sola testo non possono leggere la tua immagine.",
      },
      result: {
        title: "Guarda, tienilo.",
        body: "L'immagine viene visualizzata nella chat in pochi secondi e salva la memorizzazione. Continua a parlare per perfezionarlo.",
      },
    },
    toolPage:
      "Vuoi il pieno controllo? La pagina generatore di immagini imposta modello, dimensione, rapporto aspetto e qualità direttamente.",
    toolLink: "Aprire il generatore di immagini",
    roleplayLink:
      "Arte del personaggio per il tuo gioco di ruolo: la guida di gioco di ruolo non filtrata",
  },
  pricing: {
    title: "Che cosa un'immagine AI costa qui",
    intro: "Crediti per immagine. Un saldo paga per ogni modello.",
    perImage:
      "Ogni modello ha un prezzo per immagine: il prezzo del fornitore più il nostro markup {{markup}} %, arrotondato fino a un decimo di credito. 1 credito = {{creditValue}}.",
    range:
      "Più economico in questo momento: {{cheapestName}} a {{cheapestPrice}}. Più economico non censurato: {{uncensoredName}} a {{uncensoredPrice}}. Priciest: {{priciestName}} a {{priciestPrice}}.",
    failed:
      "I crediti vengono spenti solo dopo che un'immagine viene recapitata. Lavoro fallito o rifiuto a monte: non si paga nulla.",
    free: "Gratis: {{guestCredits}} si accredita un mese senza un account, {{freeCredits}} con un account gratuito. Su {{uncensoredName}} che è immagini {{freeUncensoredImages}} al mese per niente.",
    sub: "Piani mensili: quattro dimensioni, a partire dai crediti {{subCredits}} per {{subPrice}}.",
    pack: "Pacchetti per ricaricare i crediti dell’abbonamento. {{packCredits}} crediti per {{packPrice}}. Non scadono mai. Paga con carta, PayPal o criptovalute.",
    link: "Vedi piani e pacchetti di credito",
  },
  limits: {
    title: "I limiti, dritto",
    intro: "Conoscete i bordi prima di spendere.",
    textOnly:
      "I due generatori non censurati prendono solo il testo. Per cambiare un'immagine esistente senza filtro, passare a un modello di modifica non censurato.",
    specialists:
      "I modelli non censurati sono specialisti. Per la tipografia, i loghi e i colpi di prodotto puliti, i modelli mainstream e aperti sono migliori.",
    upstream:
      "Modelli aperti e mainstream sono in esecuzione dietro la moderazione dei loro fornitori. Se si rifiuta, non costa nulla. Passare a un modello non censurato invece di riparlare.",
    video:
      "Il video è diverso. Ogni modello video viene da un laboratorio mainstream con i filtri del suo fornitore. L'incenso si ferma alle immagini.",
    law: "Nessun filtro significa nessuna rete di sicurezza. Quello che crei e pubblichi è su di te, e la legge in cui vivi ancora si applica. Le immagini sessuali dei minori sono illegali ovunque. In molti paesi, così è l'immagine sessuale di una persona reale fatta senza il loro consenso.",
    callout:
      "Gli adulti decidono cosa guardano. Vi diamo gli strumenti e i fatti, non una lezione.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "C'è un generatore di immagini AI senza restrizioni?",
      a: "Sì. {{appName}} esegue modelli di immagine non censurati {{uncensoredCount}}: Chroma e Lustify fanno immagini dal testo, Qwen Modifica Uncensored e FireRed modificare le proprie immagini. Niente sfogo, niente rifiuto. Una volta 18+ la conferma li sblocca.",
    },
    free: {
      q: "C'è un generatore di immagini AI gratuito non censurato?",
      a: "{{guestCredits}} accredita un mese senza un account, {{freeCredits}} con un account gratuito. {{uncensoredName}} costa i crediti {{uncensoredCredits}} per immagine. Dopo di che: un piano, da {{subPrice}} al mese.",
    },
    cheapest: {
      q: "Qual è il generatore di immagini AI più economico?",
      a: "In questo momento {{cheapestName}} ai crediti {{cheapestCredits}} ({{cheapestPrice}}) per immagine. Tutti i prezzi {{modelCount}} sono nella tabella sopra, letti dal nostro registro di sistema di modello.",
    },
    edit: {
      q: "Posso modificare una foto senza filtro?",
      a: "Si'. Allegare l'immagine in una chat e descrivere il cambiamento, quindi nominare Qwen Modifica non censurato o FireRed. I modelli Mainstream e open edit applicano i filtri dei loro fornitori.",
    },
    consent: {
      q: "Perche' devo confermare che ho 18 anni?",
      a: "I modelli non censurati possono produrre contenuti espliciti. Si conferma una volta che sei un adulto, e questo è tutto. Nessun caricamento ID, nessun avvertimento ripetuto.",
    },
    watermark: {
      q: "Le immagini hanno una filigrana?",
      a: "Non da noi. Niente logo, niente sovrapposizione. Alcuni laboratori incorporano dati di provenienza invisibili da soli; questo viene dal laboratorio.",
    },
    api: {
      q: "Posso generare immagini attraverso lo API?",
      a: "{{appName}} API copre i modelli di chat nei formati OpenAI e Anthropic. La generazione di immagini funziona nella chat e nella pagina del generatore di immagini.",
    },
    videoLink: "Confronta i generatori video AI",
    chatLink: "Leggi la guida di ogni modello di chat non censurato",
  },
  partners: {
    body: "Eseguire un canale o una comunità sull'arte AI? Il programma partner {{appName}} paga una quota ricorrente di ogni pagamento che si riferisce.",
    link: "Vedere il programma partner",
  },
  cta: {
    title: "Scegli un modello. Fai la foto.",
    subtitle:
      "Crediti gratuiti {{guestCredits}} al mese, nessun account necessario. Incensored, aperto o mainstream, per immagine.",
    generate: "Generare un'immagine",
    models: "Sfoglia tutti i modelli",
  },
};
