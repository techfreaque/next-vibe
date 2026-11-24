import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a FreedomGPT: app AI senza censura a confronto (2026)",
    description:
      "Alternative a FreedomGPT verificate alla fonte: Venice, NanoGPT, uncensored.ai, Gab AI, LM Studio, Ollama e {{appName}}. Prezzo, privacy, offline.",
    category: "Confronto",
    imageAlt: "Alternative a FreedomGPT messe a confronto",
    keywords:
      "alternativa a FreedomGPT, alternative FreedomGPT, siti come FreedomGPT, app come FreedomGPT, FreedomGPT vs Venice, FreedomGPT Liberty, alternativa FreedomGPT desktop, AI senza censura, IA senza censura, chat AI senza filtri, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Confronto",
    readTime: "9 min di lettura",
    title: "Alternative a FreedomGPT. Stessa idea, meno trappole.",
    subtitle:
      "{{count}} alternative e {{appName}}, confrontate su ciò che dicono le loro pagine di prezzi, privacy e filtri.",
  },
  intro: {
    lead: "FreedomGPT promette un solo abbonamento per centinaia di modelli, anche senza censura. Bella idea. Le trappole stanno nella sua FAQ, nella sua privacy policy e in un'app desktop che nessuno aggiorna da anni.",
    p2: "Qui sotto: cosa promette davvero FreedomGPT, cosa comprano i suoi crediti e {{count}} alternative verificate sulle loro pagine. FreedomGPT al {{fgDate}}, le altre al {{date}}. Diciamo anche dove battono noi.",
    relation:
      "Per trasparenza: siamo clienti di FreedomGPT. {{freedomGptExamples}} gira su {{appName}} tramite l'API di FreedomGPT stessa.",
  },
  fg: {
    title: "Cosa offre FreedomGPT",
    intro:
      "Dalla home, dalla pagina prezzi, dalla privacy policy, dalla documentazione API e da GitHub, letti il {{fgDate}}.",
    models:
      "Modelli: la home dichiara oltre 400 modelli in un solo abbonamento e cita ChatGPT, Claude, Gemini, Grok, Kimi, GLM, DeepSeek, Qwen, Llama, Mistral e altri, accanto a opzioni senza censura per scrittura, roleplay e ricerca.",
    filter:
      "Filtro: la sua FAQ dice che l'etichetta senza censura non garantisce una risposta a ogni richiesta e che le regole del modello e del servizio valgono comunque.",
    price:
      "Prezzo: prova gratuita senza carta e senza account. Pro costa {{proPrice}} al mese per {{proCredits}} crediti. Le sue stime: circa {{replyCost}} crediti per risposta premium, {{imageCost}} per immagine, {{videoCost}} per un video di cinque secondi.",
    bonus:
      "Bonus di registrazione: 100 crediti, ma solo per nuovi account Google, Apple o X idonei. Chi si registra con email e password non riceve nulla.",
    privacy:
      "Privacy: la home stessa dice di non dare per scontati anonimato o conservazione zero. La privacy policy dice che messaggi, registrazioni vocali e immagini vanno a fornitori AI terzi e non indica per quanto vengono conservati.",
    apps: "App e API: web, iPhone, iPad e Android. La chiave API si prende dalla dashboard, la documentazione non riporta prezzi. L'ultimo commit dell'app desktop open source risale al {{desktopDate}}.",
    why: "Perché si cerca altrove: per sapere cosa compra davvero un mese, per un'app offline ancora mantenuta, o per una policy che tenga le chat lontane da un server.",
    sourceHome: "Home di FreedomGPT",
    sourcePricing: "Prezzi di FreedomGPT",
    sourcePrivacy: "Privacy policy di FreedomGPT",
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
    intro:
      "Da mobile scorri di lato. Dati dei concorrenti verificati il {{date}} sulle loro pagine. Dati di {{appName}} letti in tempo reale dalla nostra configurazione.",
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
    fg: "FreedomGPT: messaggi, registrazioni vocali e immagini vengono condivisi con fornitori AI terzi. Nessun periodo di conservazione indicato. La sua stessa home sconsiglia di contare sull'anonimato.",
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
      a: "Venice, NanoGPT, uncensored.ai, Gab AI e {{appName}} offrono API compatibili con OpenAI. Anche FreedomGPT ne ha una, senza prezzi nella documentazione. Su {{appName}} qualsiasi piano da {{apiSubPrice}} al mese sblocca l'API.",
    },
    gabLink: "Alternative a Gab AI a confronto",
    nofilterLink: "Alternative a NoFilterGPT a confronto",
    noGpuLink: "Modelli senza censura senza scheda grafica",
  },
  cta: {
    title: "Sappi cosa paghi. Poi chiedi tutto.",
    subtitle:
      "{{guestCredits}} crediti gratis al mese, senza account. Parti in incognito e prova qualsiasi modello.",
    start: "Avvia una chat in incognito",
    models: "Vedi i modelli senza censura",
  },
};
