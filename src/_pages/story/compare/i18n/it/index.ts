import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    category: "Confronto",
    breadcrumb: "Piattaforme IA senza censura",
    backToBlog: "Torna al blog",
    backToHub: "Tutte le piattaforme IA senza censura",
    updated: "Ultimo aggiornamento: {{date}}",
    versusImageAlt: "{{appName}} e {{name}} a confronto",
    kinds: {
      uncensoredChat: "Chat senza censura",
      aggregator: "App con più modelli e API",
      router: "Router API",
      roleplay: "Gioco di ruolo con personaggi",
      frontend: "Interfaccia per il gioco di ruolo da installare",
      companion: "Compagnia virtuale con IA",
      filteredChat: "Chat con personaggi e filtri",
      local: "Modelli in locale",
    },
    period: {
      month: "{{plan}}: {{price}} al mese",
      quarter: "{{plan}}: {{price}} ogni 3 mesi",
      year: "{{plan}}: {{price}} all’anno",
      once: "{{plan}}: {{price}} una tantum",
    },
    free: {
      yes: "Sì",
      no: "No",
      local: "Gratis sul tuo hardware",
    },
    paid: {
      from: "Da {{price}}",
      payg: "Pagamento a consumo",
      none: "Nessun piano a pagamento",
    },
    availability: {
      yes: "Sì",
      no: "No",
      partial: "Limitata",
    },
    media: {
      image: "Immagini",
      video: "Video",
      voice: "Voce",
      partial: "{{name}} (componenti aggiuntivi)",
      none: "Solo testo",
    },
    openSource: {
      yes: "Open source",
      yesSelfHost: "Open source, installabile sul tuo computer",
      closedLocal: "Codice chiuso, gira in locale",
      partial: "Solo la versione desktop precedente",
      no: "No",
    },
    sourceKinds: {
      home: "Sito di {{name}}",
      pricing: "Prezzi di {{name}}",
      features: "Funzionalità di {{name}}",
      models: "Elenco dei modelli di {{name}}",
      privacy: "Informativa sulla privacy di {{name}}",
      terms: "Condizioni di servizio di {{name}}",
      guidelines: "Regole della community di {{name}}",
      api: "Documentazione API di {{name}}",
      docs: "Documentazione di {{name}}",
      help: "Centro assistenza di {{name}}",
      repo: "Codice sorgente di {{name}}",
      blog: "Articolo del blog di {{name}}",
      appStore: "Scheda di {{name}} nello store",
      paper: "Studio di {{name}}",
    },
    table: {
      platform: "Piattaforma",
      kind: "Tipologia",
      free: "Piano gratuito",
      paid: "A pagamento",
      filter: "Filtri e consenso",
      privacy: "Privacy",
      api: "API",
      media: "Immagini, video e voce",
      open: "Open source",
      usLink: "Vedi i piani",
      versusLink: "Confronto completo",
    },
    versus: {
      shortTitle: "In breve",
      tableTitle: "{{appName}} e {{name}} a confronto",
      tableIntro:
        "Abbiamo consultato le fonti ufficiali di {{name}} il {{date}}. I dati di {{appName}} arrivano in tempo reale dalla nostra configurazione.",
      tableFootnote:
        "{{name}} pubblica i prezzi di listino in dollari USA. Qui trovi il prezzo che pagheresti per i nostri piani. I piani cambiano. Controlla le fonti prima di acquistare.",
      colAspect: "",
      rows: {
        price: "Prezzo",
        free: "Piano gratuito",
        models: "Modelli",
        filter: "Filtri e consenso",
        privacy: "Privacy",
        api: "API",
        media: "Immagini, video e voce",
        open: "Open source",
        forWho: "A chi si rivolge",
      },
      priceCell: "{{plans}}. {{note}}",
      apiCell: "{{short}}. {{text}}",
      themTitle: "{{name}}: punti di forza e limiti",
      usTitle: "{{appName}}: punti di forza e limiti",
      wins: "Dove eccelle {{name}}",
      short: "I limiti di {{name}}",
      chooseTitle: "Quale scegliere?",
      chooseThem: "Scegli {{name}} se",
      chooseUs: "Scegli {{appName}} se",
      faqTitle: "Domande frequenti",
      sourcesTitle: "Fonti",
      sourcesIntro:
        "Abbiamo consultato queste fonti di {{name}} il {{date}}. Se trovi un dato superato, segnalacelo e lo correggiamo.",
      ourSources:
        "I nostri prezzi arrivano dalla configurazione che usiamo per calcolare gli addebiti. Puoi verificarli qui.",
      modelsLink: "Tutti i modelli su {{appName}} con i prezzi aggiornati",
      pricingLink: "Piani e pacchetti di crediti",
      privacyLink: "La nostra informativa sulla privacy",
      modelTitle: "{{model}} su {{appName}}",
      modelIntro:
        "Nel selettore trovi il modello di {{name}}. La sua scheda riporta il prezzo a messaggio, il limite di contesto e l’ID per l’API.",
      modelPageLink: "{{model}}: prezzo, contesto e API",
      modelCompareLink: "{{model}} vs {{other}}: confronto diretto",
      moreTitle: "Altri confronti",
      ctaSubtitle:
        "{{guestCredits}} crediti gratis al mese. Senza account né carta. Cambia modello a ogni messaggio: mainstream, aperto o senza censura.",
      ctaTry: "Apri una chat in incognito",
      ctaModels: "Sfoglia tutti i modelli",
    },
  },
  us: {
    kind: "Chat con modelli mainstream, aperti e senza censura",
    free: "Sì. {{guestCredits}} crediti al mese senza account, {{freeCredits}} con un account.",
    paid: "Da {{subPrice}} al mese",
    filterShort:
      "Scegli il filtro per ogni chat. Per i modelli senza censura basta confermare una volta di avere almeno 18 anni.",
    privacyShort:
      "Le chat in incognito restano nel browser. Quelle private si salvano nel tuo account.",
    apiShort: "API compatibile con OpenAI e Anthropic dopo un acquisto",
    mediaShort: "Immagini, video, musica e voce",
    openShort: "Open source, installabile sul tuo computer",
    price:
      "Piani mensili: {{planList}}. Con un piano attivo puoi aggiungere {{packCredits}} crediti per {{packPrice}}. I crediti acquistati non scadono. Puoi pagare con carta, PayPal o criptovalute.",
    models:
      "{{modelCount}} modelli di chat da {{labCount}} laboratori: {{mainstream}} mainstream, {{open}} aperti e {{uncensored}} senza censura. In {{refusalsRemoved}} modelli mainstream o aperti sono stati rimossi i meccanismi di rifiuto. {{ownModel}} ha un punto di vista proprio: è stato addestrato su libri e documenti banditi dai principali siti del web.",
    filter:
      "A ogni messaggio scegli un modello mainstream, aperto o senza censura. Per sbloccare i modelli senza censura basta confermare una volta di avere almeno 18 anni. I modelli mainstream mantengono i filtri dei fornitori.",
    privacy:
      "Le chat in incognito si salvano nel browser e funzionano senza account. Quelle private si salvano nel tuo account. I contenuti generati risiedono sui nostri server. Ogni messaggio passa da noi al fornitore che risponde.",
    api: "API /v1 compatibile con OpenAI e Anthropic per chat, immagini, video e voce. Si attiva con un piano (da {{apiSubPrice}} al mese) o con l’acquisto di crediti. Gli account gratuiti ricevono HTTP 402.",
    media:
      "Usa {{imageModels}} modelli per immagini, {{videoModels}} per video, {{musicModels}} per musica e {{voiceModels}} per voce da qualsiasi chat, con un unico saldo.",
    open: "Tutto il codice è su GitHub. Puoi ospitare la piattaforma sul tuo computer.",
    forWho:
      "Per chi vuole scegliere il filtro e usare modelli mainstream, aperti e senza censura, con immagini, video e voce in una chat e con un solo saldo.",
  },
  links: {
    hub: "Le migliori piattaforme IA senza censura a confronto",
    hubDesc:
      "Prezzi, filtri, privacy e API di Venice.ai, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT e dei modelli locali, con le fonti.",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Piattaforme IA senza censura a confronto",
    sectionIntro:
      "Prezzi, filtri e privacy di Venice.ai, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT e altri, secondo le fonti ufficiali.",
  },
  platforms: {
    venice: {
      what: "App di IA incentrata sulla privacy, con molti modelli di testo senza censura, immagini, video e musica, un’API compatibile con OpenAI e staking con VVV e DIEM.",
      pricingNote:
        "Gratis: 10 richieste di testo e 15 di immagini al giorno con i modelli base. 100 crediti valgono 1 USD. Video, musica e modelli di punta consumano crediti a parte.",
      models:
        "Il catalogo API conta 303 modelli, 143 di testo. Di questi, 17 sono indicati come senza censura. Ci sono anche Claude, GPT, Gemini e Grok.",
      filterShort:
        "Filtro per adulti attivo di default. Puoi disattivarlo con Pro.",
      filter:
        "Il filtro per adulti è attivo di default. Con Pro puoi disattivarlo dalle impostazioni. Tra i 13 e i 17 anni le condizioni richiedono il consenso dei genitori e impongono di lasciare il filtro attivo.",
      privacyShort: "La cronologia resta sul dispositivo di default",
      privacy:
        "Venice.ai salva la cronologia sul tuo dispositivo di default. I piani a pagamento offrono backup e ripristino cifrati. In modalità Anonymous, Venice.ai consiglia di presumere che il fornitore del modello conservi i contenuti. Pro offre anche elaborazione con isolamento hardware e cifratura end-to-end su alcuni modelli.",
      apiShort: "",
      api: "API compatibile con OpenAI, con addebito a token in crediti denominati in USD. Ogni DIEM in staking dà 1 USD al giorno in crediti API. Con x402 puoi pagare a richiesta in USDC senza account.",
      forWho:
        "Per chi cerca chat e generazione senza censura con la cronologia sul proprio dispositivo. Anche per sviluppatori e utenti di criptovalute.",
      pro1: "Molti modelli di testo senza censura e tariffe API contenute.",
      pro2: "La cronologia resta sul dispositivo di default.",
      con1: "Il piano gratuito si ferma a 10 richieste di testo al giorno con i modelli base.",
      con2: "Serve Pro per disattivare il filtro per adulti. Video, musica e modelli premium consumano crediti.",
    },
    uncensoredAi: {
      what: "Chat senza censura con un solo modello, un forum della community e un archivio di documenti. Disponibile su web, iOS e Android.",
      pricingNote:
        "Gratis: 3 risposte al giorno. Il prezzo di Pro resta bloccato a vita. Paghi con carta, Cash App, Apple Pay o Bitcoin. L’API si paga a parte: 0,05 USD a chiamata.",
      models:
        "Un solo modello: UncensoredAI v1.2, con 32K token di contesto. È stato addestrato su libri e documenti banditi dai principali siti del web. Esprime posizioni politiche fuori dal consenso dominante.",
      filterShort: "Nessun filtro dichiarato. Solo dai 18 anni in su.",
      filter:
        "Si presenta come una piattaforma senza restrizioni. Le condizioni richiedono almeno 18 anni e vietano contenuti intesi a danneggiare, molestare o mettere in pericolo altre persone.",
      privacyShort:
        "La sua informativa esclude l’uso dei tuoi dati per addestrare i modelli",
      privacy:
        "Secondo l’informativa, i tuoi dati non servono ad addestrare o migliorare i modelli. Parasail AI elabora i messaggi. Con Pro puoi salvare, cercare ed esportare la cronologia.",
      apiShort: "",
      api: "API compatibile con OpenAI a 0,05 USD per inferenza.",
      forWho:
        "Per chi cerca risposte dirette e punti di vista diversi su temi controversi.",
      pro1: "Canone fisso con prezzo bloccato a vita.",
      pro2: "Secondo l’informativa, i tuoi dati non servono ad addestrare i modelli.",
      con1: "Un solo modello e 32K token di contesto. Nessuna generazione di immagini, video o musica.",
      con2: "Solo 3 risposte gratis al giorno. Voce, cartelle e archivi richiedono Pro.",
    },
    nanoGpt: {
      what: "Chat web e API a consumo per testo, immagini, video e audio. Puoi abbonarti per usare i modelli aperti.",
      pricingNote:
        "Prima ricarica da 0,10 USD in cripto o 1 USD con carta. Le successive con carta partono da 5 USD. Devi accedere per ricaricare. Sul web c’è un modello gratuito. PRO include alcuni modelli open source per testo e immagini per uso personale. Claude, GPT, Gemini e Grok si pagano dal saldo.",
      models:
        "L’API pubblica di testo ha restituito 596 voci. In 38 casi l’ID contiene uncensored, abliterated o Dolphin. Tra gli esempi: Venice Uncensored, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored e una variante di Kimi K3.1 Pro con i rifiuti rimossi.",
      filterShort:
        "Ammette contenuti per adulti con alcuni limiti. Dai 18 anni in su.",
      filter:
        "Devi avere almeno 18 anni e l’età legale per stipulare un contratto nel tuo paese. Le condizioni vietano materiale pedopornografico e contenuti intimi o sessualmente espliciti con persone identificabili senza il loro consenso, compresi i deepfake. I fornitori possono imporre limiti propri.",
      privacyShort: "La cronologia resta nel browser di default",
      privacy:
        "La cronologia resta nel browser di default. Puoi attivare la sincronizzazione nel cloud. NanoGPT dichiara di non registrare messaggi e risposte durante l’elaborazione ordinaria. Puoi attivare i log dell’API e la memoria della chat. Alcuni percorsi possono conservare i messaggi o usarli per l’addestramento.",
      apiShort: "",
      api: "API compatibile con OpenAI e Anthropic Messages. Con x402 paghi senza account. Mentre è in corso l’addebito, alcune risposte riportano un costo stimato o non lo indicano.",
      forWho:
        "Per chi vuole pagare a consumo, accedere a un catalogo ampio o ricaricare in criptovalute.",
      pro1: "Catalogo ampio e ricariche da 0,10 USD.",
      pro2: "Il modello web gratuito funziona senza account. La cronologia resta nel browser di default.",
      con1: "Gratis c’è un solo modello di chat sul web.",
      con2: "La privacy dipende dal fornitore scelto.",
    },
    openRouter: {
      what: "Una sola chiave API per centinaia di modelli di fornitori diversi. Paghi a token con crediti prepagati.",
      pricingNote:
        "Senza abbonamento. Tariffe dei fornitori e commissione del 5,5% sull’acquisto di crediti. I modelli gratuiti consentono 50 richieste al giorno, o 1.000 dopo l’acquisto di 10 USD in crediti.",
      models:
        "474 modelli, 15 gratis. Poche opzioni senza censura: Venice Uncensored (Dolphin Mistral 24B, ospitato da Venice.ai) e modelli affinati per il gioco di ruolo come Hermes 4 e Magnum. 142 risultano moderati.",
      filterShort:
        "Ogni fornitore stabilisce le regole. Molti percorsi prevedono moderazione.",
      filter:
        "Richiede almeno 18 anni. OpenRouter verifica se le richieste contengono materiale pedopornografico noto. Ogni fornitore applica le sue regole sui percorsi moderati.",
      privacyShort: "Salva messaggi e risposte solo se lo autorizzi",
      privacy:
        "OpenRouter dichiara di salvare messaggi e risposte solo su consenso. Conserva sempre i metadati. Ciascun fornitore ha le sue regole di registrazione.",
      apiShort: "",
      api: "API compatibile con OpenAI per accedere a tutto il catalogo.",
      forWho:
        "Per sviluppatori che vogliono usare molti modelli con una chiave e passare a un altro fornitore in caso di guasti.",
      pro1: "Ampio catalogo alle tariffe dei fornitori, senza abbonamento.",
      pro2: "Puoi scegliere se autorizzare la registrazione e l’uso dei dati per addestrare i modelli.",
      con1: "Pochi modelli senza censura.",
      con2: "È pensato per l’integrazione nella tua interfaccia.",
    },
    freedomGpt: {
      what: "App con modelli mainstream e Liberty, il suo modello senza censura. Genera anche immagini e video. La vecchia app desktop open source esegue modelli offline.",
      pricingNote:
        "Puoi iniziare senza carta né account. Pro include 2.200 crediti al mese e offre ricariche una tantum. FreedomGPT stima 10 crediti per una risposta premium, 25 per un’immagine e 400 per un video di 5 secondi.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral e altri, insieme a Liberty e ad altri modelli senza censura. Il totale non è pubblico.",
      filterShort:
        "Modelli senza censura soggetti alle leggi USA e alle regole d’uso",
      filter:
        "FreedomGPT richiede di rispettare le leggi USA e vieta gli usi che considera contrari alle sue regole etiche. Le regole valgono anche per i modelli senza censura.",
      privacyShort: "Condivide i messaggi con i fornitori di IA",
      privacy:
        "FreedomGPT invia messaggi e allegati al fornitore necessario per rispondere. L’informativa per l’app mobile dice che i fornitori possono usare messaggi, registrazioni e immagini solo per generare le risposte. Non indica un periodo fisso di conservazione.",
      apiShort: "",
      api: "API su chat.freedomgpt.com/api/v1. La chiave si ottiene dal pannello di controllo. Tariffe non pubblicate.",
      forWho:
        "Per chi vuole un solo abbonamento per molti modelli, anche senza censura.",
      pro1: "Puoi iniziare gratis, senza account né carta.",
      pro2: "Genera immagini e video nella stessa app.",
      con1: "Si applicano le leggi USA e le regole etiche della piattaforma.",
      con2: "L’app desktop open source non riceve aggiornamenti da giugno 2024.",
    },
    gabAi: {
      what: "La piattaforma di Gab riunisce 214 modelli, compreso Arya. Ha una modalità agente, genera immagini, video e musica e offre app desktop. Rivendica una posizione cristiana e conservatrice.",
      pricingNote:
        "Ricevi 250 crediti gratis dopo aver verificato l’email. I pacchetti partono da 10 USD per 700 crediti e non scadono.",
      models:
        "214 modelli con un solo account: GPT, Claude, Gemini, DeepSeek, Qwen, Kimi e altri. Arya è il modello di Gab, progettato attorno a valori cristiani e conservatori.",
      filterShort: "Libertà di espressione con limiti ai contenuti sessuali",
      filter:
        "Richiede almeno 18 anni. Le condizioni vietano contenuti osceni, sessualmente espliciti o pornografici. Può usare sistemi automatici per controllare i contenuti.",
      privacyShort: "Conserva le chat e può usarle per migliorare i modelli",
      privacy:
        "Gab conserva messaggi, risposte e cronologia sui suoi server. L’informativa prevede l’uso di questi dati per migliorare i modelli. Gab invia le richieste ai fornitori dai propri account e avverte che le richieste possono identificarti.",
      apiShort: "",
      api: "API compatibile con OpenAI e Anthropic. Serve Plus o Plus Premium.",
      forWho:
        "Per chi cerca una piattaforma di IA cristiana e conservatrice al di fuori delle grandi aziende tecnologiche.",
      pro1: "Ampio catalogo, modalità agente e app desktop.",
      pro2: "I crediti acquistati non scadono.",
      con1: "Vieta i contenuti sessualmente espliciti anche nella narrativa.",
      con2: "Conserva i tuoi messaggi e può usarli per migliorare i modelli.",
    },
    janitorAi: {
      what: "Piattaforma di gioco di ruolo con milioni di bot creati dalla community. Include JLLM gratis e permette di collegare un altro modello tramite un proxy API.",
      pricingNote:
        "L’App Store USA riporta janitor+ a 12,99 USD al mese o 99 USD l’anno. Il centro assistenza indica chat gratuite illimitate con i modelli standard e circa 9.000 token di contesto. janitor+ quintuplica il contesto, dà priorità e include rigenerazioni mensili sui modelli premium.",
      models:
        "JLLM è il modello gratuito. Il modello di base non è pubblico. Puoi collegarne uno esterno tramite proxy. La guida ufficiale usa OpenRouter come esempio.",
      filterShort:
        "Bot per adulti con etichetta. Basta dichiarare di avere almeno 18 anni.",
      filter:
        "Dai 18 anni in su, con autodichiarazione. I bot Limited escludono i contenuti sessuali. Quelli Limitless li ammettono. L’app mobile parte in Safe Mode finché non attivi i contenuti per adulti dal sito. Vieta contenuti sessuali con minori, violenza sessuale, gore, zoofilia e incitamento all’odio.",
      privacyShort: "Conserva le chat e può usarle per ricerca e sviluppo",
      privacy:
        "Conserva le chat come contenuti degli utenti. L’informativa ne prevede l’uso per ricerca e sviluppo dei sistemi di IA. Se colleghi un modello tramite proxy, anche il fornitore riceve i messaggi e applica la sua informativa.",
      apiShort: "Puoi usare la tua chiave",
      api: "Puoi collegare un’API esterna tramite proxy con la tua chiave. Janitor AI non offre un’API pubblica.",
      forWho:
        "Per chi gioca di ruolo e cerca un’ampia libreria di personaggi gratuiti.",
      pro1: "Chat gratis senza limiti con milioni di bot della community.",
      pro2: "Colleghi il modello che vuoi tramite proxy.",
      con1: "Con circa 9.000 token di contesto gratis, una storia lunga può perdere le prime scene.",
      con2: "Solo testo. Nessuna generazione di immagini, video o voce.",
    },
    sillyTavern: {
      what: "Interfaccia di chat gratuita e open source (AGPL-3.0) da installare. Include schede personaggio, raccolte di informazioni sull’ambientazione ed estensioni. Il modello lo colleghi tu.",
      pricingNote:
        "L’app è gratuita. Paghi l’API che colleghi. Se esegui il modello in locale, non paghi a messaggio.",
      models:
        "SillyTavern non include modelli. Si collega a motori locali come KoboldCpp, llama.cpp, Ollama e Oobabooga TextGeneration WebUI e ad API cloud come OpenAI, Anthropic e OpenRouter.",
      filterShort: "I limiti dipendono dal modello che colleghi",
      filter:
        "SillyTavern non aggiunge filtri. Si applicano i limiti del modello o del fornitore che colleghi.",
      privacyShort: "Le chat si salvano sul tuo computer",
      privacy:
        "SillyTavern salva le chat nella cartella dati dell’installazione locale. Se colleghi un’API o un’estensione cloud, i dati che le invii seguono la sua informativa.",
      apiShort: "Si collega ad altre API",
      api: "Interfaccia di chat che usa l’API configurata da te.",
      forWho:
        "Per chi vuole controllare prompt e personaggi e può dedicare tempo alla configurazione.",
      pro1: "Controllo su motore, prompt ed estensioni.",
      pro2: "Gratis e open source. Se usi un’API esterna, escono dal computer i dati che le invii.",
      con1: "Installi e mantieni l’app. Devi anche collegare il modello.",
      con2: "Il progetto stesso avverte che ci vuole tempo per imparare a usarla.",
    },
    characterAi: {
      what: "Piattaforma di chat con più di 10 milioni di personaggi. Usa modelli propri e applica regole severe sui contenuti.",
      pricingNote:
        "Gratis: messaggi illimitati con pubblicità. c.ai lite riduce gli annunci e dà una quota giornaliera di messaggi premium. c.ai+ elimina la pubblicità e offre chat premium illimitate e tutte le funzioni di memoria. I prezzi variano per paese.",
      models:
        "Character.AI offre stili propri. PipSqueak 3 e ShortSqueak sono gratuiti. DeepSqueak e LongSqueak sono premium. Non puoi collegare la chiave di un modello esterno.",
      filterShort: "Applica filtri e vieta la pornografia",
      filter:
        "Le condizioni vietano la pornografia e il centro assistenza dice che non sarà ammessa. Verifica l’età con Persona. Chi ha meno di 18 anni può usare solo la modalità lettura.",
      privacyShort:
        "Può usare le chat per addestrare i modelli e personalizzare gli annunci",
      privacy:
        "Character.AI può usare le chat per addestrare i modelli. Il centro assistenza spiega come escludere le nuove chat se sei nel SEE o nel Regno Unito.",
      apiShort: "",
      api: "Nessuna API pubblica per sviluppatori.",
      forWho:
        "Per chi vuole divertirsi con tanti personaggi in una chat con filtri.",
      pro1: "Tantissimi personaggi e messaggi gratuiti illimitati.",
      pro2: "c.ai lite costa meno. La piattaforma offre chiamate vocali con i personaggi.",
      con1: "Il filtro attenua o rifiuta alcune scene cupe e blocca i contenuti sessualmente espliciti.",
      con2: "Può usare i tuoi dati per addestrare i modelli e personalizzare gli annunci. Offre solo modelli propri.",
    },
    kindroid: {
      what: "Crea un amico o un partner virtuale con memoria a lungo termine, chiamate vocali e video, selfie e chat di gruppo.",
      pricingNote:
        "Anteprima una tantum da 50 messaggi, oppure 15 in alcune regioni. Poi l’account passa in sola lettura. La prova separata di 3 giorni richiede un metodo di pagamento e diventa un abbonamento se non la annulli. Ultra e MAX sono extra mensili. Prezzi dell’App Store USA.",
      models:
        "Ember alimenta l’anteprima gratuita e la prova. Gli abbonati possono scegliere Polaris e altri modelli proprietari, tra cui Reverie. Kindroid ha anche modelli propri per i selfie.",
      filterShort:
        "IA senza filtro in chat, con regole di sicurezza per l’account",
      filter:
        "Kindroid dichiara di non filtrare le risposte, ma controlla i messaggi per rilevare rischi gravi, come danni imminenti a sé o ad altre persone. Per dimostrare di avere almeno 18 anni puoi pagare l’abbonamento o usare Yoti.",
      privacyShort:
        "Cifratura a riposo e in transito, senza cifratura end-to-end",
      privacy:
        "Cifra le chat durante la trasmissione e quando le conserva. I suoi sistemi elaborano i contenuti e li controllano in automatico. Kindroid dichiara di non vendere i tuoi dati.",
      apiShort: "API personale per i tuoi compagni virtuali",
      api: "Le chiavi personali permettono di parlare con i tuoi Kindroid.",
      forWho:
        "Per adulti che vogliono un compagno virtuale a lungo termine, con voce, video e foto.",
      pro1: "Memoria, selfie, voce e videochiamate in una sola app.",
      pro2: "Conversazioni per adulti con pochi limiti.",
      con1: "Quando finisce l’anteprima gratuita, devi attivare la prova di 3 giorni o abbonarti per continuare a scrivere.",
      con2: "Per aumentare la memoria con Ultra o MAX, paghi un extra sul piano base.",
    },
    nomi: {
      what: "Compagno virtuale con memoria a lungo termine, selfie, voce, chat di gruppo e video a partire dalle immagini.",
      pricingNote:
        "Gratis: 50 messaggi al giorno. Standard sblocca messaggi illimitati e voce. Prezzi dell’App Store USA. Il vecchio piano Launch era un’offerta una tantum della beta.",
      models:
        "Modelli proprietari, tra cui Cambrian 6 e Solstice. Non accetta chiavi di modelli esterni.",
      filterShort:
        "Testo senza filtri. Le immagini hanno un filtro per la nudità.",
      filter:
        "Il sito dichiara che non impone filtri arbitrari nelle conversazioni. Filtra la nudità nelle immagini per via delle regole degli app store e dei servizi di pagamento. Dai 18 anni in su.",
      privacyShort:
        "Non vende i dati. La cancellazione dell’account prevede eccezioni.",
      privacy:
        "Nomi dichiara di non vendere né affittare i dati personali. In genere li cancella entro circa 28 giorni dalla chiusura dell’account. Ci sono eccezioni per gli archivi di addestramento, le comunicazioni e gli obblighi legali. I dati di addestramento conservati non sono più associati a te.",
      apiShort: "API personale per i tuoi compagni virtuali",
      api: "API REST per parlare con i tuoi Nomi.",
      forWho:
        "Per chi vuole un compagno virtuale che ricordi le conversazioni nel tempo.",
      pro1: "Memoria pensata per relazioni durature.",
      pro2: "Ha un piano gratuito e dichiara di non vendere i dati.",
      con1: "Le immagini hanno un filtro per la nudità.",
      con2: "La voce richiede un abbonamento. Il piano gratuito si ferma a 50 messaggi al giorno.",
    },
    crushOn: {
      what: "Chat di ruolo per adulti con l’opzione Unfiltered. Usa crediti per accedere a modelli di altri fornitori.",
      pricingNote:
        "L’offerta pubblica indica chat illimitate con i modelli gratuiti e 100 crediti al mese per i modelli Pro. I piani annuali costano meno. L’accesso Ultra dipende dall’abbonamento e usa crediti separati dai pacchetti Pro.",
      models:
        "Modelli e limiti di contesto dipendono dal piano. Il catalogo pubblico di CrushOn.AI cita Claude Opus 4.7, GLM 5.3, Gemini 3.1 Pro e DeepSeek V4 Pro tra le opzioni Ultra.",
      filterShort: "L’opzione Unfiltered si attiva dopo la verifica dell’età",
      filter:
        "Per attivare Unfiltered e sbloccare il testo per adulti, verifica l’età con un selfie o un documento tramite Didit o AgeGo, oppure paga 0,99 USD. Le regole vietano immagini sessualmente esplicite, immagini realistiche di persone reali, minori e personaggi minorenni rappresentati come adulti.",
      privacyShort: "Può usare le chat per addestrare i modelli",
      privacy:
        "L’informativa prevede l’uso delle chat per addestrare i modelli senza associarle ai singoli utenti. Usa cookie per mostrarti di nuovo annunci mirati.",
      apiShort: "",
      api: "Nessuna API pubblica per sviluppatori.",
      forWho:
        "Per adulti che vogliono giocare di ruolo con personaggi senza configurare nulla.",
      pro1: "Gioco di ruolo per adulti in un’app pronta all’uso, con accesso gratuito.",
      pro2: "CrushOn.AI dichiara di non vedere foto o documenti durante la verifica dell’età.",
      con1: "Sei fasce di crediti, fino a 199,99 USD al mese. È difficile prevedere la spesa.",
      con2: "La cronologia gratuita si cancella dopo 7 giorni di inattività. Le chat possono servire ad addestrare i modelli.",
    },
    ollama: {
      what: "Strumento con licenza MIT per eseguire modelli aperti sul tuo computer. Include un’API locale e un’app di chat ufficiale per macOS e Windows. Offre anche modelli cloud a pagamento.",
      pricingNote:
        "Eseguire i modelli sul tuo computer è gratis e senza limiti. I piani a pagamento coprono i modelli in cloud.",
      models:
        "La libreria include Dolphin 3 e versioni della community con i rifiuti rimossi, come Qwen 3.8 abliterated. Ollama non verifica i modelli caricati dalla community.",
      filterShort: "Dipende dal modello che carichi",
      filter:
        "In locale i limiti dipendono dal modello che carichi. Le versioni abliterate della community puntano a ridurre i rifiuti. Il servizio cloud ha condizioni proprie.",
      privacyShort: "In locale, i messaggi restano sul tuo computer",
      privacy:
        "Ollama dichiara di non vedere messaggi e risposte elaborati in locale. Puoi disattivare il cloud. L’informativa dice che il servizio cloud elabora messaggi e risposte temporaneamente e non li usa per addestrare i modelli. Raccoglie alcuni metadati.",
      apiShort: "",
      api: "API locale compatibile con OpenAI su localhost:11434. C’è anche un’API per i modelli in cloud.",
      forWho:
        "Per sviluppatori e utenti con un computer in grado di eseguire modelli locali. Puoi aggiungere un’interfaccia di chat.",
      pro1: "In locale, i dati restano sul tuo computer e non paghi a messaggio.",
      pro2: "Ampio catalogo e API locale compatibile con OpenAI.",
      con1: "L’hardware fissa il limite. Un modello da 70B può occupare 43 GB prima di considerare il contesto.",
      con2: "L’app di chat ufficiale è per macOS e Windows. Su Linux puoi usare il terminale, l’API o un’altra interfaccia.",
    },
    lmStudio: {
      what: "App desktop per scaricare ed eseguire modelli locali in GGUF e MLX. Include un server API locale.",
      pricingNote:
        "I modelli locali sono gratuiti per uso personale e lavorativo. Bionic+ e Pro aggiungono elaborazione in cloud, ricerca web e più dispositivi. Il piano gratuito include la trascrizione offline e LM Link per un massimo di cinque dispositivi.",
      models:
        "Esegui in locale modelli GGUF o MLX da Hugging Face, tra cui Dolphin e varianti della community con meno rifiuti. Il catalogo cloud include Kimi K3.1 Pro, DeepSeek V4 Pro e GLM-5.3.",
      filterShort: "Dipende dal modello che carichi",
      filter:
        "In locale, LM Studio non aggiunge filtri. I limiti dipendono dal modello che carichi.",
      privacyShort: "I modelli locali girano sul tuo dispositivo",
      privacy:
        "I modelli locali girano sul tuo dispositivo. LM Studio dichiara che i suoi servizi in hosting non conservano i dati.",
      apiShort: "",
      api: "Server compatibile con OpenAI su localhost:1234.",
      forWho:
        "Per chi vuole eseguire modelli locali senza usare il terminale, su Mac con Apple Silicon, Windows o Linux.",
      pro1: "Un modo semplice per eseguire modelli senza censura sul tuo computer.",
      pro2: "Gratis anche per uso commerciale.",
      con1: "App a codice chiuso. Non supporta i Mac con processore Intel.",
      con2: "La dimensione dei modelli che puoi usare dipende dal tuo computer.",
    },
  },
  hub: {
    meta: {
      title: "Le migliori piattaforme IA senza censura del 2026",
      category: "Confronto",
      description:
        "Confrontiamo {{count}} piattaforme IA senza censura: Venice.ai, NanoGPT, Janitor AI, FreedomGPT, Kindroid, modelli locali e altre. Prezzi, filtri, privacy e API, con le fonti.",
      imageAlt: "Piattaforme AI non censurate rispetto al lato",
      keywords:
        "IA senza censura, chat senza filtri, alternativa a Venice.ai, NanoGPT, alternativa a Janitor AI, alternativa a Character.AI, FreedomGPT, Gab AI, uncensored.ai, Kindroid, Nomi, CrushOn.AI, SillyTavern, Ollama, LM Studio, modelli senza censura, chat NSFW, {{appName}}",
    },
    hero: {
      category: "Confronto",
      readTime: "14 min lettura",
      title: "Le migliori piattaforme IA senza censura del 2026",
      subtitle:
        "{{count}} piattaforme, più la nostra. Quanto costano, cosa filtrano, che fine fanno le chat e a chi servono. Tutto con le fonti.",
    },
    intro: {
      lead: "Quasi tutte le piattaforme IA senza censura promettono libertà e privacy. Alcune vietano i contenuti per adulti. Altre addestrano i modelli sulle tue chat. Una ti vende persino un token. Cosa dicono le condizioni?",
      p2: "Abbiamo consultato prezzi, informative e documentazione ufficiale. Ultime verifiche il {{date}}. Ogni scheda riporta la sua data e le fonti.",
      disclosure:
        "Anche {{appName}} compare nella guida. Acquistiamo l’accesso a modelli di Venice.ai, uncensored.ai, NanoGPT, FreedomGPT, Gab AI e OpenRouter. Indichiamo quali usiamo e quanti sono. Decidi tu con dati e fonti alla mano.",
    },
    picks: {
      title: "Quale piattaforma scegliere in base a cosa ti serve",
      intro: "Parti da quello che conta per te.",
      oneApp: {
        title: "Tutto in una chat: {{appName}}",
        body: "{{modelCount}} modelli, {{uncensored}} senza censura, accanto a Claude, GPT e Gemini. Immagini, video, musica e voce con un unico saldo. Cambia modello a ogni messaggio.",
      },
      ownWorldview: {
        title: "Un punto di vista proprio: il modello di uncensored.ai",
        body: "A molti modelli senza censura sono stati semplicemente rimossi i rifiuti. uncensored.ai offre un modello con posizioni proprie. Su {{appName}} lo trovi come {{ownModel}}.",
      },
      privacy: {
        title: "Cronologia nel browser: Venice.ai o NanoGPT",
        body: "Entrambi salvano la cronologia sul dispositivo di default. Il modello web gratuito di NanoGPT funziona senza account. Su {{appName}}, la cronologia in incognito resta nel browser.",
      },
      roleplay: {
        title: "Gioco di ruolo con personaggi: Janitor AI o SillyTavern",
        body: "Janitor AI offre un’ampia libreria di bot gratuiti. Scegli SillyTavern se vuoi il pieno controllo e puoi configurarlo da te.",
      },
      companions: {
        title: "Compagnia a lungo termine: Kindroid o Nomi",
        body: "Entrambi offrono memoria, selfie e chiamate vocali. Kindroid offre una prova. Nomi ha un piano gratuito e filtra la nudità nelle immagini.",
      },
      developers: {
        title: "API con modelli senza censura: NanoGPT, Venice.ai o OpenRouter",
        body: "NanoGPT e Venice.ai offrono molti modelli senza censura a tariffe contenute per token. OpenRouter ha un catalogo ampio con poche opzioni senza censura.",
      },
      local: {
        title: "Modelli sul tuo computer: Ollama o LM Studio",
        body: "Esegui modelli con i rifiuti rimossi sul tuo computer. I dati restano lì e non paghi a messaggio. La qualità dipende dall’hardware.",
      },
      filtered: {
        title: "Chat con filtri: Character.AI",
        body: "Chat con personaggi, filtri e verifica dell’età. I minori possono usare solo la modalità lettura.",
      },
    },
    table: {
      title: "Le {{count}} piattaforme e {{appName}} a confronto",
      intro:
        "Su mobile scorri di lato. Ultime verifiche il {{date}}. Ogni scheda indica la sua data. I nostri dati arrivano dalla configurazione aggiornata.",
      footnote:
        "Prezzi di listino USA. Per Kindroid, Nomi e janitor+ usiamo l’App Store USA. Imposte, prezzi regionali e promozioni variano. «Limitata» può indicare un’API personale, una chiave esterna o un extra.",
    },
    kinds: {
      title: "Quattro modi in cui cambiano i filtri",
      intro:
        "Prima di scegliere una piattaforma, guarda quale modello usa e chi ne controlla i filtri.",
      abliterated:
        "Abliterazione: dai pesi di un modello mainstream o aperto si rimuove la direzione associata ai rifiuti. Con questa modifica i ricercatori hanno ridotto i rifiuti, preservando gran parte del comportamento originale.",
      finetuned:
        "Fine-tuning senza censura: modelli come Dolphin e Venice Uncensored vengono riaddestrati su dati scelti per ridurre i rifiuti.",
      ownWorldview:
        "Un punto di vista proprio: {{ownModel}} è stato addestrato su libri e documenti banditi dai principali siti del web. Offre posizioni insolite per i modelli mainstream.",
      filtered:
        "Con filtri: app come Character.AI e modelli mainstream applicano regole di sicurezza. I modelli mainstream in genere conservano i filtri dei fornitori anche sulle piattaforme senza censura.",
      tradeoff:
        "Lo studio sull’abliterazione ha rilevato un calo di qualità in tutti i test. Un addestramento aggiuntivo ne ha recuperato una parte. I modelli senza censura sono spesso più piccoli dei modelli di punta.",
      sourceName: "Abliteration",
    },
    platforms: {
      title: "Le piattaforme, una per una",
      intro:
        "Cosa offre ogni piattaforma, quanto costa e cosa filtra. Ultime verifiche il {{date}}. Ogni scheda ha la sua data e le fonti.",
      price: "Prezzo: {{plans}}. {{note}}",
      models: "Modelli: {{text}}",
      filter: "Filtro e consenso: {{text}}",
      privacy: "Privacy: {{text}}",
      api: "API: {{short}}. {{text}}",
      media: "Immagini, video e voce: {{text}}",
      open: "Open source: {{text}}",
      forWho: "Costruito per: {{text}}",
      strengths: "Punti",
      limits: "Limiti",
      sources: "Fonti consultate il {{date}}",
    },
    upstream:
      "{{appName}} usa l’API di {{name}} per {{models}} modelli, {{uncensored}} senza censura. Qualche esempio: {{examples}}. I modelli sono gli stessi. Chat e addebiti sono nostri.",
    us: {
      title: "Cosa offre {{appName}}",
      intro:
        "Riuniamo in una chat i modelli di più fornitori. Scegli tu quali modelli e filtri usare.",
      models:
        "{{modelCount}} modelli di chat da {{labCount}} laboratori: {{mainstream}} mainstream, {{open}} aperti e {{uncensored}} senza censura. Nella stessa chat puoi passare da Claude a un modello con i rifiuti rimossi.",
      upstream:
        "Questi fornitori ci erogano modelli: Venice.ai ({{veniceModels}}), NanoGPT ({{nanoGptModels}}), uncensored.ai ({{uncensoredAiModels}}), FreedomGPT ({{freedomGptModels}}) e Gab AI ({{gabAiModels}}).",
      consent:
        "Per attivare i modelli senza censura basta confermare una volta di avere almeno 18 anni. Non applichiamo altri filtri.",
      privacy:
        "Le chat in incognito si salvano nel browser e funzionano senza account. Quelle private si sincronizzano con il tuo account. Inviamo ogni messaggio al fornitore che risponde.",
      pricing:
        "{{guestCredits}} crediti gratis al mese senza account e {{freeCredits}} con un account. Piani mensili: {{planList}}. Puoi ricaricare un piano attivo con crediti che non scadono. Paghi con carta, PayPal o criptovalute.",
      api: "API compatibile con OpenAI e Anthropic per chat, immagini, video e voce. Si attiva con un piano (da {{apiSubPrice}}) o con l’acquisto di crediti.",
      media:
        "{{imageModels}} modelli per immagini, {{videoModels}} per video, {{musicModels}} per musica e {{voiceModels}} per voce con un unico saldo.",
      open: "Tutta la piattaforma è open source. Puoi ospitarla sul tuo computer.",
      weakTitle: "Quando ti conviene un’altra piattaforma",
      weak1:
        "Aggiungiamo il {{markup}}% al costo del fornitore. Se usi solo i modelli di Venice.ai o NanoGPT, acquistarli direttamente costa meno.",
      weak2:
        "Janitor AI e Character.AI hanno milioni di bot della community. La nostra libreria è più piccola. Puoi importare personaggi dai link di Character.AI e Talkie.",
      weak3:
        "Per selfie e videochiamate con un compagno virtuale, guarda Kindroid o Nomi.",
      weak4:
        "Se la privacy viene prima di tutto, esegui un modello sul tuo computer.",
      modelsLink: "Vedi tutti i {{modelCount}} modelli e i prezzi aggiornati",
      pricingLink: "Piani e crediti gratuiti",
      guideLink: "Guida ai modelli senza censura e a quando usarli",
    },
    versus: {
      title: "Confronti diretti",
      intro:
        "{{versusCount}} confronti con punti di forza, limiti e quando scegliere ogni piattaforma.",
    },
    method: {
      title: "Come abbiamo fatto il confronto",
      intro:
        "Come abbiamo verificato. Ultimo controllo delle fonti il {{date}}.",
      sources:
        "Abbiamo consultato fonti ufficiali: prezzi, condizioni, informative sulla privacy, centri assistenza, documentazione delle API e cataloghi.",
      prices:
        "Riportiamo i prezzi di listino in dollari USA. Se il prezzo richiede l’accesso, usiamo la scheda ufficiale dello store e lo indichiamo.",
      noScores:
        "Ogni piattaforma serve a qualcosa di diverso. La scelta dipende da cosa vuoi fare.",
      us: "Prezzi, modelli e crediti gratuiti arrivano dalla configurazione che applica gli addebiti.",
      bias: "Competiamo con diverse piattaforme di questa pagina e acquistiamo anche l’accesso ai loro modelli. Indichiamo quali e quando conviene usarle direttamente.",
      changes:
        "Piani e informative cambiano. Ogni scheda rimanda alle fonti, così puoi verificarle prima di acquistare.",
      corrections:
        "Hai trovato un prezzo superato o un dato errato? Mandaci il link alla fonte e lo correggiamo.",
      correctionsLink: "Contattaci",
    },
    faq: {
      title: "FAQ",
      best: {
        q: "Qual è la migliore IA senza censura?",
        a: "Per più modelli e generazione in una chat, {{appName}}. Per tenere la cronologia sul dispositivo, Venice.ai o NanoGPT. Per il gioco di ruolo, Janitor AI o SillyTavern. Per compagnia, Kindroid o Nomi. Per eseguire modelli in locale, Ollama o LM Studio.",
      },
      free: {
        q: "C’è un’IA senza censura gratis?",
        a: "Sì, con dei limiti. Venice.ai offre 10 richieste di testo al giorno e uncensored.ai 3 risposte. Janitor AI offre chat illimitate con il suo modello. CrushOn.AI dà 100 crediti al mese e {{appName}} {{guestCredits}} senza account. I modelli locali con Ollama o LM Studio non costano a messaggio.",
      },
      private: {
        q: "Quale IA senza censura tutela di più la privacy?",
        a: "In locale, le chat restano sul computer. Venice.ai e NanoGPT salvano la cronologia sul dispositivo di default. Il modello web gratuito di NanoGPT funziona senza account. Su {{appName}}, la cronologia in incognito resta nel browser. I servizi cloud inviano comunque le richieste al modello che risponde.",
      },
      difference: {
        q: "Cos’è l’abliterazione in un modello senza censura?",
        a: "L’abliterazione rimuove dai pesi del modello la direzione associata ai rifiuti. Altri modelli, come Dolphin, li riducono con un addestramento aggiuntivo. {{ownModel}} è stato addestrato su libri e documenti banditi dai principali siti del web ed esprime posizioni proprie.",
      },
      veniceVs: {
        q: "Venice.ai è davvero senza censura?",
        a: "Venice.ai offre modelli senza censura e attiva di default il filtro per adulti. Con Pro lo puoi disattivare. Claude, GPT e Gemini mantengono i filtri dei fornitori.",
      },
      characterAi: {
        q: "Esiste una versione di Character.AI senza filtri?",
        a: "Character.AI vieta la pornografia. Per il gioco di ruolo per adulti puoi usare i bot Limitless di Janitor AI, l’opzione Unfiltered di CrushOn.AI, Kindroid o un modello senza censura su SillyTavern o {{appName}}.",
      },
      gabAi: {
        q: "Gab AI è senza censura?",
        a: "Arya, il modello di Gab AI, tratta politica, cultura e fede da una prospettiva conservatrice. Le condizioni vietano i contenuti sessualmente espliciti. {{appName}} offre Arya accanto a modelli senza censura che ammettono narrativa per adulti.",
      },
      uncensoredAi: {
        q: "Che differenza c’è tra uncensored.ai e le altre IA senza censura?",
        a: "A molti modelli senza censura sono stati rimossi i rifiuti. Quello di uncensored.ai è stato addestrato su libri e documenti banditi dai principali siti del web ed esprime posizioni politiche fuori dal consenso. Su {{appName}} si chiama {{ownModel}}.",
      },
      openRouter: {
        q: "OpenRouter ha modelli senza censura?",
        a: "Ne offre alcuni, come Venice Uncensored e modelli per il gioco di ruolo come Hermes 4 e Magnum. 142 dei suoi 474 modelli risultano moderati. NanoGPT, Venice.ai e {{appName}} hanno più opzioni senza censura via API.",
      },
      local: {
        q: "Posso eseguire un AI non censurato sul mio computer?",
        a: "Sì. Carica Dolphin o un modello abliterato in Ollama o LM Studio. Un modello da 8B può occupare circa 5 GB. Uno da 70B può richiedere più di 40 GB di memoria.",
      },
      legal: {
        q: "È legale usare un AI non censurato?",
        a: "Quello che generi e pubblichi è soggetto alla legge del tuo paese. Le piattaforme in hosting applicano anche le loro condizioni d’uso.",
      },
    },
    cta: {
      title: "Prova con le tue domande",
      subtitle:
        "{{guestCredits}} crediti gratis al mese, senza account. Fai la domanda che un altro modello ha rifiutato e confronta le risposte.",
      try: "Apri una chat in incognito",
      models: "Vedi tutti i modelli",
    },
  },
  versus: {
    venice: {
      meta: {
        title: "{{appName}} vs Venice.ai: confronto 2026",
        description:
          "{{appName}} vs Venice.ai. Confrontiamo prezzi, modelli senza censura, filtro per adulti, privacy e API. Siamo clienti di Venice.ai e spieghiamo quando conviene ciascuna piattaforma.",
        keywords:
          "alternativa a Venice.ai, Venice.ai vs, prezzi di Venice.ai, Venice Pro, Venice Uncensored, filtro di Venice.ai, API di Venice.ai, VVV DIEM, chat senza censura, {{appName}} vs Venice.ai",
      },
      hero: {
        title: "{{appName}} vs Venice.ai",
        subtitle:
          "Due piattaforme IA senza censura. Una acquista l’accesso ai modelli dell’altra. Confrontiamo prezzi, filtri, privacy e API.",
        readTime: "7 min lettura",
      },
      intro: {
        lead: "Venice.ai è nota per la cronologia sul dispositivo e i modelli senza censura. Usiamo la sua API per diversi modelli. Quando conviene usare direttamente Venice.ai e quando usare gli stessi modelli su {{appName}}?",
        p2: "Il {{date}} abbiamo consultato prezzi, informativa sulla privacy e documentazione di Venice.ai. I nostri dati arrivano dalla configurazione aggiornata.",
      },
      relation:
        "Siamo clienti di Venice.ai: usiamo la sua API per {{veniceModels}} modelli, di cui {{veniceUncensored}} senza censura. Qualche esempio: {{veniceExamples}}.",
      verdict:
        "Scegli Venice.ai per accedere all’intero catalogo, tenere la cronologia sul dispositivo e pagare meno a token sui suoi modelli. Con Pro puoi togliere il filtro per adulti. Scegli {{appName}} per usare quei modelli accanto a Claude, GPT, al modello di uncensored.ai e alle versioni di GLM e DeepSeek con i rifiuti rimossi, in una sola chat. Basta confermare una volta di avere almeno 18 anni.",
      themPros: {
        a: "303 modelli nel catalogo API, compresi video, musica e voce.",
        b: "La cronologia resta sul dispositivo di default.",
        c: "Accesso diretto ai suoi modelli senza ricarichi di intermediari. Lo staking di DIEM dà crediti API giornalieri.",
      },
      themCons: {
        a: "Gratis: 10 richieste di testo al giorno con i modelli base.",
        b: "Il filtro per adulti è attivo di default. Puoi disattivarlo con Pro.",
        c: "Include solo i modelli ospitati da Venice.ai. Manca quello di uncensored.ai.",
      },
      usPros: {
        a: "Nello stesso selettore trovi modelli senza censura di Venice.ai, NanoGPT, uncensored.ai, FreedomGPT e Gab AI.",
        b: "Basta confermare una volta di avere almeno 18 anni per sbloccare tutti i modelli senza censura, anche col piano gratuito.",
        c: "{{guestCredits}} crediti gratis al mese senza account. Tutto il codice è open source.",
      },
      usCons: {
        a: "Gli stessi modelli di Venice.ai qui costano di più. Aggiungiamo il {{markup}}% al prezzo del fornitore.",
        b: "Il nostro catalogo complessivo è più piccolo.",
        c: "Salviamo le chat private per sincronizzarle. La cronologia in incognito resta nel browser. Venice.ai tiene la cronologia in locale di default e offre backup cifrati nei piani a pagamento.",
      },
      chooseThem: {
        a: "Vuoi un catalogo ampio di modelli senza censura da un solo fornitore.",
        b: "Hai VVV o vuoi fare staking per ottenere crediti API.",
        c: "Usi l’API di Venice.ai e vuoi la tariffa a token più bassa per i suoi modelli.",
      },
      chooseUs: {
        a: "Vuoi modelli assenti da Venice.ai, come {{ownModel}}, nella stessa chat.",
        b: "Vuoi usare i modelli senza censura già dal piano gratuito.",
        c: "Vuoi codice aperto, la possibilità di ospitarlo tu e un solo saldo per chat, immagini, video e musica.",
      },
      both: "Usa Venice.ai per accedere al catalogo completo. Su {{appName}} puoi confrontare le sue risposte con quelle di altri modelli senza censura nella stessa chat.",
      switch: {
        title: "Passare da Venice.ai alla nostra chat",
        body: "Trovi Venice Uncensored e altri modelli di Venice.ai con i nomi originali. Apri una chat in incognito e scegline uno. Per riprendere una chat precedente, incolla il contesto nel primo messaggio.",
      },
      faq: {
        q1: {
          q: "{{appName}} e Venice.ai sono la stessa cosa?",
          a: "Sono piattaforme indipendenti. Siamo open source e usiamo modelli di Venice.ai, NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter e dei grandi laboratori.",
        },
        q2: {
          q: "Venice.ai è gratis?",
          a: "Il piano gratuito offre 10 richieste di testo e 15 di immagini al giorno sui modelli base. Pro include testo illimitato, fino a 1.000 immagini al giorno sui modelli Pro e l’opzione di disattivare il filtro per gli adulti.",
        },
        q3: {
          q: "Venice.ai costa meno di {{appName}}?",
          a: "Sì, per i suoi modelli. Aggiungiamo il {{markup}}% al costo del fornitore. Qui puoi combinare modelli di più fornitori con lo stesso saldo.",
        },
        q4: {
          q: "Quale piattaforma tutela di più la privacy, Venice.ai o {{appName}}?",
          a: "Venice.ai salva la cronologia sul dispositivo di default e offre backup cifrati nei piani a pagamento. {{appName}} tiene la cronologia in incognito nel browser e salva le chat private per sincronizzarle. Entrambe inviano i messaggi al modello che risponde.",
        },
      },
      cta: { title: "Prova i modelli di Venice.ai accanto agli altri" },
    },
    characterAi: {
      meta: {
        title:
          "Alternativa a Character.AI senza filtri: {{appName}} vs Character.AI",
        description:
          "{{appName}} vs Character.AI. Confrontiamo filtri, verifica dell’età, modelli, privacy e prezzo. Quando scegliere ciascuna piattaforma.",
        keywords:
          "alternativa a Character.AI, Character.AI senza filtri, filtri di Character.AI, prezzo di c.ai+, Character.AI NSFW, verifica età su Character.AI, gioco di ruolo senza censura, {{appName}} vs Character.AI",
      },
      hero: {
        title: "{{appName}} vs Character.AI: un’alternativa senza filtri",
        subtitle:
          "Due modi di chattare con i personaggi. Cosa permette ogni piattaforma, quanto costa e che fine fanno le chat.",
        readTime: "7 min lettura",
      },
      intro: {
        lead: "Character.AI ha un’enorme libreria di personaggi. Il filtro può interrompere una scena a metà dialogo. Il centro assistenza esclude la pornografia. Se questo limite ti impedisce di raccontare la tua storia, cerca una piattaforma che ammetta il gioco di ruolo per adulti.",
        p2: "Il {{date}} abbiamo consultato piani, centro assistenza e informativa sulla privacy di Character.AI. I nostri dati arrivano dalla configurazione aggiornata.",
      },
      relation:
        "Non abbiamo rapporti commerciali con Character.AI. Puoi importare un personaggio come abilità su {{appName}} incollando il suo link di Character.AI.",
      verdict:
        "Scegli Character.AI per chattare gratis e senza limiti con milioni di personaggi, con i filtri attivi. Scegli {{appName}} se il filtro interrompe la tua storia. Puoi usare modelli per il gioco di ruolo senza censura dopo aver confermato una volta di avere almeno 18 anni, cambiare modello a ogni messaggio e tenere le chat fuori dall’addestramento.",
      themPros: {
        a: "Milioni di personaggi della community pronti a chattare.",
        b: "Messaggi gratuiti illimitati e piani a pagamento economici.",
        c: "Chiamate vocali con i personaggi.",
      },
      themCons: {
        a: "Blocca i contenuti sessualmente espliciti e può attenuare le scene cupe.",
        b: "Le chat possono servire per l’addestramento. Il centro assistenza spiega come escludere i nuovi contenuti nel SEE e nel Regno Unito.",
        c: "Offre solo modelli propri e non accetta chiavi esterne.",
      },
      usPros: {
        a: "{{uncensored}} modelli senza censura, tra cui diversi pensati per il gioco di ruolo. La scena può andare dove la porti tu.",
        b: "Cambia modello a ogni messaggio. Usane uno da gioco di ruolo per la scena e uno di punta per pianificarla.",
        c: "Le chat in incognito restano nel browser. Non usiamo le tue chat per addestrare modelli.",
      },
      usCons: {
        a: "Meno personaggi già pronti. Puoi scrivere i tuoi o importarli.",
        b: "I messaggi consumano crediti. L’uso gratuito ha un limite.",
        c: "Nessuna chiamata vocale con i personaggi.",
      },
      chooseThem: {
        a: "Vuoi i filtri e un’ampia libreria di personaggi.",
        b: "Per un minore è sufficiente la modalità lettura.",
        c: "Vuoi messaggi gratuiti illimitati.",
      },
      chooseUs: {
        a: "Il filtro interrompe le tue scene di gioco di ruolo.",
        b: "Vuoi scegliere il modello a ogni messaggio.",
        c: "Vuoi tenere le chat fuori dall’addestramento e dalla pubblicità personalizzata.",
      },
      both: "Puoi continuare a usare Character.AI per conversare e importare qui i personaggi delle storie che richiedono un modello per adulti.",
      switch: {
        title: "Importare un personaggio da Character.AI",
        body: "Copia il link del personaggio e incollalo nello strumento d’importazione delle abilità di {{appName}}. Verranno importati nome, saluto e definizione se l’autore li ha resi pubblici. Scegli un modello senza censura e continua la storia.",
      },
      faq: {
        q1: {
          q: "Character.AI ammette contenuti NSFW?",
          a: "Il centro assistenza dice che la pornografia viola le condizioni e non sarà ammessa.",
        },
        q2: {
          q: "Character.AI verifica l’età?",
          a: "Sì. Verifica l’età con Persona. Chi ha meno di 18 anni può usare solo la modalità lettura.",
        },
        q3: {
          q: "{{appName}} è un’alternativa a Character.AI senza filtri?",
          a: "Sì, per adulti. Conferma una volta di avere almeno 18 anni per accedere ai modelli senza censura, compresi quelli pensati per il gioco di ruolo. I modelli mainstream mantengono i filtri dei loro fornitori.",
        },
        q4: {
          q: "Posso importare i miei personaggi di Character.AI?",
          a: "Sì. Incolla il link nello strumento d’importazione delle abilità. Verranno importate le informazioni che l’autore ha reso pubbliche su Character.AI.",
        },
      },
      cta: { title: "Continua la storia senza filtri" },
    },
    janitorAi: {
      meta: {
        title: "Alternativa a Janitor AI: {{appName}} vs Janitor AI (2026)",
        description:
          "{{appName}} vs Janitor AI. JLLM e {{modelCount}} modelli, limiti di contesto, regole per i contenuti per adulti, proxy, privacy e prezzi.",
        keywords:
          "alternativa a Janitor AI, Janitor AI vs, JanitorAI, prezzo di janitor+, JLLM, proxy Janitor AI, OpenRouter, contesto Janitor AI, gioco di ruolo senza censura, {{appName}} vs Janitor AI",
      },
      hero: {
        title: "{{appName}} vs Janitor AI",
        subtitle:
          "Una grande community di gioco di ruolo e una chat con più modelli senza censura. Confrontiamo modelli, memoria, regole e prezzi.",
        readTime: "6 minuti di lettura",
      },
      intro: {
        lead: "Janitor AI riunisce milioni di bot della community e offre un modello gratuito. Le storie lunghe mettono alla prova i suoi circa 9.000 token di contesto. Per usare modelli esterni puoi configurare un proxy con la tua chiave.",
        p2: "Il {{date}} abbiamo consultato la pagina di janitor+, il centro assistenza e le informative. I nostri dati arrivano dalla configurazione aggiornata.",
      },
      relation:
        "Non abbiamo rapporti commerciali con Janitor AI. Il suo punto di forza è la libreria di personaggi. Il nostro è la scelta dei modelli.",
      verdict:
        "Scegli Janitor AI per la libreria di bot e le chat illimitate con JLLM. Scegli {{appName}} per usare modelli senza censura con contesto lungo, senza configurare un proxy, e generare immagini, video e voce nella stessa chat.",
      themPros: {
        a: "Milioni di bot della community. Quelli per adulti hanno l’etichetta Limitless.",
        b: "Chat gratis e illimitate con il suo modello.",
        c: "Collega il tuo modello tramite proxy, anche con OpenRouter.",
      },
      themCons: {
        a: "Circa 9.000 token di contesto gratis. Una storia lunga può perdere le prime scene.",
        b: "janitor+ include una quota mensile sui modelli premium. Per collegare un modello tuo servono una chiave API e un proxy.",
        c: "Solo testo. L’app mobile parte in Safe Mode.",
      },
      usPros: {
        a: "{{modelCount}} modelli, {{uncensored}} senza censura. Scegline uno senza configurare chiavi o proxy.",
        b: "Modelli senza censura con contesto lungo per campagne che durano settimane.",
        c: "Immagini, video, musica e voce nella stessa chat e con lo stesso saldo.",
      },
      usCons: {
        a: "Una libreria di personaggi molto più piccola.",
        b: "{{guestCredits}} crediti gratis al mese. Poi serve un piano.",
        c: "Non abbiamo un feed pubblico per i bot della community.",
      },
      chooseThem: {
        a: "Vuoi esplorare migliaia di bot già pronti.",
        b: "Vuoi chattare senza limiti e ti basta il modello gratuito.",
        c: "Hai già un proxy con la tua chiave e ti trovi bene.",
      },
      chooseUs: {
        a: "Le tue storie lunghe richiedono un modello senza censura con più contesto.",
        b: "Vuoi cambiare modello a metà scena senza toccare un proxy.",
        c: "Vuoi creare immagini o voci per i personaggi nella stessa chat.",
      },
      both: "Scopri i personaggi su Janitor AI e gioca le campagne lunghe su {{appName}}.",
      switch: {
        title: "Passare da Janitor AI alla nostra chat",
        body: "Crea un’abilità su {{appName}} con la personalità, lo scenario e il saluto del personaggio. Scegli un modello senza censura. Puoi provare una scena in incognito senza creare un account.",
      },
      faq: {
        q1: {
          q: "Janitor AI è gratis?",
          a: "Sì. Offre chat illimitate con il suo modello e circa 9.000 token di contesto. janitor+ aggiunge memoria, priorità e modelli.",
        },
        q2: {
          q: "Janitor AI ammette contenuti per adulti?",
          a: "Sì. Sul sito gli adulti possono usare i bot con etichetta Limitless. L’app mobile parte in Safe Mode finché non attivi i contenuti per adulti dal sito.",
        },
        q3: {
          q: "Serve un proxy per usare {{appName}}?",
          a: "Scegli il modello dal selettore. Ogni messaggio consuma crediti e puoi inviarlo senza chiave API.",
        },
        q4: {
          q: "Quale ha più memoria per le storie lunghe?",
          a: "Janitor AI indica circa 9.000 token di contesto gratuiti e cinque volte tanto con janitor+. Su {{appName}} il contesto dipende dal modello che scegli.",
        },
      },
      cta: {
        title: "Gioca la prossima campagna con un modello a contesto lungo",
      },
    },
    nanoGpt: {
      meta: {
        title: "{{appName}} vs NanoGPT: confronto 2026",
        description:
          "{{appName}} vs NanoGPT. Pagamento a consumo, piani, modelli senza censura, privacy e API. Siamo clienti di NanoGPT e spieghiamo quando conviene usarlo direttamente.",
        keywords:
          "alternativa a NanoGPT, NanoGPT vs, prezzi NanoGPT, NanoGPT PRO, NanoGPT senza censura, API per modelli abliterati, IA a consumo, API senza censura, {{appName}} vs NanoGPT",
      },
      hero: {
        title: "{{appName}} vs NanoGPT",
        subtitle:
          "Due piattaforme con più modelli senza censura e un’API. Una punta sul pagamento a consumo, l’altra sui piani.",
        readTime: "6 minuti di lettura",
      },
      intro: {
        lead: "NanoGPT addebita a consumo e ti lascia provare un modello gratis senza registrarti. Diversi nostri modelli senza censura usano la sua API. Ecco quando conviene ciascuna piattaforma.",
        p2: "Il {{date}} abbiamo consultato prezzi, informativa sulla privacy, condizioni e catalogo pubblico di NanoGPT. I nostri dati arrivano dalla configurazione aggiornata.",
      },
      relation:
        "Siamo clienti di NanoGPT. Usiamo la sua API per {{nanoGptModels}} modelli, {{nanoGptUncensored}} senza censura. Qualche esempio: {{nanoGptExamples}}.",
      verdict:
        "Scegli NanoGPT per il catalogo e il pagamento a consumo, anche tramite API senza account con x402. Scegli {{appName}} per modelli di più fornitori che abbiamo già provato, crediti gratis ogni mese, abilità, memoria e una chat open source che puoi ospitare tu.",
      themPros: {
        a: "596 voci per i modelli di testo. 38 ID contengono uncensored, abliterated o Dolphin.",
        b: "Puoi usarlo senza abbonamento. Dopo l’accesso, la prima ricarica in cripto parte da 0,10 USD.",
        c: "Prezzi di listino quando NanoGPT sceglie automaticamente il percorso.",
      },
      themCons: {
        a: "Gratis, un solo modello sul web.",
        b: "La privacy dipende dal fornitore. Alcuni possono usare i tuoi dati per addestrare i modelli.",
        c: "Il catalogo è ampio. Per scegliere, i test li fai tu.",
      },
      usPros: {
        a: "Ogni modello è indicato come mainstream, aperto o senza censura e ha una scheda con il prezzo aggiornato.",
        b: "{{guestCredits}} crediti gratis al mese per provare i modelli senza censura con le tue domande.",
        c: "Abilità, memoria e cartelle per progetti lunghi. Codice open source che puoi ospitare tu.",
      },
      usCons: {
        a: "Meno modelli di NanoGPT.",
        b: "Aggiungiamo il {{markup}}% al costo del fornitore. Lo stesso modello qui costa di più.",
        c: "Per ricaricare con i pacchetti di crediti serve un piano attivo.",
      },
      chooseThem: {
        a: "Vuoi pagare a consumo o chiamare l’API senza account con x402.",
        b: "Cerchi un modello che pochi cataloghi offrono.",
        c: "Vuoi integrare l’API e cerchi i prezzi di listino.",
      },
      chooseUs: {
        a: "Vuoi una selezione di modelli già provati.",
        b: "Vuoi crediti gratis ogni mese e una chat con abilità e memoria.",
        c: "Vuoi usare i modelli di uncensored.ai, Venice.ai e NanoGPT nella stessa conversazione.",
      },
      both: "Puoi usare l’API di NanoGPT per i lavori in batch e {{appName}} per le chat di ogni giorno.",
      switch: {
        title: "Passare da NanoGPT alla nostra chat",
        body: "Nel selettore trovi gli stessi modelli di NanoGPT, come {{nanoGptExamples}}. Apri una chat in incognito, scegline uno e confronta la risposta con quella di un altro fornitore nella stessa chat.",
      },
      faq: {
        q1: {
          q: "NanoGPT costa meno di {{appName}}?",
          a: "A token, in genere sì. NanoGPT applica i prezzi di listino e noi aggiungiamo il {{markup}}%. Qui hai {{guestCredits}} crediti gratis al mese e puoi combinare fornitori nella stessa chat.",
        },
        q2: {
          q: "NanoGPT richiede un account?",
          a: "Puoi usare il modello web gratuito senza account. Per ricaricare il saldo sul sito devi accedere. L’API accetta pagamenti x402 senza account.",
        },
        q3: {
          q: "Entrambi offrono un’API?",
          a: "Sì. Entrambe le API sono compatibili con OpenAI e Anthropic. NanoGPT accetta pagamenti senza account. La nostra si attiva con un piano o acquistando crediti.",
        },
        q4: {
          q: "Quale ha più modelli senza censura?",
          a: "NanoGPT ne elenca di più. {{appName}} offre {{uncensored}} modelli senza censura che abbiamo scelto e provato, da NanoGPT, Venice.ai, uncensored.ai, FreedomGPT e Gab AI.",
        },
      },
      cta: {
        title: "Confronta i modelli di NanoGPT con quelli di altri fornitori",
      },
    },
    freedomGpt: {
      meta: {
        title: "Alternativa a FreedomGPT: {{appName}} vs FreedomGPT (2026)",
        description:
          "{{appName}} vs FreedomGPT. Confrontiamo Liberty, modelli senza censura, regole, privacy, crediti, API e codice aperto, con le fonti.",
        keywords:
          "alternativa a FreedomGPT, FreedomGPT vs, prezzi FreedomGPT, FreedomGPT Pro, modello Liberty, FreedomGPT senza censura, alternativa a ChatGPT senza censura, {{appName}} vs FreedomGPT",
      },
      hero: {
        title: "{{appName}} vs FreedomGPT",
        subtitle:
          "Due app che riuniscono modelli senza censura, ChatGPT, Claude e Gemini. Confrontiamo regole, privacy, crediti e codice aperto.",
        readTime: "6 minuti di lettura",
      },
      intro: {
        lead: "FreedomGPT e {{appName}} riuniscono modelli mainstream e senza censura nello stesso selettore. Cambiano le regole, i crediti e il trattamento dei messaggi.",
        p2: "Il {{date}} abbiamo consultato sito, prezzi, informativa sulla privacy, documentazione e repository di FreedomGPT. I nostri dati arrivano dalla configurazione aggiornata.",
      },
      relation:
        "Siamo clienti di FreedomGPT. {{freedomGptExamples}} gira su {{appName}} tramite la sua API.",
      verdict:
        "Scegli FreedomGPT per iniziare gratis e usare chat, immagini e video con un piano da 20 USD al mese. Scegli {{appName}} se cerchi modelli senza censura di più fornitori, prezzi pubblici per modello e una piattaforma open source in sviluppo.",
      themPros: {
        a: "Inizia gratis, senza carta né account.",
        b: "Liberty e altri modelli senza censura accanto a ChatGPT, Claude e Gemini.",
        c: "Immagini e video nello stesso piano.",
      },
      themCons: {
        a: "Le regole richiedono il rispetto delle leggi USA e vietano gli usi che considera contrari alle sue regole etiche.",
        b: "Invia messaggi, registrazioni e immagini a fornitori esterni. Non indica per quanto tempo conserva quei dati.",
        c: "L’app desktop open source non riceve aggiornamenti da giugno 2024.",
      },
      usPros: {
        a: "{{uncensored}} modelli senza censura da cinque fornitori, compreso Liberty.",
        b: "Ogni modello ha una scheda pubblica con il prezzo a messaggio.",
        c: "La piattaforma open source è in sviluppo. Puoi ospitarla tu.",
      },
      usCons: {
        a: "Il consumo di crediti cambia a seconda del modello.",
        b: "Per usare la memoria e sincronizzare le chat serve un account.",
        c: "Aggiungiamo il {{markup}}% al costo anche per i modelli di FreedomGPT.",
      },
      chooseThem: {
        a: "Vuoi un piano da 20 USD al mese per chat, immagini e video.",
        b: "Ti bastano Liberty e i suoi modelli mainstream.",
        c: "Vuoi un’app desktop offline e ti basta la versione del 2024.",
      },
      chooseUs: {
        a: "Vuoi più modelli senza censura, anche da Venice.ai, NanoGPT, uncensored.ai e Gab AI.",
        b: "Vuoi vedere quanto costa un messaggio prima di inviarlo.",
        c: "Vuoi codice open source aggiornato che puoi ospitare tu.",
      },
      both: "Liberty è nel nostro selettore. Puoi confrontarlo con altri modelli senza censura usando lo stesso saldo.",
      switch: {
        title: "Passare da FreedomGPT alla nostra chat",
        body: "Scegli Liberty dal selettore. Fai la stessa domanda a {{ownModel}} o a un modello con i rifiuti rimossi e scegli la risposta migliore.",
      },
      faq: {
        q1: {
          q: "FreedomGPT è davvero senza censura?",
          a: "I modelli senza censura puntano a ridurre i rifiuti. FreedomGPT richiede il rispetto delle leggi USA e vieta gli usi che considera contrari alle sue regole etiche.",
        },
        q2: {
          q: "Quanto costa FreedomGPT?",
          a: "Puoi iniziare gratis. Pro include 2.200 crediti al mese. Una risposta premium ne costa circa 10, un’immagine circa 25 e un video di 5 secondi circa 400.",
        },
        q3: {
          q: "FreedomGPT è open source?",
          a: "La vecchia app desktop per i modelli offline è su GitHub con licenza GPL-3.0. L’ultimo aggiornamento risale a giugno 2024. L’app cloud è a codice chiuso. {{appName}} pubblica il codice di tutta la piattaforma.",
        },
        q4: {
          q: "Posso usare Liberty di FreedomGPT su {{appName}}?",
          a: "Sì. Liberty gira tramite l’API di FreedomGPT e lo trovi nel selettore con gli altri modelli senza censura.",
        },
      },
      cta: { title: "Prova Liberty accanto ad altri modelli senza censura" },
    },
    gabAi: {
      meta: {
        title: "Alternativa a Gab AI: {{appName}} vs Gab AI (2026)",
        description:
          "{{appName}} vs Gab AI: Arya, 214 modelli, il divieto sui contenuti sessuali, privacy, crediti e API a confronto. Compriamo da Gab, quindi diciamo dove vince ciascuno.",
        keywords:
          "alternativa a Gab AI, Gab AI vs, Gab AI recensione, Gab AI prezzi, Gab AI Plus, Arya AI, Gab Arya, Gab AI è senza censura, Gab AI NSFW, Gab AI API, chatbot IA conservatore, IA di destra, chat IA senza censura, {{appName}} vs Gab AI",
      },
      hero: {
        title: "{{appName}} vs Gab AI",
        subtitle:
          "Due app multimodello che si rifiutano di censurare la politica. Una vieta anche i contenuti per adulti. Prezzi, regole, privacy e API a confronto.",
        readTime: "7 minuti di lettura",
      },
      intro: {
        lead: "Gab AI ha creato Arya per chi è stanco di chatbot che fanno la predica su politica, cultura e fede. Anche noi offriamo Arya, tramite l’API di Gab. Quindi la vera domanda non è quale dei due sia senza censura. È quali regole vuoi intorno al modello.",
        p2: "Dati su Gab AI presi dalla homepage, dalla pagina dei prezzi, dalla pagina API, dai termini e dall’informativa sulla privacy, consultati il {{date}}. I nostri arrivano in tempo reale dalla nostra configurazione.",
      },
      relation:
        "Siamo clienti di Gab AI: {{gabAiExamples}} gira su {{appName}} tramite l’API di Gab. Stesso modello, app diversa e regole diverse intorno.",
      verdict:
        "Scegli Gab AI se vuoi Arya con la modalità agente di Gab, le app desktop e un catalogo di 214 modelli sotto un unico marchio conservatore, e non ti servono mai contenuti per adulti. Scegli {{appName}} se vuoi Arya accanto a {{ownModel}} e alle versioni abliterate di GLM e DeepSeek in una sola chat, narrativa per adulti sui modelli senza censura che la permettono e chat che possono restare nel tuo browser.",
      themPros: {
        a: "214 modelli in un solo account, più Arya, il suo modello per politica, cultura e fede.",
        b: "Modalità agente (Work), voce dal vivo, immagini, video e musica, app per Mac, Windows, iPhone e Android.",
        c: "I pacchetti di crediti acquistati si accumulano e non scadono.",
      },
      themCons: {
        a: "I suoi termini vietano contenuti osceni, sessualmente espliciti o pornografici, e sistemi automatici possono analizzare i tuoi contenuti.",
        b: "Prompt, risposte e cronologia restano sui suoi server, e il miglioramento dei modelli è tra le finalità dichiarate.",
        c: "Il piano gratuito sono 250 crediti di benvenuto una tantum dopo la verifica dell’email. L’API richiede Plus o Plus Premium.",
      },
      usPros: {
        a: "{{uncensored}} modelli senza censura da diversi fornitori, Arya compreso, in un unico selettore di modelli.",
        b: "Nessun divieto generalizzato sui contenuti per adulti: una sola conferma di avere almeno 18 anni sblocca tutti i modelli senza censura.",
        c: "{{guestCredits}} crediti gratuiti al mese senza account. Le chat in incognito restano nel tuo browser.",
      },
      usCons: {
        a: "Niente modalità agente né app desktop come Work di Gab.",
        b: "Catalogo più piccolo: {{modelCount}} modelli di chat contro i 214 di Gab.",
        c: "Il nostro ricarico del {{markup}} % vale anche per Arya.",
      },
      chooseThem: {
        a: "Vuoi Arya con la modalità agente e le app desktop di Gab.",
        b: "Condividi i valori di Gab e vuoi sostenere un’azienda di IA nata fuori dalla Big Tech.",
        c: "Non scrivi mai narrativa per adulti e vuoi il catalogo più grande con un’unica fattura.",
      },
      chooseUs: {
        a: "Vuoi confrontare Arya con {{ownModel}} e con modelli abliterati nella stessa conversazione.",
        b: "Scrivi narrativa per adulti o dark e ti servono modelli che la permettano.",
        c: "Vuoi iniziare senza account e tenere le chat in incognito nel tuo browser.",
      },
      both: "Arya è nel nostro selettore: puoi fare la stessa domanda ad Arya, a {{ownModel}} e a un modello abliterato e giudicare tu le risposte, senza un secondo abbonamento.",
      switch: {
        title: "Passare da Gab AI",
        body: "Scegli Arya nel nostro selettore di modelli e continua. Poi manda lo stesso prompt a {{ownModel}}: nessuno dei due schiva la politica, ma sono costruiti in modo diverso, e le risposte lo mostrano. Se ti serve, incolla il vecchio contesto nel primo messaggio.",
      },
      faq: {
        q1: {
          q: "Gab AI è davvero senza censura?",
          a: "Su politica, cultura e fede sì: Arya è costruito per questo. Sui contenuti sessuali no. I termini di Gab vietano contenuti osceni, sessualmente espliciti o pornografici e dicono che sistemi automatici possono analizzare i tuoi contenuti per verificarne la conformità.",
        },
        q2: {
          q: "Quanto costa Gab AI?",
          a: "Gli account gratuiti ricevono 250 crediti di benvenuto dopo la verifica dell’email. Plus costa $20 al mese o $200 all’anno con 2.000 crediti al mese. Plus Premium costa $999 all’anno con 12.000 crediti. I pacchetti di crediti partono da $10 per 700 crediti.",
        },
        q3: {
          q: "Posso usare Arya su {{appName}}?",
          a: "Sì. Arya passa dall’API di Gab e si trova nel nostro selettore accanto a {{ownModel}} e agli altri modelli senza censura. Alle risposte di Arya si applicano comunque le regole sui contenuti di Gab.",
        },
        q4: {
          q: "Gab AI conserva le mie chat?",
          a: "Sì. La sua informativa sulla privacy dice che conserva i tuoi prompt, le risposte e la cronologia delle conversazioni, indica il miglioramento dei modelli tra le finalità e avverte che inviare le richieste ai fornitori dei modelli non le rende anonime. Su {{appName}}, le chat in incognito restano nel tuo browser.",
        },
      },
      cta: {
        title:
          "Metti alla prova Arya contro tutti gli altri modelli senza censura",
      },
    },
    uncensoredAi: {
      meta: {
        title: "Alternativa a uncensored.ai: {{appName}} vs uncensored.ai",
        description:
          "{{appName}} vs uncensored.ai: lo stesso modello UncensoredLM, un’app diversa. Limiti gratuiti, prezzo di Pro, API, privacy e media a confronto, con fonti.",
        keywords:
          "alternativa a uncensored.ai, uncensored.ai vs, uncensored.ai recensione, uncensored.ai prezzi, uncensored.ai Pro, UncensoredLM, UncensoredAI v1.2, uncensored.ai API, uncensored.ai è gratis, chat IA senza censura, {{appName}} vs uncensored.ai",
      },
      hero: {
        title: "{{appName}} vs uncensored.ai",
        subtitle:
          "Un modello con una visione del mondo propria, due modi per usarlo. Limiti gratuiti, prezzo, API e tutto quello che c’è intorno.",
        readTime: "6 minuti di lettura",
      },
      intro: {
        lead: "uncensored.ai produce il modello senza censura più diverso che conosciamo: {{ownModel}}, addestrato su libri e documenti banditi da Internet mainstream, con opinioni politiche che vanno contro il mainstream. Noi lo usiamo tramite l’API di uncensored.ai. Questa pagina risponde quindi a una domanda: conviene usarlo su uncensored.ai o qui?",
        p2: "Dati su uncensored.ai presi dalla pagina dei prezzi, dalla pagina API, dalla pagina chi siamo e dall’informativa sulla privacy, consultati il {{date}}. I nostri arrivano in tempo reale dalla nostra configurazione.",
      },
      relation:
        "Siamo clienti di uncensored.ai: {{uncensoredAiExamples}} funziona su {{appName}} tramite l’API di uncensored.ai. Stesso modello, la nostra chat, la nostra fatturazione.",
      verdict:
        "Scegli uncensored.ai se vuoi chat illimitate con questo unico modello a un prezzo fisso di Pro bloccato a vita, più il suo forum e la modalità vocale. Scegli {{appName}} se vuoi {{ownModel}} accanto ad altri {{modelCount}} modelli, così in una sola conversazione puoi confrontare la sua posizione con Claude, GPT o un modello abliterato, con immagini, video e musica sullo stesso saldo.",
      themPros: {
        a: "Prezzo fisso: Pro costa $9.99 al mese o $99.99 all’anno, bloccato a vita finché resti abbonato.",
        b: "Chat illimitate con il modello a quel prezzo, più modalità vocale, cartelle e archivi.",
        c: "La sua informativa sulla privacy dice che i tuoi dati non vengono usati per addestrare o migliorare modelli di IA.",
      },
      themCons: {
        a: "Il piano gratuito offre 3 risposte al giorno.",
        b: "Un solo modello, 32.768 token di contesto, nessuna generazione di immagini, video o musica.",
        c: "Le chiamate API costano $0.05 l’una e si acquistano separatamente da Pro.",
      },
      usPros: {
        a: "{{ownModel}} più altri {{modelCount}} modelli in una sola chat: confronta la sua risposta con modelli mainstream e abliterati nella stessa conversazione.",
        b: "{{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account.",
        c: "Immagini, video, musica e voce sullo stesso saldo, e l’intera piattaforma è open source.",
      },
      usCons: {
        a: "Crediti a consumo, non un piano fisso illimitato: un uso quotidiano intenso di questo modello costa di più qui.",
        b: "Nessun forum della community né archivi intorno al modello.",
        c: "Il nostro ricarico del {{markup}} % vale anche per il modello di uncensored.ai.",
      },
      chooseThem: {
        a: "Ti basta questo modello e lo usi ogni giorno.",
        b: "Vuoi un prezzo bloccato a vita.",
        c: "Vuoi il suo forum e la modalità vocale.",
      },
      chooseUs: {
        a: "Vuoi confrontare la sua posizione con modelli mainstream e abliterati.",
        b: "Lo usi ogni tanto e non vuoi un altro abbonamento.",
        c: "Ti servono anche immagini, video o musica.",
      },
      both: "Molti usano entrambi: uncensored.ai per le chat quotidiane illimitate con il modello, {{appName}} quando vogliono mettere la sua risposta accanto a quella di un altro modello nella stessa conversazione.",
      switch: {
        title: "Passare da uncensored.ai",
        body: "Scegli {{ownModel}} nel nostro selettore di modelli e avvia una chat in incognito. Nessuna migrazione necessaria. Se ti serve, incolla il vecchio contesto nel primo messaggio, poi fai la stessa domanda a un modello abliterato e guarda dove le due risposte si separano.",
      },
      faq: {
        q1: {
          q: "{{appName}} è la stessa cosa di uncensored.ai?",
          a: "No. Siamo una piattaforma open source separata. Usiamo il modello di uncensored.ai tramite la sua API, accanto a modelli di Venice, NanoGPT, FreedomGPT, Gab AI, OpenRouter e dei grandi laboratori.",
        },
        q2: {
          q: "uncensored.ai è gratis?",
          a: "Ha un piano gratuito con 3 risposte al giorno. Pro costa $9.99 al mese o $99.99 all’anno e toglie il limite. Su {{appName}}, {{guestCredits}} crediti gratuiti al mese funzionano senza account.",
        },
        q3: {
          q: "Cosa rende diverso il modello di uncensored.ai?",
          a: "Quasi tutti i modelli senza censura sono modelli mainstream a cui sono stati tolti i rifiuti: stesso addestramento, stessa visione del mondo. {{ownModel}} è addestrato su libri e documenti banditi da Internet mainstream, quindi le sue opinioni politiche vanno contro il mainstream.",
        },
        q4: {
          q: "uncensored.ai ha un’API?",
          a: "Sì: un’API compatibile con OpenAI a $0.05 per inferenza, con crediti acquistati a parte. Su {{appName}} lo stesso modello si può chiamare tramite la nostra API compatibile con OpenAI e Anthropic, dopo qualsiasi piano o acquisto di crediti.",
        },
      },
      cta: {
        title: "Metti le sue risposte accanto a quelle di ogni altro modello",
      },
    },
    openRouter: {
      meta: {
        title:
          "Alternativa a OpenRouter per chattare: {{appName}} vs OpenRouter",
        description:
          "{{appName}} vs OpenRouter: un’app di chat pronta contro un router API per sviluppatori. Modelli senza censura, commissioni, privacy e API a confronto, con fonti.",
        keywords:
          "alternativa a OpenRouter, OpenRouter vs, OpenRouter recensione, OpenRouter prezzi, OpenRouter commissioni, OpenRouter uncensored, OpenRouter modelli senza censura, OpenRouter app di chat, OpenRouter modelli gratuiti, API compatibile OpenAI, API LLM senza censura, {{appName}} vs OpenRouter",
      },
      hero: {
        title: "{{appName}} vs OpenRouter",
        subtitle:
          "Un router per sviluppatori con 474 modelli contro un’app di chat con modelli senza censura già inclusi. Commissioni, filtri, privacy e API.",
        readTime: "6 minuti di lettura",
      },
      intro: {
        lead: "OpenRouter è la risposta standard per avere una sola chiave API e centinaia di modelli. Lo usiamo anche noi. Ma è un router per sviluppatori, non un’app di chat, e la sua offerta senza censura è scarsa. Se cerchi un’alternativa a OpenRouter per chattare, ecco il confronto onesto.",
        p2: "Dati su OpenRouter presi dalla pagina dei prezzi, dalla guida sulla raccolta dei dati, dai termini e dall’elenco pubblico dei modelli, consultati il {{date}}. I nostri arrivano in tempo reale dalla nostra configurazione.",
      },
      relation:
        "Siamo clienti di OpenRouter: {{openRouterModels}} dei nostri modelli passano dall’API di OpenRouter, tra cui {{openRouterExamples}}. Noi aggiungiamo la chat, i media e i fornitori senza censura che OpenRouter non offre.",
      verdict:
        "Scegli OpenRouter se sei uno sviluppatore e vuoi una sola chiave per 474 modelli ai prezzi dei fornitori, con instradamento di riserva, e l’interfaccia la porti tu. Scegli {{appName}} se vuoi una chat pronta con {{uncensored}} modelli senza censura, tra cui {{ownModel}} e versioni abliterate che OpenRouter non elenca, più immagini, video e musica, e un’API quando ti serve.",
      themPros: {
        a: "474 modelli nel suo elenco pubblico, ai prezzi dei fornitori.",
        b: "Nessun abbonamento. Modelli gratuiti con 50 richieste al giorno, 1.000 dopo aver acquistato $10 di crediti.",
        c: "La registrazione dei prompt e l’uso dei tuoi dati sono entrambi opt-in.",
      },
      themCons: {
        a: "Una commissione del 5,5% sull’acquisto di crediti nel piano standard.",
        b: "Pochi modelli senza censura: Venice Uncensored più fine-tune per il gioco di ruolo come Hermes 4 e Magnum. 142 dei suoi 474 modelli sono contrassegnati come moderati.",
        c: "Non è pensato come chat per il pubblico: l’interfaccia la porti tu.",
      },
      usPros: {
        a: "Una chat pronta nel browser: niente chiave, niente configurazione, {{guestCredits}} crediti gratuiti al mese senza account.",
        b: "{{uncensored}} modelli senza censura da Venice, NanoGPT, uncensored.ai, FreedomGPT e Gab AI, sbloccati con una sola conferma di avere almeno 18 anni.",
        c: "API compatibile con OpenAI e Anthropic per chat, immagini, video e voce sullo stesso saldo.",
      },
      usCons: {
        a: "Catalogo più piccolo: {{modelCount}} modelli di chat contro i 474 di OpenRouter.",
        b: "Il nostro ricarico del {{markup}} % sui costi dei fornitori supera la commissione del 5,5% di OpenRouter.",
        c: "Nato prima di tutto come chat: meno controlli di instradamento rispetto a un router dedicato.",
      },
      chooseThem: {
        a: "Sviluppi un’app e vuoi una sola chiave per centinaia di modelli.",
        b: "Ti servono fornitori di riserva e controlli di instradamento.",
        c: "Conta ogni centesimo per token e hai già la tua interfaccia.",
      },
      chooseUs: {
        a: "Vuoi chattare, non sviluppare: apri la pagina e scrivi.",
        b: "Vuoi modelli senza censura che OpenRouter non elenca, come {{ownModel}}.",
        c: "Vuoi chat, immagini, video e musica su un unico saldo, con un’API in più.",
      },
      both: "Usarli entrambi è normale: OpenRouter nel tuo codice, {{appName}} come chat in cui provi i modelli senza censura uno accanto all’altro prima di integrarne uno.",
      switch: {
        title: "Passare da OpenRouter",
        body: "Come app di chat: avvia una chat in incognito e scegli un modello, senza chiave. Nel codice: la nostra API è compatibile con OpenAI, quindi cambi URL di base e chiave, poi controlli l’ID del modello sulla sua pagina.",
      },
      faq: {
        q1: {
          q: "Esiste un’alternativa a OpenRouter con modelli senza censura?",
          a: "Sì. {{appName}} offre {{uncensored}} modelli senza censura da Venice, NanoGPT, uncensored.ai, FreedomGPT e Gab AI in una sola chat e una sola API. Anche NanoGPT e Venice vendono modelli senza censura via API. OpenRouter ne elenca solo pochi.",
        },
        q2: {
          q: "OpenRouter permette contenuti NSFW?",
          a: "I suoi termini richiedono almeno 18 anni e gli input vengono controllati per individuare CSAM noto. Ogni fornitore mantiene le proprie regole, e 142 dei 474 modelli del suo elenco sono contrassegnati come moderati: se una richiesta passa dipende dal modello e dal fornitore.",
        },
        q3: {
          q: "Quanto costa OpenRouter?",
          a: "I prezzi di listino dei fornitori per token, più una commissione del 5,5% sull’acquisto di crediti nel piano standard. Non c’è abbonamento. I modelli gratuiti permettono 50 richieste al giorno, 1.000 dopo aver acquistato $10 di crediti.",
        },
        q4: {
          q: "Posso usare il mio codice per OpenRouter con {{appName}}?",
          a: "Sì, se usa il formato OpenAI: puntalo al nostro URL di base con la tua chiave {{appName}} e usa i nostri ID dei modelli. L’API si sblocca con qualsiasi piano (da {{apiSubPrice}} al mese) o con un acquisto di crediti.",
        },
      },
      cta: { title: "Chatta con i modelli che OpenRouter non offre" },
    },
  },
};
