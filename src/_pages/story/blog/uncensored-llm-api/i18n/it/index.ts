import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "API LLM senza censura: modelli abliterated | {{appName}}",
    description:
      "Modelli senza censura e abliterated su un'unica API compatibile OpenAI e Anthropic. ID, prezzi a confronto, cosa permettono Vertex, Azure e Bedrock, codice.",
    category: "Guida per sviluppatori",
    imageAlt: "API LLM senza censura con endpoint compatibili OpenAI",
    keywords:
      "API LLM senza censura, API IA senza censura, API modelli abliterated, LLM abliterated API, API LLM senza filtro contenuti, API compatibile OpenAI senza censura, API LLM NSFW, Gemini API safety settings off, Vertex AI senza censura, Together AI senza censura, alternativa senza censura ad Azure OpenAI, alternativa senza censura a Bedrock, modelli abliterated in hosting, alternativa all'API Venice, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida per sviluppatori",
    readTime: "12 min di lettura",
    title: "API LLM senza censura. Il tuo SDK. Niente riflesso di rifiuto.",
    subtitle:
      "{{count}} modelli senza censura dietro una sola chiave compatibile OpenAI e Anthropic. ID, contesto e prezzi letti in tempo reale dal nostro registro.",
  },
  intro: {
    lead: "La tua app ha bisogno di un modello che risponde. Non di uno che fa la predica, né di uno che rifiuta metà dei tuoi prompt di test. Le API mainstream filtrano per scelta, e far girare da te pesi abliterated vuol dire noleggiare GPU.",
    p2: "{{appName}} serve {{count}} modelli senza censura sugli stessi endpoint /v1 di qualsiasi modello mainstream. Cambia la base URL, tieni l'SDK OpenAI o Anthropic, scegli un ID senza censura. Ecco l'elenco, il codice, i prezzi accanto agli altri host, cosa permettono davvero i grandi cloud e il rovescio onesto.",
    access:
      "Subito chiaro: l'API richiede un account a pagamento. Qualsiasi piano, da {{subPrice}} al mese, la sblocca. I crediti gratuiti e bonus no.",
    accessLink: "Sblocca l'API",
  },
  models: {
    title: "{{count}} modelli senza censura nell'API",
    intro:
      "Tutti i modelli di testo senza censura attuali, dal più economico. Usa l'ID esattamente come appare nel campo model.",
    colModel: "Modello",
    colId: "ID modello",
    colContext: "Contesto",
    colTools: "Strumenti",
    colPrice: "Per messaggio",
    yes: "Sì",
    no: "No",
    footnote:
      "Per messaggio è uno scambio di riferimento sulla rotta più economica. L'API fattura a token, e ogni risposta riporta l'importo esatto in usage.credits_charged. GET /v1/models restituisce la stessa lista con i prezzi per token.",
  },
  code: {
    title: "Una richiesta",
    intro:
      "Il modello senza censura più economico al momento è {{example}}. Sostituiscilo con qualsiasi ID della tabella.",
    prompt:
      "Dammi gli argomenti più forti a favore e contro il nucleare. Niente avvertenze.",
    curl: "curl",
    python: "SDK Python di OpenAI",
    anthropic:
      "Preferisci l'SDK Anthropic o Claude Code? Puntali alla stessa base URL senza /v1: chiamano /v1/messages con gli stessi modelli e la stessa chiave.",
  },
  consent: {
    title: "L'unico passaggio 18+",
    intro:
      "I modelli senza censura sono solo per adulti. L'API lo verifica una volta.",
    where:
      "Conferma una volta sola di avere almeno 18 anni, nella pagina delle chiavi API.",
    link: "Apri le chiavi API",
    error:
      "Senza conferma, una richiesta a un modello senza censura restituisce 403 uncensored_consent_required, e non viene addebitato nulla.",
    once: "Dopo, le tue chiavi possono chiamare i modelli senza censura.",
  },
  kinds: {
    title: "Quale modello senza censura per quale lavoro",
    intro: "Nella tabella ci sono tre tipi. Si comportano in modo diverso.",
    abliterated:
      "Abliterated: un modello mainstream o aperto a cui è stato tolto dai pesi il comportamento di rifiuto. Stesso addestramento, stesse conoscenze, stessa visione del mondo. Risponde e basta. La scelta predefinita per la maggior parte delle app.",
    fineTuned:
      "Fine-tuned: un modello aperto addestrato ancora su dati non filtrati. Spesso più libero nel tono, apprezzato per narrativa e gioco di ruolo.",
    own: "{{ownModel}}: addestrato su libri e documenti banditi dall'internet mainstream. Il risultato è un modello con opinioni politiche controcorrente. Sceglilo quando vuoi le posizioni che i modelli mainstream non danno.",
    link: "Abliterated, fine-tuned o visione propria: la spiegazione completa",
  },
  limits: {
    title: "I limiti da conoscere",
    intro: "Gli spigoli duri, prima di andare in produzione.",
    stateless:
      "Senza stato. Da noi non resta nessuna conversazione. Invia la cronologia completa a ogni turno.",
    maxTokens: "L'output è limitato a {{maxTokens}} token per richiesta.",
    rateLimit:
      "Nessun limite fisso di richieste. L'utilizzo viene scalato per chiamata dal tuo saldo di crediti e si applica un'ampia protezione anti-abuso. I 429 dei provider passano con l'header Retry-After.",
    tools:
      "Le chiamate a strumenti funzionano solo sui modelli che le supportano. La tabella dice quali. Altrimenti ricevi 400 tools_not_supported.",
    refusals:
      "Senza censura non vuol dire infallibile. Un modello può ancora rifiutare o sbagliare i fatti. Prova i tuoi prompt su due modelli prima di decidere.",
  },
  privacy: {
    title: "Cosa succede ai tuoi prompt",
    intro: "Teniamo la fattura, non la conversazione.",
    noStore:
      "L'API non crea thread di chat. Registra solo la voce di fatturazione: quale modello, quanti crediti.",
    upstream:
      "Ogni prompt passa da noi al provider che serve il modello. I suoi termini valgono per ciò che riceve. La nostra privacy policy non promette separatamente né assenza di log né assenza di training: giudicaci per ciò che dice davvero.",
    callout:
      "Se i prompt non devono mai uscire dalla tua infrastruttura, fai girare pesi abliterated sul tuo hardware. Per tutto il resto, con l'API vai in produzione prima.",
  },
  abliterated: {
    title: "API di modelli abliterated: chi serve quali pesi",
    intro:
      "Gli stessi pesi abliterated girano su più host. Ecco cosa addebita ciascuno per token, letto oggi dai loro elenchi pubblici di modelli.",
    honest:
      "Lettura onesta: i router vincono sul prezzo. OpenUncensored e Refuseless vendono GLM 5.3 Flash e DeepSeek V4.1 Flash abliterated a $0.12 in input. Il nostro prezzo in elenco include un ricarico del {{markup}}%. Lo paghi per una sola chiave che copre modelli senza censura, aperti e mainstream, media, il formato Anthropic e una chat che il tuo team può usare.",
  },
  noFilter: {
    title: "API LLM senza filtro contenuti: cosa significa davvero disattivato",
    intro:
      "Ogni grande cloud ti lascia abbassare un filtro. Nessuno rimuove i rifiuti appresi del modello né la sua policy d'uso.",
    vertex:
      "Vertex AI e l'API Gemini: le soglie di sicurezza vanno su OFF, e OFF è il default su Vertex da gemini-3.5-flash. La sicurezza dei minori e gli altri danni principali restano bloccati, e l'allineamento di Gemini rifiuta ancora. La Prohibited Use Policy di Google vieta i contenuti sessualmente espliciti e l'elusione dei filtri di sicurezza, con eccezioni per lavori educativi, documentaristici, scientifici o artistici. Pesi propri: self-deploy da Model Garden su container vLLM o TGI.",
    together:
      "Together AI: 24 modelli di chat serverless, nessuno senza censura. I suoi termini vietano contenuti osceni e pornografia. I pesi propri girano su endpoint dedicati da $5.49 per ora di H100, e i caricamenti devono essere fine-tune di un'architettura che Together già supporta.",
    azure:
      "Azure OpenAI: filtri attivi di default, disattivabili solo dopo una richiesta approvata, e il Code of Conduct vieta comunque i chatbot erotici e romantici.",
    bedrock:
      "AWS Bedrock: nessun filtro se non colleghi un Guardrail, ma rifiuti e policy AWS restano. I pesi abliterated richiedono Custom Model Import, fatturato al minuto di capacità.",
    azureLink: "Alternative senza censura ad Azure OpenAI, in dettaglio",
    bedrockLink: "Alternative senza censura ad AWS Bedrock, in dettaglio",
  },
  others: {
    title: "Le altre API senza censura, senza giri di parole",
    intro:
      "Non siamo l'unica opzione. Ad alcuni di loro compriamo noi stessi. Fatti dalla loro documentazione, dai loro elenchi di modelli e dalle pagine dei prezzi, letti il {{date}}.",
    versusLink: "{{appName}} vs {{name}}: confronto completo",
    routerLink:
      "Lasciare OpenRouter: una chiave per tutti i modelli, tre formati di API",
    openRouterAlternatives: "Alternative a OpenRouter, a confronto",
    veniceAlternatives: "Alternative a Venice AI, a confronto",
    freedomGptAlternatives: "Alternative a FreedomGPT, a confronto",
  },
  faq: {
    title: "FAQ",
    free: {
      q: "Esiste un'API LLM senza censura gratuita?",
      a: "Da noi no. L'app di chat ha crediti gratuiti, l'API no. Qualsiasi piano, da {{subPrice}} al mese, sblocca le chiavi API. Strumenti locali come Ollama offrono un'API locale gratuita se il tuo hardware regge il modello.",
    },
    ids: {
      q: "Quali ID di modello sono senza censura?",
      a: "Al momento {{count}}, elencati nella tabella qui sopra con l'ID esatto. GET /v1/models restituisce ogni modello che la tua chiave può chiamare, con prezzi e supporto agli strumenti.",
    },
    sdk: {
      q: "L'API senza censura funziona con l'SDK OpenAI?",
      a: "Sì. Imposta base_url sulla base URL di {{appName}}, usa la tua chiave e metti un ID senza censura nel campo model. Funziona anche l'SDK Anthropic, con la stessa base URL senza /v1.",
    },
    refuse: {
      q: "Un modello senza censura non rifiuta mai?",
      a: "Rifiuta molto meno, non mai. I modelli abliterated perdono il riflesso di rifiuto appreso, ma possono ancora declinare o sbagliare. Prova con i tuoi prompt reali.",
    },
    logs: {
      q: "{{appName}} registra i miei prompt dell'API?",
      a: "L'API non scrive thread di chat, solo il record di fatturazione: modello e crediti addebitati. Ogni prompt passa da noi al provider che serve il modello, secondo le sue condizioni. La nostra privacy policy non promette separatamente l'assenza di log. Se ti serve come contratto, fai self-hosting.",
    },
    abliterated: {
      q: "Quale API serve modelli abliterated?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice e {{appName}} servono tutti pesi abliterated su un'API compatibile OpenAI. I router sono i più economici per token. {{appName}} aggiunge modelli mainstream, media e una chat web sulla stessa chiave.",
    },
    noFilter: {
      q: "Esiste un'API LLM senza filtro contenuti?",
      a: "Bedrock senza Guardrail e Gemini con le impostazioni di sicurezza su OFF non aggiungono alcun livello di filtro, ma i loro modelli mantengono rifiuti appresi e le loro policy vietano i contenuti sessuali. Azure richiede una richiesta approvata per disattivare i filtri. Per modelli che non rifiutano usa pesi abliterated o fine-tuned: in hosting qui o sui router sopra, oppure sulle tue GPU.",
    },
    vertex: {
      q: "Posso disattivare i filtri di sicurezza di Gemini?",
      a: "Sì. Sull'API Gemini le categorie che non imposti sono su Off di default da Gemini 2.5 in poi, e su Vertex OFF è il default da gemini-3.5-flash. I danni principali come la sicurezza dei minori restano bloccati, i rifiuti appresi di Gemini restano, e la policy di Google vieta i contenuti sessualmente espliciti e l'elusione dei filtri di sicurezza.",
    },
    local: {
      q: "Meglio ospitare da sé i modelli abliterated?",
      a: "Se hai le GPU e regole rigide sui dati, sì. Uno strumento locale espone un'API compatibile OpenAI sulla tua macchina. Se vuoi modelli senza censura di taglia frontier senza noleggiare hardware, un'API in hosting costa meno per iniziare.",
    },
    docsLink: "Leggi la reference completa dell'API",
    directoryLink: "Guarda i modelli abliterated in chat",
  },
  cta: {
    title: "Prima provali. Poi integrali.",
    subtitle:
      "Ogni modello della tabella gira anche nell'app di chat. Prova lì i tuoi prompt, poi copia l'ID nel codice.",
    chat: "Prova un modello senza censura in chat",
    docs: "Leggi la documentazione API",
  },
};
