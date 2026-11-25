import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a NanoGPT: IA a consumo e senza censura (2026)",
    description:
      "NanoGPT ha limitato PRO, alzato il prezzo e reso note esposizioni di dati presso alcuni fornitori. Confronta {{appName}}, OpenRouter, Venice, Featherless, Arli AI, Infermatic e altri.",
    category: "Confronto",
    imageAlt: "Le alternative a NanoGPT per modelli a consumo e senza censura",
    keywords:
      "alternative a NanoGPT, alternativa a NanoGPT, alternativa nano-gpt, siti come NanoGPT, NanoGPT vs OpenRouter, IA a consumo, API IA senza censura, API modelli abliterated, alternativa Featherless, NanoGPT PRO, NanoGPT alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Confronto",
    readTime: "9 min di lettura",
    title: "Alternative a NanoGPT per modelli a consumo e senza censura",
    subtitle:
      "{{count}} alternative e {{appName}}, confrontate sulle pagine di prezzi, privacy e modelli verificate il {{date}}.",
  },
  intro: {
    lead: "NanoGPT fa una cosa molto bene: tutti i modelli, a consumo, da dieci centesimi. Nel 2026 ha anche limitato il piano PRO, alzato il prezzo, sospeso una volta le iscrizioni e reso note esposizioni di prompt presso diversi fornitori a monte.",
    p2: "Per trasparenza: compriamo da NanoGPT. {{appName}} oggi passa da NanoGPT per {{nanoGptModels}} modelli, di cui {{nanoGptUncensored}} senza censura. Ecco le alternative, verificate il {{date}}, e dove NanoGPT vince ancora.",
  },
  subject: {
    title: "NanoGPT oggi",
    intro: "Dalle sue pagine di prezzi, condizioni, privacy e dal blog.",
    plans:
      "Prezzo: a consumo da 0,10 USD in crypto o 1 USD con carta. PRO: {{plans}}, con 60M token in input a settimana su alcuni modelli aperti e 100 immagini al giorno. Claude, GPT, Gemini e Grok si pagano dal saldo.",
    filter:
      "Filtro: 18+, nessun divieto generale sui contenuti per adulti. Le condizioni vietano i contenuti sessuali con minori e i deepfake di persone reali.",
    privacy:
      "Privacy: cronologia nel browser di default, sincronizzazione cifrata opzionale. NanoGPT dice di non registrare i prompt nell'uso normale, ma alcuni percorsi permettono l'addestramento.",
    extra:
      "Commissioni: la maggior parte dei modelli a prezzo di listino. Scegliere un fornitore, Private Mode o la tua chiave aggiunge circa il 5%.",
  },
  why: {
    title: "Perché si cerca altrove",
    intro: "Quattro motivi, ognuno da una fonte pubblica.",
    exposure:
      "Esposizioni presso i fornitori. A novembre 2026 NanoGPT ha reso noto che prompt e risposte erano rimasti esposti presso diversi fornitori a monte per settimane o mesi, e ha tolto quei percorsi.",
    caps: "Limiti. A febbraio 2026 PRO è passato da input illimitato a 60M token in input a settimana, più limiti sui picchi.",
    paused:
      "Iscrizioni sospese. A marzo 2026 le nuove iscrizioni a PRO sono state bloccate per abusi e instabilità.",
    reliability:
      "Affidabilità. Le recensioni lamentano chiamate di tool fallite che costano comunque.",
  },
  criteria: {
    title: "Cosa confrontare prima di cambiare",
    intro: "Decidono cinque domande.",
    one: "Fatturazione: a token, a messaggio, piano fisso, e la ricarica minima.",
    two: "Modelli: quanti senza censura e abliterated, e ci sono anche Claude, GPT e Gemini?",
    three:
      "Privacy: chi registra i prompt, quali percorsi permettono l'addestramento, cosa resta sul tuo dispositivo.",
    four: "API: formato OpenAI o Anthropic, e quale piano la sblocca.",
    five: "Media: immagini, video, voce e musica con lo stesso saldo.",
  },
  table: {
    title: "Tutte fianco a fianco",
  },
  us: {
    title: "{{appName}}: ogni tipo di modello, un solo saldo",
    intro:
      "{{modelCount}} modelli in una chat. Il livello di filtro lo scegli messaggio per messaggio.",
    models:
      "Modelli: {{uncensored}} senza censura accanto a {{mainstream}} mainstream e {{open}} aperti. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, con il risultato di un modello con opinioni politiche controcorrente.",
    fit: "NanoGPT dentro: {{nanoGptModels}} dei nostri modelli girano tramite NanoGPT, tra cui {{nanoGptExamples}}. In più {{imageModels}} modelli di immagini, {{videoModels}} di video e {{musicModels}} di musica con lo stesso saldo.",
    privacy:
      "Privacy: le chat in incognito restano nella memoria locale del tuo browser, senza account.",
    price:
      "Prezzo: {{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account. Piani: {{planList}}. I pacchetti di crediti ricaricano un piano attivo e non scadono mai.",
    api: "API: endpoint compatibili OpenAI e Anthropic. Qualsiasi acquisto la sblocca.",
    weak: "Dove siamo più deboli: NanoGPT elenca molti più modelli e ne fa pagare la maggior parte a prezzo di listino. Noi aggiungiamo un ricarico del {{markup}}% e serve un piano prima di comprare pacchetti di crediti.",
    ownLink: "Guarda {{ownModel}}",
    directoryLink: "Tutti i modelli abliterated, con contesto e prezzo",
  },
  list: {
    title: "Le alternative documentate, una per una",
    intro:
      "Le piattaforme con un profilo completo nei nostri dati di confronto, verificate sulle loro pagine. Gli host di modelli a tariffa fissa e i gateway sono nella tabella qui sopra.",
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
    title: "Quando NanoGPT resta la scelta giusta",
    intro: "A volte l'originale è l'affare migliore.",
    one: "Vuoi la lista di modelli più ampia a prezzo di listino e nessun abbonamento.",
    two: "Paghi piccole cifre in crypto, da dieci centesimi, o vuoi pagare le chiamate API senza account.",
    three:
      "Vivi di modelli aperti e la quota di token di PRO copre il tuo mese.",
    versusLink: "{{appName}} vs NanoGPT: il confronto completo",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore alternativa a NanoGPT?",
      a: "Per sviluppatori con pagamento a token: OpenRouter. Per privacy e un'app creativa: Venice. Per modelli aperti e senza censura a tariffa fissa: Featherless o Arli AI. Per modelli senza censura, aperti e mainstream più i media in una chat e un solo saldo: {{appName}}.",
    },
    free: {
      q: "Esiste un'alternativa gratuita a NanoGPT?",
      a: "OpenRouter ha limiti giornalieri sui modelli gratuiti. LM Studio e Ollama sono gratuiti sul tuo hardware. {{appName}} dà {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account.",
    },
    filter: {
      q: "Quali alternative hanno modelli senza censura?",
      a: "Venice, uncensored.ai, Featherless, Arli AI, Infermatic e {{appName}} offrono tutte modelli senza censura o abliterated. OpenRouter ne ha pochi. Su {{appName}} si sbloccano dopo una conferma 18+ una tantum.",
    },
    privacy: {
      q: "Quale alternativa è la più sicura per prompt riservati?",
      a: "Un runner locale come LM Studio o Ollama tiene i prompt sulla tua macchina. Tra i servizi in hosting, controlla quali fornitori a monte usa un servizio e se registra i dati. Qualsiasi modello in hosting vede il prompt a cui risponde.",
    },
    move: {
      q: "Posso cambiare senza riscrivere il codice?",
      a: "Quasi sempre. NanoGPT, OpenRouter e {{appName}} parlano il formato OpenAI, quindi cambi l'URL base, la chiave e l'ID del modello. {{appName}} parla anche il formato Anthropic.",
    },
  },
  cta: {
    title: "Ogni modello. Un solo saldo.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, nessun account. Parti in incognito e scegli qualsiasi modello.",
    start: "Avvia una chat in incognito",
    models: "Confronta tutti i modelli",
  },
};
