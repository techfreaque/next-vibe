import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a OpenRouter con modelli senza censura | {{appName}}",
    description:
      "Confronta OpenRouter con Vercel AI Gateway, LiteLLM, Portkey, Cloudflare, NanoGPT e {{appName}}. Costi, hosting proprio, filtri e privacy.",
    category: "Guida per sviluppatori",
    imageAlt: "Alternative a OpenRouter per sviluppatori, a confronto",
    keywords:
      "alternativa a OpenRouter, alternative a OpenRouter, OpenRouter contro NanoGPT, siti come OpenRouter, gateway API LLM, API LLM senza censura, una chiave API per tutti i modelli, API compatibile OpenAI, API compatibile Anthropic, modelli senza censura OpenRouter, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida per sviluppatori",
    readTime: "9 min di lettura",
    title: "Alternative a OpenRouter per instradare le richieste ai modelli",
    subtitle:
      "{{count}} alternative e {{appName}} a confronto: formati API, modelli senza censura, commissioni. Verificato il {{date}}.",
  },
  intro: {
    lead: "OpenRouter collega più fornitori con una chiave API e offre una chat web. Il piano Standard indica una commissione del 5,5%. Confronta gli altri gateway se vuoi gestire il router in proprio, affinare i limiti o cambiare metodo di fatturazione.",
    p2: "Abbiamo verificato gateway ospitati, proxy da installare in proprio e app con modelli senza censura consultando documentazione e listini ufficiali. Anche noi acquistiamo accesso da OpenRouter. {{openRouterModels}} dei nostri modelli passano da lì.",
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
    weak: "Dove siamo più deboli: il catalogo di OpenRouter è molto più grande, ti permette di usare le tue chiavi dei provider e di scegliere il provider a ogni richiesta, e i suoi prezzi sono più vicini al listino perché noi aggiungiamo un ricarico. Se ti serve un modello raro, probabilmente OpenRouter ce l'ha.",
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
    title: "Le {{count}} alternative, una per una",
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
      a: "Dipende da cosa ti manca in OpenRouter. Tanti modelli senza censura e pagamento a consumo: NanoGPT. I modelli di Venice e la privacy: Venice. In locale e gratis: Ollama. Modelli senza censura, aperti e mainstream più una chat per il team con una sola chiave: {{appName}}.",
    },
    cheaper: {
      q: "Esiste un'alternativa più economica a OpenRouter?",
      a: "Confronta il prezzo per modello, non la commissione. Le API dirette dei provider saltano ogni intermediario. Tra i gateway i prezzi cambiano da modello a modello e spesso. Su {{appName}} paghi quello che paghiamo noi più un ricarico del {{markup}}%, e ogni pagina modello mostra il prezzo per messaggio.",
    },
    uncensored: {
      q: "Quale alternativa a OpenRouter ha modelli senza censura?",
      a: "NanoGPT, Venice, uncensored.ai, Gab AI e {{appName}} offrono modelli senza censura via API. {{appName}} ne ha {{apiUncensored}} sulla sua API in questo momento, abliterated e affinati accanto a {{ownModel}}.",
    },
    sdk: {
      q: "Posso tenere il mio codice OpenAI SDK?",
      a: "Sì. Cambi base URL e chiave API, il resto resta. Gli ID dei modelli cambiano da gateway a gateway, quindi sostituisci anche quelli. Esempio: {{example}}.",
    },
    anthropic: {
      q: "Funziona con gli SDK Anthropic e gli agenti di coding?",
      a: "Su {{appName}} sì: la Anthropic Messages API gira accanto ai formati OpenAI, quindi Claude Code e altri agenti si collegano con una sola chiave, modelli senza censura inclusi.",
    },
    free: {
      q: "Esiste un'alternativa gratuita a OpenRouter?",
      a: "Ollama è gratis se il tuo hardware regge il modello. OpenRouter stesso ha modelli gratuiti con limiti giornalieri. {{appName}} dà crediti gratuiti per la chat ogni mese, l'API si sblocca con il primo acquisto.",
    },
    apiLink: "API LLM senza censura: ID dei modelli, codice e limiti",
    veniceLink: "Alternative a Venice AI a confronto",
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
