import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a SillyTavern: gioco di ruolo senza installare",
    description:
      "SillyTavern è gratuito ma richiede Node.js, un backend e su iPhone non si installa. Confronta {{appName}}, RisuAI, Agnaistic, KoboldCpp, Janitor AI e altri.",
    category: "Confronto",
    imageAlt: "Le alternative a SillyTavern, in hosting e locali, a confronto",
    keywords:
      "alternative a SillyTavern, alternativa a SillyTavern, app come SillyTavern, SillyTavern per iPhone, SillyTavern online, SillyTavern senza installazione, SillyTavern alternatives, RisuAI vs SillyTavern, KoboldCpp, Agnaistic, interfaccia per gioco di ruolo IA, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Confronto",
    readTime: "9 min di lettura",
    title: "Alternative a SillyTavern senza configurazione",
    subtitle:
      "{{count}} alternative e {{appName}}, da altre interfacce open source alla chat in hosting. Verificate sulle loro pagine il {{date}}.",
  },
  intro: {
    lead: "SillyTavern è l'attrezzo da professionisti del gioco di ruolo con l'IA. Gratuito, open source, configurabile all'infinito. Vuole anche Node.js, un backend per il modello, un file di configurazione e, sul telefono, Termux.",
    p2: "Ad alcuni piace proprio così. Altri vogliono solo scrivere. Ecco le alternative, dai cloni open source con le stesse schede alle app in hosting senza nulla da installare, verificate il {{date}}.",
  },
  subject: {
    title: "SillyTavern oggi",
    intro:
      "La versione 1.19.1 è uscita il 19 novembre 2026. Ecco cosa dice la documentazione del progetto.",
    plans:
      "Prezzo: gratuito e open source (AGPL-3.0). Gli sviluppatori non gestiscono alcun servizio in hosting, quindi paghi l'API del modello che colleghi, o niente con un modello locale.",
    filter:
      "Filtro: nessuno suo. Decide il modello o il fornitore collegato cosa è permesso.",
    privacy:
      "Privacy: le chat vivono nella cartella dati della tua installazione. Tutto ciò che invii a un'API cloud segue la policy di quel fornitore.",
    extra:
      "Configurazione: Node.js 20 o successivo, Git, poi un backend. Su Android gira tramite Termux, su iPhone non si installa proprio. L'accesso remoto richiede una whitelist o una password, e la documentazione sconsiglia di esporlo a internet.",
  },
  why: {
    title: "Perché si cerca altrove",
    intro: "Le stesse quattro lamentele, con le parole del progetto stesso.",
    setup:
      "Configurazione del backend. I backend locali possono essere complessi, e il team non dà supporto.",
    mobile:
      "Mobile. Android richiede Termux e può chiudere il server in background. Su iPhone non c'è modo di installarlo.",
    security:
      "La sicurezza tocca a te. La versione 1.19.1 ha corretto script che partivano da schede personaggio e chat importate.",
    cost: "Paghi due volte. Un hosting gestito si fa pagare solo per l'hosting, e l'API del modello va in aggiunta.",
  },
  criteria: {
    title: "Cosa verificare prima di cambiare",
    intro: "Cinque domande mettono ordine tra le opzioni.",
    one: "Installazione: browser, app desktop o un server che gestisci e aggiorni tu.",
    two: "Schede: importa schede PNG o JSON e lorebook di SillyTavern e Chub?",
    three:
      "Modelli: porti la tua chiave API, li fai girare in locale, o sono inclusi.",
    four: "Funzioni: chat di gruppo, lorebook, generazione di immagini e voce.",
    five: "Costo: software gratuito più l'API, un piano fisso o pagamento a messaggio.",
  },
  table: {
    title: "Tutte fianco a fianco",
  },
  us: {
    title: "{{appName}}: niente da installare, modelli inclusi",
    intro:
      "Apri un browser su qualsiasi dispositivo, iPhone compreso. {{modelCount}} modelli sono già collegati, quindi non c'è nessuna chiave API da incollare.",
    models:
      "Modelli: {{uncensored}} senza censura accanto a {{mainstream}} mainstream e {{open}} aperti. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, con il risultato di un modello con opinioni politiche controcorrente.",
    fit: "Personaggi: la skill di gioco di ruolo o il tuo personaggio come skill. La memoria conserva i fatti tra una chat e l'altra, e {{imageModels}} modelli di immagini illustrano una scena nello stesso thread.",
    privacy:
      "Privacy: le chat in incognito restano nella memoria locale del tuo browser, senza account.",
    price:
      "Prezzo: {{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account, {{maxCredits}} con la newsletter. Piani: {{planList}}. Un solo saldo per tutti i modelli.",
    api: "API: endpoint compatibili OpenAI e Anthropic, quindi puoi ancora puntare SillyTavern sui nostri modelli. Qualsiasi acquisto la sblocca.",
    weak: "Dove vince SillyTavern: controllo totale su prompt, preset ed estensioni, chat di gruppo, lorebook e importazione delle schede. Anche noi siamo open source, ma siamo una piattaforma, non un kit per il gioco di ruolo.",
    ownLink: "Guarda {{ownModel}}",
    skillLink: "Avvia la skill di gioco di ruolo",
  },
  list: {
    title: "Le alternative documentate, una per una",
    intro:
      "Le piattaforme con un profilo completo nei nostri dati di confronto, verificate sulle loro pagine. Le interfacce open source sono nella tabella qui sopra.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelli:",
    filter: "Filtro:",
    price: "Prezzo:",
    priceValue: "Piano gratuito: {{free}}. A pagamento: {{plans}}.",
    pro: "Punto forte:",
    con: "Il rovescio:",
    forWho: "Sceglila se:",
    versusLink: "{{appName}} vs {{name}}: confronto completo",
    visit: "Visita {{name}}",
  },
  stay: {
    title: "Quando SillyTavern resta la scelta giusta",
    intro: "Per molti utenti esperti lo è.",
    one: "Fai girare i modelli in locale e non vuoi che nulla lasci la tua macchina.",
    two: "Vivi di estensioni, preset, regole regex e chat di gruppo.",
    three:
      "Hai già delle chiavi API e vuoi un'unica interfaccia per tutte. La nostra può essere una di quelle chiavi.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore alternativa a SillyTavern?",
      a: "Il clone più vicino: RisuAI, open source con lorebook, chat di gruppo e una versione web. Locale e semplice: KoboldCpp o LM Studio. Libreria di personaggi in hosting: Janitor AI o Chub. Niente da installare e modelli inclusi: {{appName}}.",
    },
    free: {
      q: "Esiste un'alternativa gratuita a SillyTavern?",
      a: "RisuAI, Agnaistic, KoboldCpp e Talemate sono software gratuiti. Il modello lo paghi comunque, a meno che non giri sul tuo hardware. {{appName}} dà {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account, {{maxCredits}} con la newsletter, modelli inclusi.",
    },
    filter: {
      q: "Quali alternative permettono il gioco di ruolo senza censura?",
      a: "Le interfacce ereditano le regole del modello, quindi scegli un modello senza censura. In locale, KoboldCpp o LM Studio fanno girare modelli abliterated. In hosting, {{appName}} offre {{uncensored}} modelli senza censura dopo una conferma 18+ una tantum. Janitor AI e Chub permettono il gioco di ruolo per adulti alle loro condizioni.",
    },
    privacy: {
      q: "Un'alternativa in hosting è privata quanto SillyTavern?",
      a: "Non del tutto. Un modello locale tiene tutto sulla tua macchina. Un modello in hosting vede sempre il prompt a cui risponde. La modalità incognito di {{appName}} tiene la cronologia nel tuo browser invece che su un server.",
    },
    move: {
      q: "Posso usare SillyTavern su iPhone?",
      a: "Non direttamente. Lo ospiti su un PC o un server e lo apri in Safari, il che significa configurare l'accesso remoto. Una web app come {{appName}} o Janitor AI funziona su iPhone senza questo passaggio.",
    },
  },
  cta: {
    title: "Salta la configurazione. Tieni la storia.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, senza account e senza chiave API.",
    start: "Avvia un gioco di ruolo",
    chat: "Apri una chat in incognito",
  },
};
