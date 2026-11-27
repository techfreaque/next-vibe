import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a OpenRouter senza censura, a confronto | {{appName}}",
    description:
      "OpenRouter non elenca modelli abliterated. Confronta OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice, Featherless e {{appName}} per modelli senza censura, commissioni, privacy e formati API.",
    category: "Guida per sviluppatori",
    imageAlt:
      "Alternative a OpenRouter senza censura per sviluppatori, a confronto",
    keywords:
      "alternativa a OpenRouter senza censura, alternativa a OpenRouter, alternative a OpenRouter, modelli senza censura OpenRouter, API modelli abliterated, API LLM senza censura, OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, Featherless, OpenRouter contro NanoGPT, siti come OpenRouter, gateway API LLM, API compatibile OpenAI, API compatibile Anthropic, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida per sviluppatori",
    readTime: "11 min di lettura",
    title: "Alternative a OpenRouter senza censura",
    subtitle:
      "{{count}} alternative e {{appName}} a confronto su copertura senza censura, formati API e commissioni. Verificato il {{date}}.",
  },
  intro: {
    lead: "OpenRouter mette 477 modelli dietro una sola chiave. Per il lavoro senza censura lo scaffale è povero: 17 tune per il roleplay o senza censura, e nemmeno un modello abliterated.",
    p2: "Così abbiamo verificato host API senza censura, host a tariffa fissa per il roleplay, gateway e app su documentazione, prezzi ed elenchi di modelli ufficiali. Anche noi compriamo accesso ai modelli da OpenRouter: {{openRouterModels}} dei nostri modelli passano da lì.",
  },
  shelf: {
    title: "Cosa offre OpenRouter per il lavoro senza censura",
    intro:
      "Dal suo elenco pubblico di modelli e dai suoi termini, letti il {{orDate}}.",
    tunes:
      "17 modelli su 477 corrispondono a roleplay o senza censura per nome o descrizione: Venice Uncensored (un tune di Dolphin Mistral 24B), Hermes 4 405B, Cydonia, Skyfall, Magnum v4 72B, Euryale, MythoMax e una manciata di modelli Aion RP.",
    abliterated:
      "Nessun ID di modello contiene abliterated o uncensored. Le versioni abliterated di GLM 5.3, DeepSeek V4.1 Flash e Kimi K3.1 Pro vendute dai router senza censura qui non ci sono.",
    rules:
      "Regole: 18+, controllo automatico per CSAM, per il resto valgono i termini di ciascun modello. I modelli standard continuano a rifiutare ciò che rifiutano i loro produttori.",
    callout:
      "Ti servono pesi abliterated? OpenRouter è il router sbagliato. Ti servono fine-tune per il roleplay? Ha uno scaffale discreto.",
  },
  apis: {
    title: "Alternative API senza censura, una per una",
    intro:
      "Servizi nati per l'API che vendono pesi abliterated o senza censura. Dalle loro pagine, lette il {{marketDate}}.",
    visit: "Visita {{name}}",
    openUncensored: {
      heading: "OpenUncensored: un router solo per modelli senza censura",
      body: "58 modelli di testo, 20 di immagini e 3 di video, quasi tutti abliterated, instradati verso Venice, NanoGPT, Refuseless e altri. Nessuna commissione sui prezzi dei provider, ricariche da 5 USD che non scadono mai e nessun account: la tua chiave API è l'account. OpenAI, Responses e Anthropic Messages su un solo base URL.",
      catch:
        "Il limite: nessun piano gratuito, nessuna chat web (solo un'app desktop) e metadati delle richieste conservati fino a due anni.",
    },
    refuseless: {
      heading:
        "Refuseless: le versioni abliterated più economiche che abbiamo trovato",
      body: "GLM 5.3, GLM 5.3 Flash, DeepSeek V4.1 Flash e Kimi K3.1 Pro abliterated con contesto da 1M. DeepSeek V4.1 Flash abliterated costa 0,12 USD in input e 0,45 USD in output per milione di token. Chat completions, Responses e Anthropic Messages, Claude Code incluso.",
      catch:
        "Il limite: solo API, serve un'email verificata e le sue pagine di prezzi, privacy e termini hanno bloccato il nostro lettore.",
    },
    nearAi: {
      heading: "NEAR AI Cloud: modelli abliterated in confidential compute",
      body: "Attestazione hardware, quindi né NEAR né l'host cloud possono leggere i tuoi prompt, dice il servizio. Due modelli abliterated: Qwen 3.8 27B a 0,04 USD in input e 1,35 USD in output per milione di token, e DeepSeek V4.1 Flash 1017. Nessuna richiesta di accesso, nessun controllo dell'identità, si paga per token.",
      catch:
        "Il limite: solo formato OpenAI e uno scaffale senza censura minuscolo.",
    },
    uncensoredLlmAi: {
      heading: "UncensoredLLM.ai: il catalogo senza censura più grande",
      body: "332 modelli di chat più 13 modelli di immagini e video, con un controllo giornaliero dei rifiuti. Formati OpenAI, Anthropic e Gemini su una sola chiave prepagata. Carta o cripto da 3 USD, e il saldo non scade mai.",
      catch:
        "Il limite: vietata la rivendita o una API ri-fatturata senza permesso scritto. Nelle pagine che abbiamo letto non c'erano termini sulla privacy.",
    },
    abliterationAi: {
      heading:
        "abliteration.ai: modelli abliterated propri, privacy per iscritto",
      body: "Modelli abliterated propri nei formati OpenAI e Anthropic. Dichiara che prompt e output vengono elaborati in memoria, mai salvati di default e mai usati per l'addestramento. Opzione regione UE, più un gateway di policy per le tue regole.",
      catch:
        "Il limite: costa più di Refuseless o NEAR AI per pesi simili e i modelli di base non vengono nominati.",
    },
    flatRate: {
      heading:
        "Featherless, Infermatic, Arli AI: tariffa fissa per il roleplay intensivo",
      body: "Featherless elenca oltre 50.000 modelli Hugging Face, 1.398 etichettati abliterated, con un piano Chat a tariffa fissa da 25 USD. Infermatic vende tune 70B curati per il roleplay da 9 USD al mese. Arli AI offre piani con token illimitati da 15 USD con fine-tune derestricted. Tutti e tre dichiarano di non conservare log dei prompt.",
      catch:
        "Il limite: i piani personali non possono alimentare app e hai da 1 a 6 richieste in parallelo.",
    },
    deepInfra: {
      heading: "DeepInfra: modelli standard economici, nessuno senza censura",
      body: "Tra i più economici a token per i modelli open standard: DeepSeek V4.1 Flash a 0,14 USD in input e 0,42 USD in output per milione di token, 200 richieste simultanee per modello. Dichiara che gli input API non vengono mai salvati su disco.",
      catch:
        "Il limite: nel catalogo non ci sono modelli senza censura né per il roleplay.",
    },
  },
  gateways: {
    title: "Se ti serve solo un router",
    intro:
      "I gateway instradano verso i provider che configuri tu. Nessuno aggiunge modelli senza censura.",
    vercel:
      "Vercel AI Gateway: in hosting, prezzo del provider per token senza ricarico, pensato per l'AI SDK.",
    selfHost:
      "LiteLLM o Bifrost: open source, in self-hosting, con le tue chiavi dei provider, budget e fallback.",
    control:
      "Portkey, Cloudflare AI Gateway, Helicone: guardrail, caching, log delle richieste e controlli di spesa in più.",
  },
  criteria: {
    title: "Cosa confrontare prima di cambiare",
    intro: "Decidono sei domande.",
    catalog:
      "Catalogo: quanti modelli, da quanti laboratori, e ci sono quelli che usi oggi?",
    uncensored:
      "Modelli senza censura: quanti hanno i rifiuti rimossi, e di che tipo?",
    formats:
      "Formati: solo OpenAI chat completions, o anche la Responses API e la Anthropic Messages API usate dagli agenti di coding?",
    billing:
      "Fatturazione: prezzo di listino più commissione, un ricarico o un abbonamento? E cosa succede a saldo zero?",
    data: "Dati: i prompt vengono salvati, registrati o usati per l'addestramento, ed è opt-in?",
    chat: "Chat: chi non scrive codice può usare gli stessi modelli nel browser?",
  },
  table: {
    title: "Tutte a confronto",
  },
  us: {
    title: "{{appName}}: una chiave, ogni tipo di modello",
    intro:
      "{{modelCount}} modelli di chat dietro una chiave, {{uncensored}} dei quali senza censura.",
    models:
      "Modelli: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM e Qwen accanto a {{uncensored}} modelli senza censura. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, e per questo ha opinioni politiche controcorrente.",
    formats:
      "Formati: OpenAI chat completions, OpenAI Responses API e Anthropic Messages API. Qualsiasi SDK o agente di coding punta a un solo base URL.",
    billing:
      "Fatturazione: un unico saldo di crediti, il nostro ricarico del {{markup}}% su quello che paghiamo. Il primo acquisto sblocca le chiavi API, i piani partono da {{apiSubPrice}} al mese.",
    chat: "Chat: gli stessi modelli in una chat web con cartelle, strumenti e generazione di immagini, video e musica. Anche chi nel team non programma ha accesso ai modelli.",
    openRouter:
      "OpenRouter incluso: {{openRouterModels}} dei nostri modelli passano da OpenRouter. Stessi modelli, un unico account con quelli senza censura.",
    weak: "Dove siamo più deboli: OpenRouter non applica alcun ricarico sull'inferenza, solo una commissione del 5,5% sull'acquisto di crediti. Noi aggiungiamo il {{markup}}% a ciò che paghiamo. Lui ti lascia usare le tue chiavi dei provider, instradare solo verso endpoint a zero conservazione dei dati e scegliere i provider per ogni richiesta. Noi non abbiamo nulla di tutto questo. E i router abliterated qui sopra costano meno di noi su ogni modello che abbiamo in comune.",
    codeLabel: "Spostare un client OpenAI SDK: cambia base URL e chiave",
    docsLink: "Documentazione API: endpoint, autenticazione e limiti",
    formatsLink: "API compatibile con OpenAI e Anthropic, spiegata",
    toolsLink: "Una chiave in Claude Code, Codex CLI, Aider e altri",
  },
  models: {
    title: "{{apiUncensored}} modelli senza censura che puoi chiamare oggi",
    intro:
      "Ogni modello senza censura dell'API, con l'ID da passare come model. Dal più economico.",
    colModel: "Modello",
    colId: "ID API",
    colContext: "Contesto",
    colPrice: "A messaggio",
    footnote:
      "Prezzo di un messaggio di riferimento, incluso il nostro ricarico del {{markup}}%. L'etichetta sotto ogni nome dice come è nato il modello.",
  },
  list: {
    title: "App con un'API senza censura, una per una",
    intro:
      "Dalle loro pagine, verificato il {{date}}. Cos'è ognuna, come funziona la sua API, quali modelli ha e quanto costa.",
    heading: "{{number}}. {{name}}: {{kind}}",
    api: "API:",
    models: "Modelli:",
    price: "Prezzo:",
    priceValue: "Gratis: {{free}}. A pagamento: {{plans}}.",
    pro: "Il meglio:",
    con: "Il limite:",
    forWho: "Sceglila se:",
    versusLink: "{{appName}} contro {{name}}: il confronto completo",
    visit: "Visita {{name}}",
  },
  stay: {
    title: "Quando OpenRouter resta la scelta giusta",
    intro: "A volte l'originale è lo strumento migliore.",
    rare: "Ti serve un modello di nicchia o un provider specifico che nessun altro in questa lista offre.",
    callout:
      "Molti team ne usano due: OpenRouter per la coda lunga e una seconda chiave per i modelli senza censura e per una chat aperta a tutto il team.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore alternativa a OpenRouter?",
      a: "Dipende da cosa ti manca in OpenRouter. Pesi abliterated a prezzo del provider: OpenUncensored, Refuseless o NEAR AI Cloud. Il catalogo senza censura più grande: UncensoredLLM.ai o Featherless. Pagamento a consumo in cripto: NanoGPT. I modelli di Venice e le sue modalità di privacy: Venice. In locale e gratis: Ollama. Modelli senza censura, aperti e mainstream più media e una chat di team con una sola chiave: {{appName}}.",
    },
    cheaper: {
      q: "Esiste un'alternativa più economica a OpenRouter?",
      a: "Confronta il prezzo per modello, non la commissione. OpenRouter non aggiunge ricarichi sull'inferenza, OpenUncensored non prende commissioni, e Refuseless e NEAR AI Cloud elencano le versioni abliterated più economiche che abbiamo trovato. Su {{appName}} paghi quello che paghiamo noi più un ricarico del {{markup}}%, e ogni pagina modello mostra il prezzo per messaggio.",
    },
    uncensored: {
      q: "Quale alternativa a OpenRouter ha modelli senza censura?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, NanoGPT, Venice, uncensored.ai, Gab AI e {{appName}} offrono tutti modelli senza censura via API. {{appName}} ne ha {{apiUncensored}} sulla sua API in questo momento, abliterated e affinati accanto a {{ownModel}}.",
    },
    sdk: {
      q: "Posso tenere il mio codice OpenAI SDK?",
      a: "Sì. Cambi base URL e chiave API, il resto resta. Gli ID dei modelli cambiano da gateway a gateway, quindi sostituisci anche quelli. Esempio: {{example}}.",
    },
    anthropic: {
      q: "Funziona con gli SDK Anthropic e gli agenti di coding?",
      a: "Su {{appName}} sì: la Anthropic Messages API gira accanto ai formati OpenAI, quindi Claude Code e altri agenti si collegano con una sola chiave, modelli senza censura inclusi. Parlano Anthropic Messages anche OpenUncensored, Refuseless, NanoGPT e UncensoredLLM.ai. Venice non ha un endpoint nativo e manda Claude Code su un proxy locale.",
    },
    free: {
      q: "Esiste un'alternativa gratuita a OpenRouter?",
      a: "Ollama è gratis se il tuo hardware regge il modello. OpenRouter stesso ha 11 modelli gratuiti con limiti giornalieri, e Infermatic ha un piano web gratuito. {{appName}} regala crediti di chat ogni mese, e l'API si sblocca con il primo acquisto.",
    },
    apiLink: "API LLM senza censura: ID dei modelli, codice e limiti",
    veniceLink: "Alternative a Venice AI a confronto",
    nanoGptLink: "Alternative a NanoGPT, a confronto",
    keysLink: "Gestisci le tue chiavi API",
  },
  cta: {
    title: "Una chiave. Ogni modello. Meno rifiuti.",
    subtitle:
      "Prova prima i modelli in chat: {{guestCredits}} crediti gratuiti al mese, senza account.",
    start: "Prova un modello senza censura",
    docs: "Leggi la documentazione API",
  },
};
