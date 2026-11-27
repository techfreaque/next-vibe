import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a FreedomGPT: app AI senza censura a confronto (2026)",
    description:
      "Confronta FreedomGPT con {{appName}}, Venice e Poe online, oppure con LM Studio, Ollama e Jan offline. Prezzi, filtri e privacy.",
    category: "Confronto",
    imageAlt: "Alternative a FreedomGPT messe a confronto",
    keywords:
      "alternativa a FreedomGPT, alternative FreedomGPT, siti come FreedomGPT, app come FreedomGPT, FreedomGPT vs Venice, FreedomGPT Liberty, alternativa FreedomGPT desktop, AI senza censura, IA senza censura, chat AI senza filtri, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Confronto",
    readTime: "9 min di lettura",
    title: "Alternative a FreedomGPT online e offline",
    subtitle:
      "{{count}} alternative e {{appName}}, confrontate su ciò che dicono le loro pagine di prezzi, privacy e filtri.",
  },
  intro: {
    lead: "FreedomGPT propone un solo abbonamento per centinaia di modelli, anche senza censura. Buona idea. Il problema: non dice mai quali siano quei modelli, la sua informativa sulla privacy promette zero privacy e la sua app desktop non viene aggiornata da anni.",
    p2: "Qui sotto: cosa promette davvero FreedomGPT, cosa comprano i suoi crediti e {{count}} alternative verificate sulle loro pagine. FreedomGPT al {{fgDate}}, le altre al {{date}}. Diciamo anche dove battono noi.",
    relation:
      "Per trasparenza: siamo clienti di FreedomGPT. {{freedomGptExamples}} gira su {{appName}} tramite l'API di FreedomGPT stessa.",
  },
  fg: {
    title: "Cosa offre FreedomGPT",
    intro:
      "Da home page, pagina dei prezzi, termini, informativa sulla privacy e documentazione API, letti il {{fgDate}}.",
    models:
      "Modelli: la home page dichiara oltre 400 modelli in un solo abbonamento e cita ChatGPT, Claude, Gemini, Grok, Kimi, GLM, DeepSeek, Qwen, Llama e altri. Promette opzioni senza censura ma non ne nomina nessuna. La sua API usa di default un modello chiamato Liberty e non dice cosa sia.",
    filter:
      "Filtro: i termini consentono l'uso solo per scopi leciti ed etici e non elencano nulla di più preciso. Non è indicata un'età minima.",
    price:
      "Prezzo: prova gratuita senza carta e senza account. Pro costa {{proPrice}} al mese per {{proCredits}} crediti. Le sue stime: circa {{replyCost}} crediti per risposta premium, {{imageCost}} per immagine, {{videoCost}} per un video di cinque secondi.",
    bonus:
      "Bonus di registrazione: 100 crediti, ma solo per nuovi account Google, Apple o X idonei. Chi si registra con email e password non riceve nulla.",
    privacy:
      "Privacy: la home page ti dice di non dare per scontati anonimato o zero conservazione. L'informativa dice che FreedomGPT può raccogliere e conservare qualsiasi informazione tu fornisca, che gli utenti non hanno alcuna aspettativa di privacy e che i messaggi vanno ai provider di IA per generare le risposte. Non indica alcun periodo di conservazione.",
    apps: "App e API: web, iPhone e Android. L'API ha endpoint per chat, immagini, chiamate telefoniche e video, ma le risposte arrivano nel formato proprietario di FreedomGPT, non nello schema OpenAI, e la documentazione non riporta prezzi per token. L'ultimo commit dell'app desktop open source risale al {{desktopDate}}.",
    why: "Perché si cerca altrove: per sapere cosa compra davvero un mese, per un'app offline ancora mantenuta, o per una policy che tenga le chat lontane da un server.",
    sourceHome: "Home di FreedomGPT",
    sourcePricing: "Prezzi di FreedomGPT",
    sourcePrivacy: "Privacy policy di FreedomGPT",
    sourceTerms: "Termini di servizio di FreedomGPT",
    sourceApi: "Documentazione API di FreedomGPT",
    sourceRepo: "Repository dell'app desktop FreedomGPT",
  },
  credits: {
    title: "Cosa comprano {{proPrice}} al mese su FreedomGPT",
    intro:
      "{{proCredits}} crediti divisi per le stime di FreedomGPT. Una cosa sola, o un mix.",
    replies:
      "Circa {{replies}} risposte premium, a {{replyCost}} crediti l'una.",
    images: "Oppure circa {{images}} immagini, a {{imageCost}} crediti l'una.",
    videos:
      "Oppure {{videos}} video da cinque secondi, a {{videoCost}} crediti l'uno.",
    us: "Su {{appName}} ogni pagina modello mostra il prezzo attuale per messaggio prima dell'invio, e i piani partono da {{subPrice}} al mese per {{subCredits}} crediti. I modelli economici fanno durare un piano a lungo, quelli di punta meno. Vedi tu quale è quale.",
  },
  criteria: {
    title: "Cosa confrontare prima di cambiare",
    intro: "Decidono cinque domande.",
    models:
      "Modelli: quanti senza censura, di che tipo (abliterated o davvero non censurati), e ci sono Claude, GPT e Gemini nello stesso posto?",
    filter:
      "Filtro: cosa vietano davvero i termini, e se l'etichetta senza censura significa che il modello risponde.",
    privacy:
      "Privacy: dove stanno le tue chat, chi altro le riceve e per quanto tempo qualcuno le tiene.",
    price:
      "Prezzo: quante risposte, immagini e video compra un mese. Non solo il prezzo di listino.",
    offline:
      "Offline: esiste un'opzione locale mantenuta, o solo un'app cloud?",
  },
  table: {
    title: "Tutti a confronto",
  },
  us: {
    title: "{{appName}}: i modelli senza censura, con nome e prezzo",
    intro:
      "{{modelCount}} modelli in una chat sola, con un solo saldo. Scegli il modello a ogni messaggio, e ogni modello ha la sua pagina.",
    models:
      "Modelli: {{uncensored}} senza censura accanto a {{mainstream}} mainstream e {{open}} aperti. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, e ne esce un modello con opinioni politiche controcorrente.",
    liberty:
      "Anche Liberty di FreedomGPT è qui ({{freedomGptExamples}}), accanto alle versioni abliterated di GLM, DeepSeek e Kimi. Confronta la sua risposta con un altro modello nello stesso thread.",
    libertyOff:
      "Versioni abliterated di GLM, DeepSeek e Kimi accanto a Claude, GPT e Gemini. Confronta le risposte nello stesso thread.",
    privacy:
      "Privacy: le chat in incognito restano nella memoria locale del browser, senza account. Le chat private si salvano solo nel tuo account.",
    price:
      "Prezzo: {{guestCredits}} crediti gratis al mese senza account, {{freeCredits}} con un account. Piani da {{subPrice}} al mese. I modelli senza censura si sbloccano dopo una conferma unica dei 18 anni.",
    open: "Open source: tutta la piattaforma è su GitHub ed è sviluppata attivamente. Se vuoi un'istanza tua, la ospiti tu.",
    weak: "Dove siamo più deboli: niente piano illimitato tutto compreso, e anche qui il video costa crediti veri. L'avvio gratis senza account di FreedomGPT è facile quanto il nostro.",
    hubLink: "Chat AI senza censura: tutti i modelli con contesto e prezzo",
    abliteratedLink: "Modelli abliterated da usare nel browser",
    libertyLink: "Vedi FreedomGPT Liberty su {{appName}}",
    ownLink: "Vedi {{ownModel}}",
  },
  list: {
    title: "Le {{count}} alternative, una per una",
    intro:
      "Dalle loro pagine, verificate il {{date}}. Cos'è ciascuna, quali modelli ha, cosa permette il suo filtro, che fine fanno le tue chat.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelli:",
    filter: "Filtro:",
    privacy: "Privacy:",
    price: "Prezzo:",
    priceValue: "Gratis: {{free}}. A pagamento: {{plans}}.",
    pro: "Punto forte:",
    con: "Il limite:",
    forWho: "Sceglila se:",
    versusLink: "{{appName}} vs {{name}}: il confronto completo",
    visit: "Visita {{name}}",
  },
  privacy: {
    title: "Privacy: leggi la policy, non lo slogan",
    intro: "Cosa scrive davvero ognuno.",
    fg: "FreedomGPT: la sua policy dice che gli utenti non hanno alcuna aspettativa di privacy e che può conservare tutto ciò che fornisci. I messaggi vanno ai provider di IA. Nessun periodo di conservazione indicato. La sua stessa home page dice di non dare per scontato l'anonimato.",
    us: "{{appName}} in incognito: le chat vivono nella memoria locale del browser, non sui nostri server. Cancelli i dati del browser e spariscono.",
    local:
      "LM Studio e Ollama: il modello gira sul tuo computer e il prompt non lo lascia mai. Il prezzo è il tuo hardware.",
    callout:
      "Ogni modello ospitato vede il prompt a cui risponde. Una cronologia sul dispositivo tiene le chat lontane dal server di un'azienda, non dal modello.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore alternativa a FreedomGPT?",
      a: "Dipende da cosa ti manca. Cronologia sul dispositivo e grande catalogo: Venice. Pagamento a consumo senza abbonamento: NanoGPT. Un modello diretto con una sua visione del mondo: uncensored.ai. Tutto offline: LM Studio o Ollama. Modelli senza censura, aperti e mainstream con un prezzo pubblico per messaggio, in una chat sola: {{appName}}.",
    },
    free: {
      q: "Esiste un'alternativa gratuita a FreedomGPT?",
      a: "Sì. Ollama è gratuito e open source sul tuo hardware, LM Studio è gratis in locale. {{appName}} dà {{guestCredits}} crediti gratis al mese senza account e {{freeCredits}} con un account, modelli senza censura inclusi dopo una conferma unica dei 18 anni.",
    },
    liberty: {
      q: "Posso usare FreedomGPT Liberty anche altrove?",
      a: "Sì. {{appName}} offre {{freedomGptExamples}} tramite l'API di FreedomGPT: usi Liberty accanto ad altri {{uncensored}} modelli senza censura e controlli le sue risposte.",
      aOff: "Liberty è il modello di casa FreedomGPT. Su {{appName}} hai altri {{uncensored}} modelli senza censura, abliterated e davvero non censurati, in una chat sola.",
    },
    desktop: {
      q: "L'app desktop di FreedomGPT è ancora mantenuta?",
      a: "Il suo repository open source su GitHub mostra l'ultimo commit il {{desktopDate}}. Per lavorare offline oggi, le opzioni mantenute sono Ollama e LM Studio.",
    },
    private: {
      q: "Quale alternativa è la più privata?",
      a: "Un programma locale: Ollama o LM Studio tengono ogni prompt sul tuo dispositivo. Tra le opzioni ospitate, Venice e l'incognito di {{appName}} tengono la cronologia nel browser. La policy di FreedomGPT condivide i messaggi con fornitori AI terzi.",
    },
    api: {
      q: "Quale alternativa ha un'API senza censura?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI e {{appName}} offrono tutti API compatibili con OpenAI. Ce l'ha anche FreedomGPT, ma nel suo formato di risposta e senza prezzi nella documentazione. Per pesi abliterated solo via API, OpenUncensored, Refuseless e NEAR AI Cloud li vendono a prezzo del provider. Su {{appName}} qualsiasi piano da {{apiSubPrice}} al mese sblocca l'API.",
    },
    gabLink: "Alternative a Gab AI a confronto",
    nofilterLink: "Alternative a NoFilterGPT a confronto",
    noGpuLink: "Modelli senza censura senza scheda grafica",
    openRouterLink: "Alternative a OpenRouter senza censura, a confronto",
    apiLink: "API LLM senza censura: ID dei modelli, codice e limiti",
  },
  cta: {
    title: "Sappi cosa paghi. Poi chiedi tutto.",
    subtitle:
      "{{guestCredits}} crediti gratis al mese, senza account. Parti in incognito e prova qualsiasi modello.",
    start: "Avvia una chat in incognito",
    models: "Vedi i modelli senza censura",
  },
};
