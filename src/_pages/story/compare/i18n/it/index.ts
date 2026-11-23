import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    category: "Confronto",
    breadcrumb: "Piattaforme IA senza censura a confronto",
    backToBlog: "Torna al blog",
    backToHub: "Tutte le piattaforme IA senza censura",
    updated: "Ultimo aggiornamento: {{date}}",
    versusImageAlt: "{{appName}} e {{name}} a confronto",
    kinds: {
      uncensoredChat: "App di chat senza censura",
      aggregator: "App con più modelli e API",
      router: "Router per API",
      roleplay: "Gioco di ruolo con personaggi",
      frontend:
        "Interfaccia per giochi di ruolo da installare sul tuo computer",
      companion: "App con compagni IA",
      filteredChat: "Chat con personaggi e filtri",
      local: "Esecuzione di modelli in locale",
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
      media: "Media",
      open: "Open source",
      usLink: "Vedi i piani",
      versusLink: "Confronto completo",
    },
    versus: {
      shortTitle: "In breve",
      tableTitle: "{{appName}} e {{name}} a confronto",
      tableIntro:
        "I dati di {{name}} provengono dalle sue pagine ufficiali, consultate il {{date}}. Quelli di {{appName}} vengono dalla configurazione attuale.",
      tableFootnote:
        "I prezzi di {{name}} sono quelli di listino in USD pubblicati sulle sue pagine. Per i nostri piani, trovi qui i prezzi che paghi al momento dell’acquisto. I piani possono cambiare. Controlla le fonti qui sotto prima di acquistare.",
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
        "Le informazioni su {{name}} provengono da queste pagine, consultate il {{date}}. Se trovi qualcosa di superato, segnalacelo e lo aggiorniamo.",
      ourSources:
        "I nostri dati provengono dalla stessa configurazione che calcola gli addebiti. Puoi verificarli qui.",
      modelsLink: "Tutti i modelli su {{appName}} con i prezzi aggiornati",
      pricingLink: "Piani e pacchetti di crediti",
      privacyLink: "La nostra informativa sulla privacy",
      moreTitle: "Altri confronti",
      ctaSubtitle:
        "{{guestCredits}} crediti gratuiti al mese. Senza account né carta. Passa da un modello tradizionale a uno aperto o senza censura a ogni messaggio.",
      ctaTry: "Avvia una chat in incognito",
      ctaModels: "Sfoglia tutti i modelli",
    },
  },
  us: {
    kind: "Chat con modelli tradizionali, aperti e senza censura",
    free: "Sì: {{guestCredits}} crediti al mese senza account, {{freeCredits}} con un account",
    paid: "Da {{subPrice}} al mese",
    filterShort:
      "Scegli il filtro per ogni chat. Per accedere ai modelli senza censura, conferma una volta di avere almeno 18 anni.",
    privacyShort:
      "Le chat in incognito restano nel browser. Le chat private si salvano nel tuo account.",
    apiShort: "Sì, compatibile con OpenAI e Anthropic dopo un acquisto",
    mediaShort: "Immagini, video, musica, voce",
    openShort: "Open source, installabile sul tuo computer",
    price:
      "Piani: {{planList}} al mese. Ricarica qualsiasi piano attivo con pacchetti da {{packCredits}} crediti per {{packPrice}}. I pacchetti non scadono. Paga con carta, PayPal o criptovalute.",
    models:
      "{{modelCount}} modelli di chat da {{labCount}} laboratori: {{mainstream}} tradizionali, {{open}} aperti e {{uncensored}} senza censura. Di questi, {{refusalsRemoved}} sono modelli tradizionali o aperti modificati per ridurre i rifiuti. {{ownModel}} ha una visione del mondo propria. È addestrato su libri e documenti banditi dall’Internet mainstream.",
    filter:
      "Tre livelli: tradizionali, aperti e senza censura. Scegli il modello a ogni messaggio. Per accedere ai modelli senza censura, conferma una volta di avere almeno 18 anni. Non applichiamo ulteriori filtri. I modelli tradizionali mantengono i filtri del fornitore.",
    privacy:
      "Le chat in incognito restano nella memoria locale del browser e funzionano senza account. Le chat private si salvano nel tuo account e conserviamo i contenuti multimediali generati sui nostri server. Ogni messaggio passa da noi al fornitore del modello che risponde.",
    api: "API /v1 compatibile con OpenAI e Anthropic per chat, immagini, video e voce. Si attiva con qualsiasi piano (da {{apiSubPrice}} al mese) o acquistando crediti. Gli account gratuiti ricevono HTTP 402.",
    media:
      "Immagine {{imageModels}}, video {{videoModels}}, musica {{musicModels}} e modelli vocali {{voiceModels}} sullo stesso saldo dei crediti, chiamabile da qualsiasi chat.",
    open: "L'intera piattaforma è open source su GitHub. Me lo fai da solo, sul tuo hardware.",
    forWho:
      "Le persone che vogliono modelli mainstream, aperti e non censurati più i media in una chat e un saldo, e vogliono impostare il filtro stesso.",
  },
  links: {
    hub: "Migliori piattaforme AI non censurate: confronto onesto",
    hubDesc:
      "Venice, NanoGPT, Janitor AI, Carattere. AI, FreedomGPT, modelli locali e altro ancora: prezzi, filtri, privacy e API, con fonti",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Piattaforme AI non censurate",
    sectionIntro:
      "Venice, NanoGPT, Janitor AI, Character. AI, FreedomGPT e altro ancora: prezzi, filtri e privacy dalle proprie pagine.",
  },
  platforms: {
    venice: {
      what: "Privacy-first AI app con un grande catalogo di modelli, molti modelli di testo non censurati, immagine, video e generazione musicale, uno OpenAI -compatibile API e uno strato di staking crypto (VVV e DIEM).",
      pricingNote:
        "Gratuito: 10 testo e 15 pronte di immagine al giorno, solo i modelli base. 100 crediti = $1. Video, musica e modelli di frontiera costano crediti in cima.",
      models:
        "420 modelli nei suoi documenti (148 testo). Circa 17 modelli di testo sono etichettati non censurati, guidati da Venice Uncensored 1.2 (Dolphin Mistral 24B Venice Edition), oltre alle costruzioni GLM, DeepSeek e Qwen non censurate. Claude, GPT, Gemini e Grok troppo.",
      filterShort:
        "Filtro di matura su per impostazione predefinita, Pro può spegnerlo",
      filter:
        "Un filtro della matura è attivato per impostazione predefinita. Gli abbonati Pro lo spengono nelle loro preferenze. Una modalità opzionale Safe Venice, bloccata con uno PIN, nasconde caratteri e immagini per adulti.",
      privacyShort: "La cronologia delle chat rimane sul tuo dispositivo",
      privacy:
        "Venice dice che la cronologia delle conversazioni rimane sul tuo dispositivo e non viene mai memorizzata sui suoi server. Per i modelli di terze parti in modalità Anonimo ti dice di assumere il provider memorizza i tuoi contenuti.",
      apiShort: "",
      api: "OpenAI -compatibile API, fatturato per token nei crediti USD. Staked DIEM dà $1 del credito API al giorno. Richiesta senza account con USDC tramite x402.",
      forWho:
        "Utenti che vogliono chat e media non censurati in un'unica app, oltre agli sviluppatori e ai titolari di cripto.",
      pro1: "Grande catalogo con molti modelli di testo non censurati e prezzi API non censurati a buon mercato.",
      pro2: "La storia rimane sul tuo dispositivo per impostazione predefinita.",
      con1: "Il livello libero è stretto: 10 richieste di testo al giorno sui modelli base.",
      con2: "Il filtro per adulti e la maggior parte dei media hanno bisogno di crediti Pro plus.",
    },
    uncensoredAi: {
      what: "App di chat non censurata modello singolo con un forum comunitario e archivi di documenti. Web, iOS e Android.",
      pricingNote:
        "Gratis: 3 risposte al giorno. I prezzi pro sono bloccati per tutta la vita. Carte, Cash App, Apple Pay e Bitcoin. I crediti API vendono separatamente a $0.05 per chiamata.",
      models:
        "Un modello: UncensoredAI v1.2, 32K contesto. Le sue pagine pubbliche non nominano il modello base o i dati di formazione.",
      filterShort: "Nessun filtro descritto, 18+ in termini",
      filter:
        "Si chiama una piattaforma AI senza restrizioni. I termini richiedono che gli utenti siano 18 o più anziani e proibiscano contenuti destinati a danneggiare, molestare o mettere in pericolo altri.",
      privacyShort: "Non utilizzato per la formazione, per la sua politica",
      privacy:
        "La sua politica dice che i tuoi dati non sono utilizzati per formare o migliorare i modelli AI. I messaggi vanno a Parasail AI per l'elaborazione. Pro mantiene la cronologia delle chat con la ricerca e l'esportazione.",
      apiShort: "",
      api: "Drop-in OpenAI -compatibile API a $0.05 per inferenza.",
      forWho:
        "Persone che diffidano delle narrazioni tradizionali e vogliono risposte sfocate su argomenti contestati.",
      pro1: "Piano più economico pagato in questo elenco, prezzo bloccato per la vita.",
      pro2: "Non utilizzato per la formazione, dice la sua politica sulla privacy.",
      con1: "Un modello, un contesto 32K, nessuna generazione di immagini, video o musica.",
      con2: "Sito fortemente ideologico intorno al modello: archivi e pagine di atterraggio su temi di cospirazione.",
    },
    nanoGpt: {
      what: "App web Pay-as-you-go e API per i modelli di testo, immagine, video e audio. Nessun abbonamento necessario, piano opzionale per i modelli aperti.",
      pricingNote:
        "Ricarica da $0.10 in criptovalute o da $1 con carta, senza commissioni di deposito. Gratis: un modello, solo sul web. PRO include solo modelli open source. L’uso di Claude, GPT, Gemini e Grok viene addebitato sul saldo.",
      models:
        "631 modelli di testo nel suo pubblico API, circa 39 di loro non censurati o abliterati: Venice Uncensored, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 abliterato e altro ancora. Modelli a monte principale anche.",
      filterShort: "Senza divieto di coperta NSFW, 18+",
      filter:
        "I termini richiedono 18+. Essi vietano CSAM, immagini intime non conformi e sessualmente esplicite, non contenuti per adulti in generale.",
      privacyShort: "Chat nel tuo browser, nessun account necessario",
      privacy:
        "Le conversazioni vengono memorizzate nel browser per impostazione predefinita, la sincronizzazione cloud è opt-in. NanoGPT dice che non registra o conserva i suggerimenti e le risposte. Nessun conto richiesto. Alcuni percorsi di provider consentono la formazione.",
      apiShort: "",
      api: "OpenAI -compatibile API, anche formato messaggi Anthropic, con pagamenti senza account x402. Ogni risposta restituisce il suo costo.",
      forWho:
        "Utenti e sviluppatori che vogliono ogni modello, pagamenti di cripto e nessun abbonamento.",
      pro1: "Elenco modello enorme, prezzi elenco, ingresso da dieci centesimi.",
      pro2: "Nessun account necessario, le chat rimangono nel tuo browser.",
      con1: "Free tier è un modello sul web.",
      con2: "La privacy dipende dal percorso che scegli.",
    },
    openRouter: {
      what: "Sviluppatore API che tratta una chiave di centinaia di modelli da molti fornitori, fatturati per token da crediti prepagati.",
      pricingNote:
        "Nessun abbonamento. I prezzi dell'elenco dei fornitori più una tassa del 5,5% sugli acquisti di credito. Modelli gratuiti: 50 richieste al giorno, 1.000 dopo aver acquistato $10 di crediti.",
      models:
        "474 modelli, 17 gratis. Le opzioni non censurate sono sottili: Venice Uncensored (Dolphin Mistral 24B, ospitato da Venice) e le classifiche di gioco come Hermes 4 e Magnum.",
      filterShort: "Si applicano le regole del fornitore, molte rotte moderate",
      filter:
        "I termini richiedono 18+. OpenRouter schermate ingressi per CSAM noto. Ogni fornitore mantiene il controllo del proprio modello, e le rotte moderate declinano per la politica del venditore.",
      privacyShort:
        "Non è possibile effettuare l'archiviazione rapida a meno che non si opti",
      privacy:
        "OpenRouter dice che non memorizza i suggerimenti o le risposte a meno che non si opta dentro. I metadati sono sempre memorizzati. Le politiche di registrazione del fornitore variano.",
      apiShort: "",
      api: "OpenAI: compatibile API. Questo è il prodotto.",
      forWho:
        "Sviluppatori che vogliono una chiave API per molti modelli con il failback del fornitore.",
      pro1: "Catalogo enorme a prezzi di listino, senza abbonamento.",
      pro2: "Logging e formazione sono opt-in.",
      con1: "Pochi modelli non censurati.",
      con2: "Nessun focus dell'app di chat di consumo: si porta l'interfaccia.",
    },
    freedomGpt: {
      what: "App AI all-in-one: modelli mainstream accanto al proprio modello privo di censura Liberty, con immagine e generazione video. Anche un vecchio app desktop open-source per i modelli offline.",
      pricingNote:
        "Gratuito senza carta o account. Pro include 2.200 crediti al mese: una risposta premium costa circa 10, un'immagine circa 25, un video di 5 secondi circa 400.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral e altro ancora, più Liberty e altri modelli senza censura nella stessa lista. Nessun conteggio totale pubblicato.",
      filterShort: "Modelli senza censura, regole di legge e di etica US",
      filter:
        "FreedomGPT dice che tutti e tutti i modelli che ospita devono seguire la legge US, e non permette ai suoi modelli di essere utilizzati per scopi non etici. Un'etichetta senza censura non promette che ogni richiesta venga risposto.",
      privacyShort: "Messaggi condivisi con i provider AI",
      privacy:
        "La sua politica dice messaggi di chat, registrazioni vocali e immagini sono condivisi con i fornitori AI di terze parti per produrre risposte. Nessun periodo di conservazione è dichiarato. Usarlo senza un account non fa una richiesta cloud locale.",
      apiShort: "",
      api: "API a chat.freedomgpt.com /api/v1 con una chiave dal cruscotto. Il prezzo non è documentato.",
      forWho:
        "Gli utenti che vogliono un abbonamento per molti modelli con opzioni senza censura.",
      pro1: "Inizio gratuito senza account o carta.",
      pro2: "Immagini e video nella stessa app.",
      con1: "Ancora vincolato dalla legge US e da una regola non etica.",
      con2: "L'applicazione desktop open-source non è stata aggiornata dal giugno 2024.",
    },
    gabAi: {
      what: "Piattaforma AI multi-model da Gab con 200+ modelli, il proprio modello Arya, una modalità agente, immagine, generazione di video e musica e applicazioni desktop. Posizione cristiana apertamente di destra.",
      pricingNote:
        "Gratis: 250 crediti dopo la verifica e-mail. Le confezioni di credito una volta da $10 per 700 crediti, non scadono mai.",
      models:
        "Circa 200 modelli da 31 fornitori: GPT, Claude, Gemini, DeepSeek, Qwen, Kimi e altro ancora. Arya è il modello di Gab, costruito intorno ai valori cristiani e principi conservatori.",
      filterShort:
        "Libertà di espressione, con restrizioni sui contenuti sessuali",
      filter:
        "I termini richiedono 18+ e vietano il contenuto osceno, sessualmente esplicito o pornografico. I sistemi automatizzati possono scansionare i contenuti per la conformità. Libero sulla politica, non sul contenuto degli adulti.",
      privacyShort: "Chat memorizzate, utilizzate per migliorare i modelli",
      privacy:
        "Gab vede le vostre richieste e risposte, mantiene la storia sui suoi server e utilizza i contenuti per migliorare i suoi modelli. Dice che la tua identità è nascosta da fornitori di modelli di terze parti.",
      apiShort: "",
      api: "OpenAI e Anthropic compatibili API. Richiede un piano Plus.",
      forWho:
        "Gli utenti conservatori e cristiani che vogliono AI costruito al di fuori della Big Tech.",
      pro1: "Grande catalogo, modalità agente e applicazioni desktop.",
      pro2: "I pacchetti di credito non scadono mai.",
      con1: "Bans contenuti sessualmente espliciti: nessun aiuto per la finzione adulta.",
      con2: "Prompts memorizzati e utilizzati per migliorare i modelli.",
    },
    janitorAi: {
      what: "Sito di carattere comunitario con milioni di bot fatti dall'utente, un modello integrato gratuito (JLLM) e la possibilità di collegare il proprio modello tramite un proxy API.",
      pricingNote:
        "Gratis: chat illimitate sui modelli standard, circa 9K token di contesto. janitor+ aggiunge 5x memoria del personaggio, velocità prioritaria e più modelli. Il suo Router legge altri modelli per token, solo web, abbonati solo.",
      models:
        "JLLM, il suo modello libero (modello base non divulgato). O qualsiasi modello che si collega attraverso un proxy: la sua guida ufficiale utilizza OpenRouter.",
      filterShort: "bot NSFW ammessi se contrassegnati, 18+ autodichiarato",
      filter:
        "Solo gli adulti, 18+ per autodichiarazione. Bots sono contrassegnati Limited (senza contenuto sessuale) o Limitless (NSFW consentito). L'app mobile inizia in modalità provvisoria fino a quando non si abilita NSFW sul web. Banned: qualsiasi cosa sessuale che coinvolga minori, violenza sessuale, gore, bestialità, discorso d'odio.",
      privacyShort: "Chat memorizzate, utilizzate per la ricerca e lo sviluppo",
      privacy:
        "Le chat vengono memorizzate come contenuto utente e le sue policy elencano la ricerca e lo sviluppo per migliorare i suoi sistemi AI. Con un proxy, i tuoi messaggi vanno anche a quel provider sotto la sua politica.",
      apiShort: "Porta la tua chiave",
      api: "Nessun sviluppatore API. Esso consuma API: è possibile portare la propria chiave attraverso un proxy.",
      forWho:
        "I giocatori che vogliono una grande biblioteca gratuita di personaggi della comunità.",
      pro1: "chat gratuita illimitata con milioni di bot della comunità.",
      pro2: "Porta il tuo modello attraverso un proxy.",
      con1: "Il contesto libero è di circa 9K gettoni: le storie lunghe dimenticano le prime scene.",
      con2: "Solo testo: nessuna immagine, video o generazione vocale.",
    },
    sillyTavern: {
      what: "Gratis, open-source (AGPL-3.0) chat frontend si installa da soli. Carte di carattere, lorebooks, estensioni. Non spedisce nessun modello: ne colleghi uno.",
      pricingNote:
        "L'app è gratuita per sempre. Paghi qualsiasi API ti colleghi, o niente se gestisci un modello a livello locale.",
      models:
        "Non incluso. Si collega a backend locali (KoboldCpp, llama.cpp, Ollama, text-generation-webui) e circa 16 API cloud, tra cui OpenAI, Claude, Google, Mistral, DeepSeek, OpenRouter e qualsiasi endpoint compatibile OpenAI.",
      filterShort: "Nessuno dei suoi: il modello decide",
      filter:
        "Non c'e' nessun filtro. I limiti sono ciò che il modello o il fornitore collegato fa rispettare.",
      privacyShort: "Installazione locale, nessun tracciamento",
      privacy:
        "Il progetto dice che non offre servizi ospitati e non traccia i dati degli utenti. Le chat sono memorizzate sulla vostra macchina. Qualsiasi cosa invii ad una nuvola API ricade sotto la politica di quel fornitore.",
      apiShort: "Collegamento alle API",
      api: "Un cliente, non un fornitore. Parla con lo API che si configura.",
      forWho:
        "Gli utenti di potere che accettano una curva di apprendimento ripida per il pieno controllo su prompt e caratteri.",
      pro1: "Controllo massimo: qualsiasi backend, qualsiasi prompt, estensioni ricche.",
      pro2: "Gratis, open source, nulla lascia la vostra macchina tranne quello che si invia a un API.",
      con1: "Si installa e lo mantiene, e fornire il modello da soli.",
      con2: "Curva dell'apprendimento costante, secondo la descrizione del progetto.",
    },
    characterAi: {
      what: "La più grande piattaforma di chat dei personaggi mainstream, 10M+ caratteri sui propri modelli, con regole rigide del contenuto. Incluso qui come il contrasto filtrato.",
      pricingNote:
        "Gratis: messaggi illimitati con annunci. lite rimuove la maggior parte degli annunci (prezzo US, varia per paese). c.ai + aggiunge i modelli di chat top, migliore memoria e nessuna modalità lenta.",
      models:
        "Solo i suoi modelli, offerti come stili di chat (PipSqueak, DeepSqueak, LongSqueak). Nessuna scelta di modello oltre a quelle, nessuna chiave.",
      filterShort: "Filtrato, pornografia mai sostenuta",
      filter:
        "Il contenuto pornografico è contro i suoi termini e, nelle sue parole, non sarà supportato in alcun punto del futuro. Ogni utente passa attraverso l'assicurazione dell'età tramite Persona. Gli utenti verificati come sotto 18 ottenere solo la modalità di lettura, nessuna chat.",
      privacyShort:
        "Le chat possono formare i suoi modelli e gli annunci target",
      privacy:
        "La sua politica sulla privacy dice che le informazioni sono utilizzate per formare i suoi modelli AI e per fornire pubblicità su misura.",
      apiShort: "",
      api: "Nessun sviluppatore pubblico API.",
      forWho:
        "Chat di intrattenimento sicuro per il lavoro con una libreria di caratteri gigante.",
      pro1: "Libreria di caratteri enorme e messaggi gratuiti illimitati.",
      pro2: "Ingresso economico con lite, chiamate vocali con caratteri.",
      con1: "Niente contenuti per adulti, mai. Le scene scure si ammorbidiscono o rifiutano.",
      con2: "Le chat possono essere utilizzate per la formazione e gli annunci. Nessuna scelta di modello.",
    },
    kindroid: {
      what: "App AI: un amico o un partner persistente con memoria lunga, chiamate vocali e video, selfie e chat di gruppo.",
      pricingNote:
        "Nessun livello libero in corso: un'anteprima di 50 messaggi, poi di sola lettura. Ultra e MAX sono add-on mensili in cima. US App Store prezzi; Kindroid dice web checkout è di solito più conveniente.",
      models:
        "I suoi modelli (Polaris, Ember, Reverie e altri) e i suoi modelli selfie. Nessuna chiave.",
      filterShort: "Stance non filtrata, linee rosse a livello di account",
      filter:
        "Si chiama veramente non filtrato e non mette nessun filtro sullo AI stesso, ma esegue la scansione di messaggi per alcune linee rosse come auto-armo imminente o danno ad altri. 18+: un abbonamento a pagamento conta come verifica dell'età, Yoti è l'alternativa.",
      privacyShort: "Crittografato a riposo, non end-to-end",
      privacy:
        "Le chat sono crittografate a riposo e in transito, non end-to-end: i suoi sistemi elaborano contenuti e sistemi di sicurezza automatizzati lo esaminano. Dice che i dati non sono mai venduti.",
      apiShort: "Personal API ai tuoi compagni",
      api: "Personal API chiavi per parlare con i propri Kindroids, non un modello generale API.",
      forWho:
        "Adulti che vogliono un compagno AI a lungo termine con voce, video e foto.",
      pro1: "stack completo compagno: memoria, selfie, voce e videochiamate dal vivo.",
      pro2: "Stance non filtrata rivolta agli adulti.",
      con1: "Paga per continuare a parlare dopo 50 messaggi.",
      con2: "I livelli di memoria superiore si accumulano: Ultra e MAX in cima al piano base.",
    },
    nomi: {
      what: "AI app compagna costruita intorno alla memoria a lungo termine: amico, partner o mentore, con selfie, chat voce e gruppo.",
      pricingNote:
        "Free tier con messaggi e immagini giornalieri (limiti non pubblicati). L'iscrizione sblocca messaggi e voce illimitati. Prezzi dell'App Store di US; nessun elenco dei prezzi del web pubblico.",
      models: "I suoi modelli, non nominati pubblicamente. Nessuna chiave.",
      filterShort: "Testo non filtrato, filtro nudità su immagini",
      filter:
        "Il suo sito dice che le conversazioni non sono limitate da filtri di contenuti arbitrari. Le immagini hanno un filtro per nudità a causa di app store e processori di pagamento. Sotto i 18 anni non può usarlo.",
      privacyShort: "Mai venduto, cancellato con il tuo account",
      privacy:
        "La sua politica dice che i dati personali non vengono mai venduti o affittati e non vengono conservati dopo aver cancellato il tuo account (entro circa 28 giorni).",
      apiShort: "Personal API ai tuoi compagni",
      api: "REST API per chattare con il proprio Nomis, non un modello generale API.",
      forWho:
        "Persone che vogliono un compagno emotivo e a lungo termine che si ricorda.",
      pro1: "Memoria costruita per relazioni lunghe.",
      pro2: "Free tier e una chiara posizione di privacy senza vendere.",
      con1: "Filtro Nudity su immagini.",
      con2: "Voce solo con un abbonamento, limiti liberi non pubblicati.",
    },
    crushOn: {
      what: "NSFW chat sito con un interruttore non filtrato e accesso misurato di credito a modelli di terze parti.",
      pricingNote:
        "Gratis: 100 crediti di messaggi al mese, modelli liberi illimitati, la storia spazzata dopo 7 giorni di inattività. I piani annuali sono più economici. I modelli Pro hanno bisogno di un abbonamento o di un pacchetto separato.",
      models:
        "Modelli di terze parti indirizzati dal livello; i suoi nomi di sito Claude 4, Gemini 2.5 Flash, GPT-4.1 e DeepSeek V4. Elenco completo dietro il login.",
      filterShort: "Interruttore non filtrato dopo un controllo dell'età",
      filter:
        "Un interruttore non filtrato sblocca il testo adulto dopo la verifica dell'età: selfie o ID tramite Didit, AgeGo, o un pagamento $0.99. Le sue linee guida vietano ancora immagini sessuali esplicite, immagini realistiche di persone reali, minorenni e personaggi invecchiati.",
      privacyShort: "Le chat possono formare i suoi modelli",
      privacy:
        "La sua politica dice che i contenuti di chat possono essere utilizzati per formare i suoi modelli, non collegati a utenti specifici. I cookie vengono utilizzati per la retargeting degli annunci.",
      apiShort: "",
      api: "Nessun sviluppatore pubblico API.",
      forWho:
        "Gli adulti che vogliono la chat di carattere piccante in un app ready-made.",
      pro1: "Giornale adulto in un'app lucidata, ingresso libero.",
      pro2: "Età controllare che, per CrushOn, non mostra mai la tua foto o ID.",
      con1: "Sei livelli di credito fino a $199.99 al mese: difficile da prevedere il costo.",
      con2: "Storia gratuita cancellata dopo 7 giorni di inattività; le chat possono formare modelli.",
    },
    ollama: {
      what: "Gratis, MIT -licensed strumento che scarica e gestisce i modelli aperti sul proprio computer, con un locale API. Vende anche modelli cloud ospitati.",
      pricingNote:
        "Modelli in esecuzione sul proprio hardware è gratuito e illimitato. I piani a pagamento coprono solo i suoi modelli cloud.",
      models:
        "Qualsiasi modello aperto nella sua libreria, tra cui Dolphin 3 e la comunità ha abliterato uploads come Qwen 3.8 abliterato. Gli upload comunitari non sono controllati da Ollama.",
      filterShort: "Qualunque modello carichi",
      filter:
        "Nessun filtro proprio quando si esegue localmente. Un modello abliterato non si rifiuta. Un modello di stock mantiene i rifiuti con cui è stato addestrato.",
      privacyShort:
        "Completamente locale, le richieste non lasciano mai la vostra macchina",
      privacy:
        "Ollama dice che non vede i vostri suggerimenti o dati quando si esegue localmente. Il cloud può essere spento completamente.",
      apiShort: "",
      api: "OpenAI: server compatibile su localhost:11434, più un cloud API per i suoi modelli ospitati.",
      forWho:
        "Sviluppatori e utenti tecnici con una macchina capace, spesso abbinato a un frontend di chat.",
      pro1: "Totale privacy e zero costo per messaggio.",
      pro2: "Biblioteca enorme, OpenAI -compatibile locale API.",
      con1: "La qualità del tuo hardware è: un modello 70B è un download di 43 GB prima del contesto.",
      con2: "Per lo più CLI e API: si aggiunge l'interfaccia di chat.",
    },
    lmStudio: {
      what: "App desktop con un'interfaccia lucida per scaricare ed eseguire modelli locali (GGUF e MLX), oltre a un server locale API.",
      pricingNote:
        "Libero per uso domestico e di lavoro dal luglio 2025. I piani a pagamento aggiungono modelli ospitati e più dispositivi.",
      models:
        "Modelli locali da Hugging Face, tra cui le costruzioni GGUF abliterate e Dolphin.",
      filterShort: "Qualunque modello carichi",
      filter:
        "Nessun filtro proprio per i modelli locali. Quello che si rifiuta è il modello che si sceglie.",
      privacyShort: "L'inferenza locale rimane sul dispositivo",
      privacy:
        "Modelli locali funzionano sul tuo dispositivo. I suoi servizi ospitati rivendicano zero conservazione dei dati.",
      apiShort: "",
      api: "OpenAI: server compatibile su localhost:1234.",
      forWho:
        "Non sviluppatori che vogliono modelli locali senza una riga di comando, su un Mac con Apple Silicon, Windows o Linux.",
      pro1: "Il modo più semplice per eseguire modelli non censurati localmente.",
      pro2: "Gratuito, compreso uso commerciale.",
      con1: "L'applicazione stessa è fonte chiusa. Nessun Mac Intel.",
      con2: "Stesso soffitto hardware di qualsiasi configurazione locale.",
    },
  },
  hub: {
    meta: {
      title: "Le migliori piattaforme AI non censurate 2026: Confronto onesto",
      category: "Confronto",
      description:
        "{{count}} piattaforme AI non censurate rispetto a: Venice, NanoGPT, Janitor AI, FreedomGPT, Kindroid, modelli locali e altro ancora. Prezzi, filtri, privacy, API. Fonti citate.",
      imageAlt: "Piattaforme AI non censurate rispetto al lato",
      keywords:
        "migliore incenso AI, non censurato AI piattaforme, non censurate AI chat, non filtrato AI, Venice AI alternativa, Venice.ai recensione, NanoGPT, Janitor AI alternativa, Carattere AI alternativa, FreedomGPT, Gab AI, uncensored.ai, Kindroid, Nomi, CrushOn AI, SillyTavern, Ollama incensored, LM Studio modelli non censurati, abliterati, NSFW AI chat, {{appName}}",
    },
    hero: {
      category: "Confronto",
      readTime: "14 min lettura",
      title: "Migliori piattaforme AI non censurate 2026: il confronto onesto",
      subtitle:
        "Piattaforme {{count}}, più noi. Prezzi reali dalle proprie pagine di prezzi, come ognuno filtra, che cosa succede alle vostre chat, e per chi ciascuno è costruito. Ogni fatto ha una fonte.",
    },
    intro: {
      lead: "Ogni sito AI non censurato si chiama il più privato, il più libero, il meno filtrato. Metà di loro vietano ancora contenuti per adulti. Un treno per le tue chiacchierate. Uno ti vende un token. Le pagine di marketing non ti diranno quale.",
      p2: "Quindi abbiamo controllato. La pagina dei prezzi, i termini, la politica sulla privacy e i documenti API, su {{date}}. Di seguito: una rapida scelta per lavoro, la tabella completa, una carta per piattaforma con le sue fonti, e i casi in cui non si dovrebbe utilizzare noi.",
      disclosure:
        "Disclosure: {{appName}} è una delle piattaforme di questa pagina, e compriamo da molti degli altri. Venice, uncensored.ai, NanoGPT, FreedomGPT, Gab AI e OpenRouter servono alcuni dei nostri modelli attraverso le loro API. Noi diciamo dove, con numeri dal vivo. Nessun punteggio, nessuna valutazione stellare: fatti e fonti, si giudica.",
    },
    picks: {
      title: "Scelte rapide: la migliore AI non censurata per ogni lavoro",
      intro: "Nessuna piattaforma vince tutto. Inizia da quello che ti serve.",
      oneApp: {
        title: "Tutto in una chat: {{appName}}",
        body: "Modelli {{modelCount}}, {{uncensored}} non censurati, accanto a Claude, GPT e Gemini. Immagini, video, musica e voce sullo stesso saldo. Si passa il modello per messaggio.",
      },
      ownWorldview: {
        title:
          "Una visione del mondo diversa, non solo meno rifiuti: il modello di uncensored.ai",
        body: "La maggior parte dei modelli non censurati sono modelli mainstream con i rifiuti tagliati. uncensored.ai vende un modello con le proprie prese. Su {{appName}} si corre come {{ownModel}}, accanto a tutto il resto.",
      },
      privacy: {
        title: "Chat che non toccano mai un server: Venice o NanoGPT",
        body: "Entrambi mantengono la cronologia del browser per impostazione predefinita. NanoGPT non ha bisogno di alcun conto. Su {{appName}}, chat incognito fanno lo stesso.",
      },
      roleplay: {
        title: "Ruolo di carattere comunitario: Janitor AI o SillyTavern",
        body: "Janitor AI per un'enorme biblioteca bot gratuita. Sciocchezze se volete il controllo totale e lo istituirà voi stessi.",
      },
      companions: {
        title: "Un compagno AI a lungo termine: Kindroid o Nomi",
        body: "Memoria, selfie, chiamate vocali. Kindroid non ha un livello continuo libero; Nomi non filtra la nudità nelle immagini.",
      },
      developers: {
        title: "API per modelli non censurati: NanoGPT, Venice o OpenRouter",
        body: "NanoGPT e Venice portano molti modelli non censurati a prezzi bassi per-token. OpenRouter ha il catalogo più ampio ma poche opzioni non censurate.",
      },
      local: {
        title: "Totale privacy, costo zero per messaggio: Ollama o LM Studio",
        body: "Eseguire modelli abliterati sulla vostra macchina. Non lo lascia niente. Il vostro hardware imposta il soffitto di qualità.",
      },
      filtered: {
        title: "Si desidera il filtro: Carattere. AI",
        body: "Sicuro-per-lavoro per design, con controlli di età per tutti. La chiamata giusta per gli adolescenti o un posto di lavoro rigoroso.",
      },
    },
    table: {
      title: "Tutte le piattaforme {{count}} e {{appName}}, fianco a fianco",
      intro:
        "Scorrere lateralmente sul cellulare. I fatti dei concorrenti hanno controllato {{date}} sulle proprie pagine, la nostra legge dal vivo dalla nostra configurazione.",
      footnote:
        'I prezzi sono i prezzi di liste USD da ogni pagina; Kindroid e Nomi mostrano i prezzi solo al momento del checkout dopo il login, quindi i loro provengono dallo US App Store. Tasse, prezzi regionali e promozioni differiscono. "Limited" significa attraverso un setup porta-tuo-a-chiave, un add-on o un compagno personale API.',
    },
    kinds: {
      title: "Uncensored non è una cosa: quattro tipi di filtro",
      intro:
        "Prima di confrontare le piattaforme, sapere cosa nasconde l'etichetta. Il modello decide più dell'app.",
      abliterated:
        "Abliterato: un modello mainstream o aperto con la sua direzione di rifiuto rimosso dai pesi. I ricercatori hanno trovato il rifiuto si trova in una sola direzione all'interno del modello; tagliarlo e il modello smette di dire no. Stessa conoscenza, stessa visione del mondo, senza schivare.",
      finetuned:
        "Fine-tunes (Dolphin, Venice Uncensored): riqualificato su dati che riducono i rifiuti. Stessa idea, metodo diverso.",
      ownWorldview:
        "Vista sul mondo: {{ownModel}} è addestrato su libri e documenti vietati da internet mainstream. Non solo smette di rifiutare, sostiene prende i modelli mainstream non vi darà.",
      filtered:
        'Filtrato: modelli e applicazioni tradizionali come Carattere. AI. Uno strato di sicurezza decide prima di digitare. Sulla maggior parte delle piattaforme "non censurate", i modelli mainstream mantengono anche i filtri del loro fornitore.',
      tradeoff:
        "Il trade-off: l'abliteration write-up stesso misurava un calo di qualità su ogni benchmark, in parte recuperato da formazione supplementare. I modelli non censurati sono solitamente più piccoli dei modelli di frontiera. Usali per ciò che il filtro blocca, non per il vostro ragionamento più duro.",
      sourceName: "Abliteration",
    },
    platforms: {
      title: "Ogni piattaforma, in dettaglio",
      intro:
        "Che cosa è, che cosa costa, come filtra, dove le chat vanno, e le sue fonti. Controllato {{date}}.",
      price: "Prezzo: {{plans}}. {{note}}",
      models: "Modelli: {{text}}",
      filter: "Filtro e consenso: {{text}}",
      privacy: "Privacy: {{text}}",
      api: "API: {{short}}. {{text}}",
      media: "Media: {{text}}",
      open: "Open source: {{text}}",
      forWho: "Costruito per: {{text}}",
      strengths: "Punti",
      limits: "Limiti",
      sources: "Fonti, controllato {{date}}",
    },
    upstream:
      "{{appName}} esegue i modelli {{models}} attraverso {{name}} API ({{uncensored}} di loro non censurato), incluso {{examples}}. Stessi modelli, la nostra chat, la fatturazione.",
    us: {
      title: "Dove {{appName}} si adatta, onestamente",
      intro:
        "Non siamo un laboratorio di modelli. Siamo la chat che mette ogni tipo di modello in un unico posto e ti permette di scegliere il filtro.",
      models:
        "Modelli di chat {{modelCount}} da laboratori {{labCount}}: {{mainstream}} mainstream, {{open}} aperto, {{uncensored}} non censurato. Scegli il modello per messaggio, quindi un thread può mescolare Claude e un modello abliterato.",
      upstream:
        "I nostri modelli non censurati provengono da fornitori in questa pagina. Venice serve {{veniceModels}} dei nostri modelli, NanoGPT {{nanoGptModels}}, uncensored.ai {{uncensoredAiModels}}, FreedomGPT {{freedomGptModels}}, Gab AI {{gabAiModels}}. Noi aggregati, non ci alleniamo.",
      consent:
        "Modelli non censurati si sbloccano dopo una sola volta 18+ conferma. Nessun strato di rifiuto in cima. Gli umani decidono cosa leggono, non una società.",
      privacy:
        "Incognito chat dal vivo nel tuo browser, non sui nostri server e non hanno bisogno di account. Le chat private si sincronizzano con il tuo account. Ogni messaggio passa ancora attraverso di noi al fornitore che la risponde.",
      pricing:
        "{{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account. Piani: {{planList}} al mese. Ricarica un piano attivo con pacchetti di crediti che non scadono. Paga con carta, PayPal o criptovalute.",
      api: "OpenAI e Anthropic compatibili API per chat, immagini, video e discorso, dopo qualsiasi piano (da {{apiSubPrice}}) o un acquisto di credito.",
      media:
        "Immagine {{imageModels}}, video {{videoModels}}, musica {{musicModels}} e modelli vocali {{voiceModels}} sullo stesso saldo.",
      open: "L'intera piattaforma è open source. Se non vuoi un intermediario.",
      weakTitle: "Dove non siamo la scelta migliore",
      weak1:
        "Prezzo per token: aggiungiamo {{markup}} % ai costi del fornitore. Se si desidera solo i modelli di un fornitore, andare direttamente a Venice o NanoGPT è più conveniente.",
      weak2:
        "Libreria dei caratteri: Janitor AI e Character. AI ha milioni di bot della comunità. Il nostro è molto più piccolo, anche se è possibile importare caratteri da caratteri. AI e link Talkie.",
      weak3:
        "Caratteristiche di Companion: nessun selfie o videochiamate dal vivo come Kindroid o Nomi. Siamo uno spazio di lavoro di chat, non un'app compagna.",
      weak4:
        "Totale privacy: un modello locale sulla propria macchina batte qualsiasi servizio ospitato, noi inclusi.",
      modelsLink: "Vedi tutti i modelli {{modelCount}} con prezzi dal vivo",
      pricingLink: "Piani e crediti gratuiti",
      guideLink: "Guida: ogni modello non censurato e ciò che è buono a",
    },
    versus: {
      title: "Confronti testa a testa",
      intro:
        "Le cinque piattaforme le persone ci confrontano con la maggior parte, ciascuna sulla sua pagina con pro, contro e una scelta chiara.",
    },
    method: {
      title: "Come abbiamo confrontato",
      intro: "Regole a cui ci siamo tenuti. Controllato {{date}}.",
      sources:
        "Pagine ufficiali: pagina dei prezzi di ogni piattaforma, termini, privacy policy, help center, API docs o model list. I siti di recensioni non sono mai stati una fonte.",
      prices:
        "I prezzi sono i prezzi dell'elenco USD, come mostrato il giorno. Dove un prezzo si trova dietro un login, abbiamo usato la lista ufficiale dell'app store della piattaforma e diciamo così.",
      noScores:
        "Nessun punteggio, nessuna valutazione, nessun distintivo vincitore. Diversi lavori hanno bisogno di piattaforme diverse.",
      us: "I nostri numeri (modelli, prezzi, crediti gratuiti) sono letti dal vivo dalla configurazione che ti fattura, in modo da non poter derivare da ciò che paghi.",
      bias: "Siamo un concorrente e un cliente di diverse piattaforme qui. Noi diciamo dove ci dirigiamo verso di loro e elenchiamo i casi in cui si dovrebbe scegliere qualcun altro.",
      changes:
        "Piani e politiche cambiano. Ogni carta collega le sue fonti: controllali prima di acquistare. Dove una pagina non ha detto qualcosa, l'abbiamo lasciato fuori invece di indovinare.",
      corrections:
        "Ho trovato un prezzo obsoleto o un reclamo sbagliato? Dicci con un link alla fonte e lo risolviamo.",
      correctionsLink: "Contattaci",
    },
    faq: {
      title: "FAQ",
      best: {
        q: "Qual è il miglior AI non censurato?",
        a: "Dipende dal lavoro. Per molti modelli più media in una chat: {{appName}}. Per la prima chat privacy: Venice o NanoGPT. Per i giochi di ruolo della comunità: Janitor AI o SillyTavern. Per un compagno: Kindroid o Nomi. Per la privacy totale: un modello locale con Ollama o LM Studio.",
      },
      free: {
        q: "C'è un AI libero non censurato?",
        a: "Sì, con limiti. Venice offre 10 SMS al giorno, risposte uncensored.ai 3, chat illimitata Janitor AI sul proprio modello, CrushOn 100 crediti al mese, crediti {{appName}} {{guestCredits}} al mese senza un account. Modelli locali con Ollama o LM Studio non costano nulla per messaggio.",
      },
      private: {
        q: "Quale AI non censurato è il più privato?",
        a: "Un modello locale: niente lascia la vostra macchina. Tra i servizi ospitati, Venice e NanoGPT mantenere la storia nel browser per impostazione predefinita e NanoGPT non ha bisogno di account. Su {{appName}}, incognito chats rimanere nel tuo browser. Ogni servizio ospitato invia ancora il tuo messaggio a un fornitore di modelli.",
      },
      difference: {
        q: "Qual è la differenza tra modelli abliterati e non censurati?",
        a: "Modelli abliterati sono modelli mainstream o aperti con la direzione di rifiuto tagliata fuori dai pesi: stessa conoscenza, stessa visione del mondo, nessun rifiuto. {{ownModel}} è di nuovo diverso: addestrato su libri e documenti vietati da internet mainstream, con le proprie prese.",
      },
      veniceVs: {
        q: "Venice AI è davvero senza censura?",
        a: "I suoi modelli non censurati sono, e il suo filtro maturo è acceso di default fino a quando un abbonato Pro non lo spegne. I suoi modelli tradizionali (Claude, GPT, Gemini) conservano i propri filtri di vendita, come ovunque.",
      },
      characterAi: {
        q: "C'è un carattere. AI senza un filtro?",
        a: "AI: dice che il contenuto pornografico non sarà mai supportato. Alternative con giochi di ruolo per adulti: Janitor AI (bots senza limiti), CrushOn (interruttore non filtrato), Kindroid, SillyTavern con un modello non censurato, o {{appName}} con modelli di gioco di ruolo non censurati.",
      },
      local: {
        q: "Posso eseguire un AI non censurato sul mio computer?",
        a: "Si'. Ollama o LM Studio più un modello abliterato o Dolphin. Un modello 8B è un download 5 GB e funziona su un computer portatile tipico. Un modello 70B ha bisogno di oltre 40 GB di memoria. La qualità è bloccata dal vostro hardware.",
      },
      legal: {
        q: "È legale usare un AI non censurato?",
        a: "Usare uno è legale nella maggior parte dei paesi. Ciò che si genera e pubblica è ancora vincolato dalla legge in cui si vive. Ogni piattaforma vieta contenuti che coinvolgono minori e la maggior parte vietano immagini non consensuali di persone reali.",
      },
    },
    cta: {
      title: "Provalo sui tuoi suggerimenti",
      subtitle:
        "Crediti gratuiti {{guestCredits}} al mese, nessun conto. Fai la domanda che si è rifiutato altrove e confronta.",
      try: "Avviare una chat incognito",
      models: "Sfoglia tutti i modelli",
    },
  },
  versus: {
    venice: {
      meta: {
        title: "{{appName}} vs Venice AI: Confronto onesto 2026",
        description:
          "{{appName}} vs Venice.ai: prezzi, modelli non censurati, filtro maturo, privacy e API fianco a fianco. Compriamo da Venice, quindi diciamo esattamente dove ognuno vince.",
        keywords:
          "Venice AI alternativa, Venice.ai vs. Venice AI recensione, Venice AI prezzi, Venice Pro, Venice non censurato, è Venice AI incensored, Venice AI filtro maturo, Venice AI API, VVV DIEM, non censurato AI chat, {{appName}} vs. Venice",
      },
      hero: {
        title: "{{appName}} vs Venice AI",
        subtitle:
          "Due piattaforme AI non censurate, una delle quali acquista dall'altra. Prezzi, filtri, privacy e API, fianco a fianco.",
        readTime: "7 min lettura",
      },
      intro: {
        lead: "Venice è il nome più noto in AI privato e non censurato. Molti dei nostri modelli non censurati funzionano su Venice 's API. Quindi questo non e' un takedown. È la risposta onesta a una domanda: se si utilizza Venice direttamente, o tramite {{appName}}?",
        p2: "Venice fatti da propri prezzi, privacy e documenti pagine, controllato {{date}}. Il nostro legge dal vivo dalla nostra configurazione.",
      },
      relation:
        "Siamo un cliente Venice: {{veniceModels}} dei nostri modelli passa attraverso Venice API ({{veniceUncensored}} di loro non censura), tra cui {{veniceExamples}}. Stessi modelli, app diverse intorno a loro.",
      verdict:
        "Scegliere Venice se si desidera il suo catalogo completo, la storia solo locale e il prezzo più economico per-token sui propri modelli, e si sta bene pagando per Pro a cadere il filtro maturo. Scegliere {{appName}} se si desidera che i modelli non censurati di Venice accanto a Claude, GPT, il modello di uncensored.ai e abliterato GLM e DeepSeek si costruisce da altri fornitori, in una chat, senza filtro per sbloccare oltre una volta 18+ conferma.",
      themPros: {
        a: "Catalogo più grande: 420 modelli nei suoi documenti, tra cui video, musica e voce.",
        b: "La storia rimane sul tuo dispositivo per impostazione predefinita. Forte storia della privacy.",
        c: "Modo più economico per chiamare i propri modelli Venice: nessun markup di middleman, più DIEM staking per il credito quotidiano API.",
      },
      themCons: {
        a: "Livello libero: 10 SMS richiede al giorno, solo i modelli base.",
        b: "Il filtro maturo è acceso per impostazione predefinita. Spegnerlo ha bisogno di Pro.",
        c: "Solo la linea Venice: nessun modello uncensored.ai, nessun modello da parte dei provider Venice non ospita.",
      },
      usPros: {
        a: "Modelli non censurati di Venice più modelli incensati di NanoGPT, uncensored.ai, FreedomGPT e Gab AI in un unico modello.",
        b: "Nessun filtro maturo per acquistare la vostra via d'uscita: una volta 18+ conferma sblocca ogni modello non censurato, anche sul livello libero.",
        c: "{{guestCredits}} crediti gratuiti un mese senza un account, e l'intera piattaforma è open source.",
      },
      usCons: {
        a: "Sui modelli propri di Venice costamo di più: il nostro markup {{markup}} % si trova sopra il prezzo di Venice.",
        b: "Catalogo più piccolo di Venice complessivo.",
        c: "Le chat private vengono memorizzate sui nostri server. Solo le chat incognito rimangono nel tuo browser, mentre Venice mantiene tutta la storia locale.",
      },
      chooseThem: {
        a: "Si desidera il più grande catalogo non censurato da un unico fornitore.",
        b: "Si tiene o vuole puntare VVV per il credito API.",
        c: "Chiamate i modelli Venice tramite API e ogni centesimo per token.",
      },
      chooseUs: {
        a: "Si desidera che i modelli Venice non porti, come {{ownModel}}, nella stessa chat.",
        b: "Si desidera non censurato senza pagare per un piano per rimuovere un filtro.",
        c: "Si desidera open source, software self-hostable e un saldo per chat, immagini, video e musica.",
      },
      both: "Usare entrambi è normale. Venice per il suo catalogo, {{appName}} quando si desidera confrontare la risposta di Venice contro il modello non censurato di un altro provider nello stesso thread.",
      switch: {
        title: "Interruttore da Venice",
        body: "Nulla da migrare per i modelli: Venice Uncensored e gli altri modelli Venice sono nel nostro raccoglitore sotto gli stessi nomi. Avviare una chat incognito, scegliere un modello Venice, e continuare dove hai lasciato. Incolla il vecchio contesto nel primo messaggio se ne hai bisogno.",
      },
      faq: {
        q1: {
          q: "{{appName}} è lo stesso di Venice?",
          a: "No. Siamo una piattaforma open source separata. Alcuni dei nostri modelli funzionano su Venice API, altri provengono da NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter e i grandi laboratori.",
        },
        q2: {
          q: "Venice AI è gratuito?",
          a: "Venice ha un livello libero con 10 testo e 15 immagini richiede al giorno sui modelli base. Pro rimuove i limiti e consente di spegnere il filtro maturo.",
        },
        q3: {
          q: "Venice è più economico di {{appName}}?",
          a: "Per i modelli propri di Venice, sì: aggiungiamo {{markup}} % ai costi del fornitore. Per la miscelazione di modelli tra i fornitori in un'unica app, ti salviamo abbonamenti separati.",
        },
        q4: {
          q: "Che è più privato, Venice o {{appName}}?",
          a: "Venice mantiene tutta la storia sul tuo dispositivo. Su {{appName}}, le chat incognito fanno lo stesso; le chat private vengono memorizzate sui nostri server in modo da sincronizzare tra i dispositivi. Su entrambi, il tuo messaggio va a un fornitore di modelli per ottenere una risposta.",
        },
      },
      cta: { title: "Prova i modelli di Venice accanto a tutto il resto" },
    },
    characterAi: {
      meta: {
        title: "Alternativa AI senza filtro: {{appName}} vs Carattere. AI",
        description:
          "{{appName}} vs Character. AI: filtri, controlli di età, modelli, privacy e prezzo. Quando il carattere. AI è la chiamata giusta, e quando avete bisogno di un'alternativa non censurata.",
        keywords:
          "Carattere AI alternativa, Carattere AI alternativa senza filtro, carattere.AI filtro, c.ai+ prezzo, Carattere AI NSFW, Carattere AI verifica dell'età, carattere non censurato AI, AI gioco di ruolo senza filtro, {{appName}} vs Carattere.AI",
      },
      hero: {
        title: "{{appName}} vs Character. AI: l'alternativa senza filtro",
        subtitle:
          "La più grande piattaforma di chat di carattere contro uno aperto, non censurato. Ciò che ciascuno permette, che cosa ogni costo, dove le vostre chat vanno.",
        readTime: "7 min lettura",
      },
      intro: {
        lead: "Carattere. AI ha la più grande libreria di caratteri su internet e un filtro che non si muoverà. Il suo centro di aiuto dice che il contenuto pornografico non sarà supportato in qualsiasi momento del futuro. Se questo è un truffatore, avete bisogno di una piattaforma diversa, non un jailbreak.",
        p2: "Carattere. AI fatti dal suo abbonamento, centro di assistenza e pagine di privacy, controllato {{date}}. Il nostro legge dal vivo dalla nostra configurazione.",
      },
      relation:
        "Nessun rapporto commerciale con Character. AI. È possibile portare un personaggio sopra: incollare il suo carattere. AI link e {{appName}} importa come una abilità.",
      verdict:
        "AI per il divertimento sicuro-per-lavoro con milioni di personaggi pronti, liberi e illimitati, o per chiunque abbia meno di 18 anni. Scegliere {{appName}} se il filtro continua a rompere la tua storia: modelli di gioco di ruolo non censurati dopo una volta 18+ conferma, scelta del modello per messaggio e chat che non sono utilizzati per formare i modelli di nessuno.",
      themPros: {
        a: "Milioni di personaggi della comunità, pronti a chattare.",
        b: "Messaggi gratuiti illimitati, a buon mercato tiers pagato.",
        c: "Chiamate vocali con caratteri.",
      },
      themCons: {
        a: "Nessun contenuto adulto, mai e scene scure si ammorbidiscono.",
        b: "La sua politica sulla privacy consente la formazione sulle vostre informazioni e annunci personalizzati.",
        c: "Solo i suoi modelli. Nessuna scelta, nessuna chiave.",
      },
      usPros: {
        a: "Modelli non censurati {{uncensored}}, diversi costruiti per il gioco di ruolo. Le scene vanno dove va la storia.",
        b: "Scegli il modello per messaggio: un modello di gioco di ruolo non censurato per la scena, un modello di frontiera per la pianificazione.",
        c: "Incognito chat soggiorno nel tuo browser. Non formiamo modelli sulle vostre chat.",
      },
      usCons: {
        a: "Molto meno personaggi pronti. Importa o scrivi da solo.",
        b: "Crediti misurati invece di messaggi gratuiti illimitati.",
        c: "Nessuna chiamata vocale con i personaggi.",
      },
      chooseThem: {
        a: "Si desidera chat di sicuro per il lavoro con una libreria di caratteri gigante.",
        b: "Hai meno di 18 anni o hai creato un conto da adolescente.",
        c: "Si desidera messaggi liberi illimitati e non pensare mai a costo.",
      },
      chooseUs: {
        a: "Il filtro continua a rompere il tuo gioco di ruolo.",
        b: "Vuoi scegliere il modello, non prenderne uno assegnato.",
        c: "Vuoi che le tue chat siano mantenute fuori dall'allenamento e dal targeting pubblicitario.",
      },
      both: "AI per chat di luce e spostare le storie che hanno bisogno di un modello adulto qui, utilizzando l'importazione per portare il personaggio lungo.",
      switch: {
        title: "Trasferire un personaggio da Carattere. AI",
        body: "Copia il carattere del personaggio. AI link, incollalo nell'importazione di abilità su {{appName}}, e il nome, il saluto e la definizione vengono sopra dove il personaggio li rende pubblici. Quindi scegliere un modello di gioco di ruolo non censurato e continuare la storia.",
      },
      faq: {
        q1: {
          q: "Il carattere. AI permette NSFW?",
          a: "No. Il suo centro d'aiuto dice che il contenuto pornografico è contro i suoi termini e non sarà supportato in qualsiasi punto del futuro.",
        },
        q2: {
          q: "Il carattere. AI richiede la verifica dell'età?",
          a: "Si'. Gli utenti passano attraverso l'assicurazione dell'età con Persona. Gli utenti verificati come sotto 18 ottenere solo la modalità di lettura, senza chat.",
        },
        q3: {
          q: "{{appName}} è un carattere. AI alternativa senza un filtro?",
          a: "Sì per gli adulti. Modelli non censurati sbloccano dopo una sola volta 18+ conferma, e diversi sono costruiti per il gioco di ruolo. I modelli Mainstream mantengono i filtri dei loro fornitori, quindi scegliete uno non censurato per scene adulte.",
        },
        q4: {
          q: "Posso importare il mio carattere. caratteri AI?",
          a: "Sì: incollare il link del personaggio nell'importazione di abilità. Ciò che viene sopra dipende da ciò che il creatore ha reso pubblico su Character. AI.",
        },
      },
      cta: { title: "Continuare la storia senza il filtro" },
    },
    janitorAi: {
      meta: {
        title: "Janitor AI Alternative: {{appName}} vs Janitor AI (2026)",
        description:
          "{{appName}} vs Janitor AI: modelli JLLM vs {{modelCount}}, limiti di contesto, regole NSFW, proxy, privacy e prezzo. Pro e contro onnipresenti per il gioco di ruolo.",
        keywords:
          "Janitor AI alternativa, Janitor AI vs, JanitorAI, janitor+ prezzo, JLLM# Janitor # AI procura, Janitor AI OpenRouter# Janitor # AI limite di contesto, NSFW AI gioco di ruolo, gioco di ruolo non censurato AI, {{appName}} vs Janitor AI",
      },
      hero: {
        title: "{{appName}} vs Janitor AI",
        subtitle:
          "La più grande comunità di giochi di ruolo libero contro una chat multi-model non censurata. Modelli, memoria, regole, prezzo.",
        readTime: "6 minuti di lettura",
      },
      intro: {
        lead: "Janitor AI ha vinto un gioco di ruolo su due cose: milioni di bot comunitari e un modello gratuito. La cattura si presenta in lunghe storie. Il contesto libero si trova intorno ai token 9K, e i modelli migliori significano impostare un proxy con la propria chiave.",
        p2: "Janitor AI fatti dalla sua pagina janitor+, centro di aiuto e politiche, controllato {{date}}. Il nostro legge dal vivo dalla nostra configurazione.",
      },
      relation:
        "Nessun rapporto commerciale con Janitor AI. Forme diverse: Janitor è una libreria di caratteri con un modello libero, siamo una libreria modello con personaggi.",
      verdict:
        "Scegliere Janitor AI per la libreria bot e chat illimitata gratuita su JLLM. Scegliere {{appName}} se si desidera forti modelli non censurati con un lungo contesto pronto ad andare, nessuna configurazione proxy e immagini, video e voce nella stessa chat.",
      themPros: {
        a: "Milioni di bot comunitari, con tag Limitless per NSFW.",
        b: "chat illimitata gratuita sul proprio modello.",
        c: "Portare il proprio modello attraverso un proxy, OpenRouter incluso.",
      },
      themCons: {
        a: "Circa 9K gettoni di contesto libero: lunghe campagne dimenticare.",
        b: "I modelli migliori hanno bisogno di janitor+ Router o la vostra chiave API e configurazione proxy.",
        c: "Solo testo, e l'app mobile inizia in modalità provvisoria.",
      },
      usPros: {
        a: "Modelli {{modelCount}} nel raccoglitore, {{uncensored}} non censurato, nessun proxy o chiave da configurare.",
        b: "Modelli non censurati a lungo termine per campagne che si svolgono per settimane.",
        c: "Immagini, video, musica e voce dalla stessa chat ed saldo.",
      },
      usCons: {
        a: "Una minuscola biblioteca di personaggi accanto a quella di Janitor.",
        b: "Nessun livello illimitato libero: {{guestCredits}} crediti gratuiti al mese, poi un piano.",
        c: "Meno di una comunità: nessun feed bot pubblico.",
      },
      chooseThem: {
        a: "Vuoi sfogliare migliaia di bot pronti.",
        b: "Si desidera chat illimitata gratuita e il modello gratuito è abbastanza buono.",
        c: "Si esegue già la propria chiave attraverso un proxy e come esso.",
      },
      chooseUs: {
        a: "Le storie lunghe hanno bisogno di un contesto lungo e di un forte modello non censurato.",
        b: "Si desidera cambiare modelli mid-scene senza toccare le impostazioni del proxy.",
        c: "Vuoi immagini o voci per i tuoi personaggi nello stesso posto.",
      },
      both: "Configurazione comune: scopri i personaggi su Janitor AI, esegui le lunghe campagne su {{appName}}.",
      switch: {
        title: "Trasferirsi da Janitor AI",
        body: "Creare una abilità su {{appName}} con la personalità del tuo personaggio, scenario e saluto, quindi scegliere un modello di gioco di ruolo non censurato. Incognito chats non hanno bisogno di un account, in modo da poter testare una scena prima di iscriversi.",
      },
      faq: {
        q1: {
          q: "Janitor AI è gratuito?",
          a: "Sì: chat illimitata sul proprio modello con circa 9K token di contesto. janitor+ aggiunge più memoria, velocità e modelli.",
        },
        q2: {
          q: "Janitor AI permette a NSFW?",
          a: "Sì per gli adulti sui bot taggati Limitless, sul web. L'app mobile inizia in modalità provvisoria fino a quando non si abilita NSFW nelle impostazioni web.",
        },
        q3: {
          q: "Ho bisogno di un proxy su {{appName}}?",
          a: "No. Ogni modello e' nel raccoglitore. Paghi i crediti per messaggio, non è necessario alcun tasto API.",
        },
        q4: {
          q: "Che ha una memoria migliore per un lungo gioco di ruolo?",
          a: "Il modello gratuito di Janitor ha circa 9K gettoni di contesto; janitor+ alza la memoria del personaggio. Su {{appName}}, il contesto dipende dal modello scelto, e molti modelli di gioco di ruolo sono molto più.",
        },
      },
      cta: {
        title:
          "Esegui la tua prossima campagna su un modello a lungo contenuto",
      },
    },
    nanoGpt: {
      meta: {
        title: "{{appName}} vs NanoGPT: Confronto onesto 2026",
        description:
          "{{appName}} vs NanoGPT: pay-as-you-go vs piani, modelli non censurati e abliterati, privacy, API e media. Compriamo da NanoGPT e diciamo dove vince.",
        keywords:
          "NanoGPT alternativa, NanoGPT vs, recensione nano-gpt, NanoGPT pricing, NanoGPT PRO, NanoGPT non censurato, modelli abliterati API, pagare come si va AI, non censurato AI API, {{appName}} vs NanoGPT",
      },
      hero: {
        title: "{{appName}} vs NanoGPT",
        subtitle:
          "Due piattaforme multi-model con modelli non censurati e una API. Un pay-as-you-go, un piano basato. Uno vende all'altro.",
        readTime: "6 minuti di lettura",
      },
      intro: {
        lead: "NanoGPT è l’alternativa agli abbonamenti IA con pagamento a consumo. Ricarichi dieci centesimi e puoi usare qualsiasi modello senza account. Diversi nostri modelli senza censura funzionano sulla sua API. Scegli in base a come usi l’IA.",
        p2: "NanoGPT fatti dalle sue pagine di prezzi, privacy e termini e la sua lista modello pubblico, controllato {{date}}. Il nostro legge dal vivo dalla nostra configurazione.",
      },
      relation:
        "Siamo un cliente NanoGPT: {{nanoGptModels}} dei nostri modelli attraversa lo API di NanoGPT ({{nanoGptUncensored}} di loro non censurato), incluso {{nanoGptExamples}}.",
      verdict:
        "Scegli NanoGPT per il catalogo più ampio a prezzi di listino, pay-per-use senza account e un API per tutto. Scegliere {{appName}} se si desidera un selezionatore modello curato e testato con modelli non censurati da diversi fornitori, crediti mensili gratuiti, competenze e memoria, e un'applicazione open-source è possibile self-host.",
      themPros: {
        a: "631 modelli di testo nel suo API, circa 39 non censurati o abliterati.",
        b: "Nessun account, nessun abbonamento: inizia da dieci centesimi in cripto.",
        c: "Elenca i prezzi su modelli auto-roto, più economico di qualsiasi intermediario.",
      },
      themCons: {
        a: "Free tier è un modello sul web.",
        b: "La privacy dipende dalla via del fornitore; alcuni percorsi consentono la formazione.",
        c: "Un catalogo grande significa che fai il test da solo.",
      },
      usPros: {
        a: "Un raccoglitore curato: ogni modello contrassegnato mainstream, aperto o non censurato, con una pagina e un prezzo live.",
        b: "{{guestCredits}} crediti gratuiti al mese, abbastanza da provare modelli non censurati sui propri suggerimenti.",
        c: "Competenze, memoria, cartelle e una chat costruita per il lavoro lungo, open source e self-hostable.",
      },
      usCons: {
        a: "Meno modelli di NanoGPT.",
        b: "Aggiungiamo {{markup}} % ai costi del fornitore, quindi lo stesso modello costa di più qui.",
        c: "Serve un piano attivo per ricaricare con pacchetti di crediti.",
      },
      chooseThem: {
        a: "Si desidera pagare per l'uso senza abbonamento e senza account.",
        b: "Hai bisogno di un modello oscuro solo un enorme catalogo porta.",
        c: "Si costruisce sulla API e desidera prezzi di liste.",
      },
      chooseUs: {
        a: "Si desidera una lista breve testata invece di 631 opzioni.",
        b: "Si desidera crediti mensili gratuiti e una chat lucida con competenze e memoria.",
        c: "Vuoi il modello di uncensored.ai e i modelli di Venice accanto a NanoGPT in un unico thread.",
      },
      both: "Gli sviluppatori spesso usano lo API di NanoGPT per lavori in batch e {{appName}} come loro chat quotidiana.",
      switch: {
        title: "Interruttore da NanoGPT",
        body: "I modelli NanoGPT-servati nel nostro picker, come {{nanoGptExamples}}, sono gli stessi modelli. Avviare una chat incognito, scegliere uno e confrontare le risposte con un modello da un altro provider nello stesso thread.",
      },
      faq: {
        q1: {
          q: "NanoGPT è più economico di {{appName}}?",
          a: "Per token, di solito sì: i prezzi della lista delle spese di NanoGPT e aggiungiamo {{markup}} %. Offriamo crediti gratuiti {{guestCredits}} al mese e un'applicazione per ogni fornitore.",
        },
        q2: {
          q: "NanoGPT ha bisogno di un account?",
          a: "No. Funziona con un utente generato ID e mantiene le chat nel tuo browser per impostazione predefinita.",
        },
        q3: {
          q: "Entrambi hanno uno API?",
          a: "Si'. La API di NanoGPT è OpenAI e Anthropic compatibile con i pagamenti senza account. Il nostro è OpenAI e Anthropic compatibile e si sblocca dopo un piano o un acquisto di credito.",
        },
        q4: {
          q: "Che ha modelli più incensori?",
          a: "{{appName}} ha {{uncensored}}, scelto e testato, da NanoGPT, Venice, uncensored.ai, FreedomGPT e Gab AI.",
        },
      },
      cta: { title: "Confronta i modelli di NanoGPT con tutti gli altri" },
    },
    freedomGpt: {
      meta: {
        title: "FreedomGPT Alternative: {{appName}} vs FreedomGPT (2026)",
        description:
          "{{appName}} vs FreedomGPT: Modelli Liberty e censor-free, regole di contenuti, privacy, crediti, API e open source. Fatti con le fonti, entrambi i lati.",
        keywords:
          "FreedomGPT alternativa, FreedomGPT vs, FreedomGPT review, FreedomGPT pricing, FreedomGPT Pro, Liberty model, FreedomGPT uncensored, censor-free AI, non censurato ChatGPT alternativa, {{appName}} vs FreedomGPT",
      },
      hero: {
        title: "{{appName}} vs FreedomGPT",
        subtitle:
          "Due app che mettono modelli senza censura accanto a ChatGPT, Claude e Gemini. Regole, privacy, crediti, open source.",
        readTime: "6 minuti di lettura",
      },
      intro: {
        lead: "FreedomGPT e {{appName}} condividono un'idea: modelli mainstream e non censurati in una lista. Le differenze sono nelle regole, i crediti e ciò che accade ai tuoi messaggi.",
        p2: "FreedomGPT fatti dalla sua homepage, prezzi, politica sulla privacy, documenti e GitHub, controllato {{date}}. Il nostro legge dal vivo dalla nostra configurazione.",
      },
      relation:
        "Siamo un cliente FreedomGPT: {{freedomGptExamples}} corre su {{appName}} attraverso il proprio API di FreedomGPT.",
      verdict:
        "Scegli FreedomGPT per un piano di $20 che copre chat, immagini e video con un inizio gratuito e nessun account. Scegliere {{appName}} se si desidera più modelli non censurati da diversi fornitori, nessuna clausola di uso etico in cima alla legge, i prezzi pubblicati per-model e una piattaforma open source che è attivamente sviluppato.",
      themPros: {
        a: "Gratuito senza carta o account.",
        b: "Liberty e altri modelli senza censura accanto a ChatGPT, Claude e Gemini.",
        c: "Immagine e generazione video nello stesso piano.",
      },
      themCons: {
        a: "I modelli devono seguire la legge US e non possono essere utilizzati per scopi non etici, secondo le sue regole.",
        b: "I messaggi, la voce e le immagini vanno a fornitori di terze parti; nessun periodo di conservazione indicato.",
        c: "L'applicazione desktop open-source non è stata aggiornata dal giugno 2024.",
      },
      usPros: {
        a: "Modelli non censurati {{uncensored}} da cinque fornitori, Liberty incluso.",
        b: "Ogni modello ha una pagina pubblica con il suo prezzo live per messaggio.",
        c: "Tutta la piattaforma è open source e attivamente sviluppata. Datti da fare.",
      },
      usCons: {
        a: "Nessun piano all-in: i crediti sono misurati per modello.",
        b: "Account necessario per la memoria e le chat sincronizzate.",
        c: "Il nostro markup {{markup}} % si applica anche ai modelli di FreedomGPT-served.",
      },
      chooseThem: {
        a: "Si desidera un semplice piano $20 per chat, immagini e video.",
        b: "Hai solo bisogno di Liberty e dei modelli mainstream.",
        c: "Si desidera un app desktop offline e la versione 2024 è a posto.",
      },
      chooseUs: {
        a: "Vuoi una scelta più incensata: Venice, NanoGPT, uncensored.ai e Gab modelli troppo.",
        b: "Si desidera vedere il prezzo per messaggio prima di inviarlo.",
        c: "Si desidera il software open-source attuale e auto-hostable.",
      },
      both: "FreedomGPT's Liberty è nel nostro picker, in modo da poter testare contro altri modelli non censurati senza un secondo abbonamento.",
      switch: {
        title: "Passare da FreedomGPT",
        body: "Scegli Liberty nel nostro modello picker e continua. Quindi provare lo stesso prompt su {{ownModel}} o un modello abliterato e mantenere qualsiasi risposta migliore.",
      },
      faq: {
        q1: {
          q: "FreedomGPT è davvero senza censura?",
          a: "I suoi modelli privi di censura lasciano cadere la maggior parte dei rifiuti, ma FreedomGPT dice che ogni modello che ospita deve seguire la legge US e non può essere utilizzato per scopi non etici, e un'etichetta censore-free non garantisce che ogni richiesta sia soddisfatta.",
        },
        q2: {
          q: "Quanto costa FreedomGPT?",
          a: "È libero di iniziare. Pro include 2.200 crediti al mese; una risposta premium costa circa 10, un'immagine circa 25 e un video di 5 secondi circa 400.",
        },
        q3: {
          q: "FreedomGPT è open source?",
          a: "La sua vecchia app desktop per i modelli offline è open source (GPL-3.0) su GitHub, aggiornata l'ultima volta nel giugno 2024. L'app cloud non lo è. {{appName}} è open source nel suo complesso.",
        },
        q4: {
          q: "Posso usare il modello Liberty di FreedomGPT su {{appName}}?",
          a: "Si'. Attraversa lo API di FreedomGPT e siede nel nostro raccoglitore accanto agli altri modelli non censurati.",
        },
      },
      cta: { title: "Confronta Liberty con gli altri modelli senza censura" },
    },
  },
};
