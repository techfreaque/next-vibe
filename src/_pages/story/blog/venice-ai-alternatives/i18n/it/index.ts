import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a Venice AI: private e senza censura (2026)",
    description:
      "Venice AI a confronto con {{appName}}, OpenUncensored, NEAR AI Cloud, Maple, Proton Lumo, NanoGPT e app locali. Dove vengono elaborate le richieste, quali modelli rifiutano meno, quali formati API funzionano e cosa costa extra.",
    category: "Confronto",
    imageAlt: "Le alternative a Venice AI a confronto",
    keywords:
      "alternative a Venice AI, alternativa a Venice AI, siti come Venice AI, alternativa Venice.ai, IA privata senza censura, alternativa chat IA senza censura, Venice AI vs NanoGPT, Venice AI vs FreedomGPT, IA senza censura con API, chat IA privata, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Confronto",
    readTime: "10 min di lettura",
    title: "Alternative a Venice AI per chat riservate",
    subtitle:
      "{{count}} alternative e {{appName}}, confrontate su quello che dicono le loro pagine di prezzi, privacy e filtri. Verificato il {{date}}.",
  },
  intro: {
    lead: "Venice si è fatta un nome con due promesse: privata e senza censura. Ne mantiene buona parte. Ma il piano gratuito offre 10 richieste di testo al giorno, il filtro per adulti richiede Pro e la sua API non ha un endpoint Anthropic nativo.",
    p2: "Ecco quindi le alternative, verificate il {{date}} sulle loro pagine di prezzi, privacy e filtri. Per trasparenza: compriamo da Venice. {{appName}} oggi passa da Venice per {{veniceModels}} modelli, di cui {{veniceUncensored}} senza censura. Diciamo anche dove vince Venice.",
  },
  criteria: {
    title: "Cosa confrontare prima di cambiare",
    intro: "Decidono cinque domande.",
    privacy:
      "Privacy: dove vivono le tue chat, e qualcuno ci addestra sopra? Sul dispositivo, sul server o usate per migliorare i modelli.",
    models:
      "Modelli: quanti senza censura, di che tipo, e trovi Claude, GPT e Gemini nello stesso posto?",
    filter:
      "Filtro: cosa è permesso nel piano gratuito, cosa richiede un abbonamento, e c'è una verifica dell'età?",
    price:
      "Prezzo: quota gratuita, abbonamento o pagamento a consumo. E cosa succede quando arrivi al limite.",
    api: "API: puoi chiamare gli stessi modelli dal codice, e in quale formato?",
  },
  table: {
    title: "Tutte fianco a fianco",
  },
  us: {
    title: "{{appName}}: una chat, ogni tipo di modello",
    intro:
      "{{modelCount}} modelli in una chat e un solo saldo. Il livello di filtro lo scegli messaggio per messaggio.",
    models:
      "Modelli: {{uncensored}} senza censura accanto a {{mainstream}} mainstream e {{open}} aperti. Cambi a metà chat. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, con il risultato di un modello con opinioni politiche controcorrente.",
    venice:
      "Venice dentro: {{veniceModels}} dei nostri modelli girano tramite Venice, tra cui {{veniceExamples}}. Gli stessi modelli, un solo account con tutti gli altri.",
    privacy:
      "Privacy: le chat in incognito restano nella memoria locale del tuo browser, senza account. Le chat private si salvano solo nel tuo account.",
    price:
      "Prezzo: {{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account, {{maxCredits}} con la newsletter. Piani da {{subPrice}} al mese. I pacchetti di crediti ricaricano un piano attivo e non scadono mai.",
    api: "API: gli stessi modelli tramite endpoint compatibili OpenAI e Anthropic. Qualsiasi piano da {{apiSubPrice}} al mese la sblocca.",
    weak: "Dove siamo più deboli: il catalogo di Venice è più grande, e sui suoi modelli Venice costa meno a token, perché sul prezzo che paghiamo aggiungiamo un ricarico del {{markup}}%. Niente pagamento a richiesta con x402 e nessuno strato di token come VVV o DIEM: la nostra API richiede un account e un acquisto.",
    directoryLink: "Tutti i modelli abliterated, con contesto e prezzo",
    ownLink: "Guarda {{ownModel}}",
  },
  veniceApi: {
    title: "L'API di Venice, verificata il {{veniceDate}}",
    intro: "Cosa ottengono gli sviluppatori prima di guardare altrove.",
    formats:
      "Formati: chat compatibile con OpenAI con un endpoint Responses. Nessuna Anthropic Messages API nativa: la sua guida per Claude Code usa un proxy di traduzione locale.",
    payment:
      "Pagamento: una chiave API richiede un account, oppure con x402 paghi ogni richiesta da un wallet USDC, senza alcun account.",
    models:
      "Modelli propri: Venice Uncensored 1.2 e Venice Role Play Uncensored, fine-tune suoi, accanto a versioni abliterated di GLM, DeepSeek, Gemma e Qwen.",
    terms:
      "Termini: vietata la rivendita dell'accesso e l'uso dell'API in contesti ad alto rischio.",
    us: "Su {{appName}} una sola chiave parla OpenAI chat completions, Responses e Anthropic Messages. Claude Code si collega direttamente, modelli di Venice inclusi.",
    apiLink: "API LLM senza censura: ID dei modelli, codice e limiti",
  },
  list: {
    title: "Le {{count}} alternative, una per una",
    intro:
      "Dalle loro pagine, verificate il {{date}}. Cos'è ciascuna, quali modelli ha, cosa permette il suo filtro e cosa succede alle tue chat.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelli:",
    filter: "Filtro:",
    privacy: "Privacy:",
    price: "Prezzo:",
    priceValue: "Piano gratuito: {{free}}. A pagamento: {{plans}}.",
    pro: "Punto forte:",
    con: "Il rovescio:",
    forWho: "Sceglila se:",
    versusLink: "{{appName}} vs {{name}}: confronto completo",
    visit: "Visita {{name}}",
  },
  privacy: {
    title: "Privacy: la carta migliore di Venice",
    intro:
      "Quasi tutti guardano a Venice per la privacy. Ecco come se la cavano gli altri.",
    us: "Su {{appName}} le chat in incognito vivono nella memoria locale del tuo browser, non sui nostri server. Cancella i dati del browser e spariscono.",
    transit:
      "Qualsiasi modello in hosting vede comunque il tuo prompt. Venice, NanoGPT, noi: il messaggio deve arrivare al server che fa girare il modello. Solo uno strumento locale lo tiene sulla tua macchina.",
    callout:
      "Una cronologia sul dispositivo tiene le tue chat lontane dai server di un'azienda. Non le nasconde al modello che scrive le risposte.",
  },
  stay: {
    title: "Quando Venice resta la scelta giusta",
    intro: "A volte l'originale è l'affare migliore.",
    crypto:
      "Possiedi VVV o DIEM, oppure vuoi pagare ogni richiesta API da un wallet USDC senza account. Nessun altro in questa lista lo fa allo stesso modo.",
    versusLink: "{{appName}} vs Venice: il confronto completo",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore alternativa a Venice AI?",
      a: "Dipende da perché te ne vai. Pagamento a consumo e una lista di modelli enorme: NanoGPT. Privacy totale: LM Studio sulla tua macchina. Un modello diretto con una visione del mondo propria: uncensored.ai. Modelli senza censura, aperti e mainstream più i media in una chat e un solo saldo: {{appName}}.",
    },
    free: {
      q: "Esiste un'alternativa gratuita a Venice AI?",
      a: "Sì. Il piano gratuito di Venice offre 10 richieste di testo e 15 di immagini al giorno. FreedomGPT parte gratis e senza account. LM Studio è gratis sul tuo hardware. {{appName}} dà {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account, {{maxCredits}} con la newsletter, modelli senza censura inclusi dopo un'unica conferma dei 18 anni.",
    },
    private: {
      q: "Quale alternativa a Venice è la più privata?",
      a: "Uno strumento locale come LM Studio: il modello gira sul tuo dispositivo e i prompt non lo lasciano mai. Tra le opzioni in hosting, NanoGPT e la modalità incognito di {{appName}} tengono la cronologia nel browser. Qualsiasi modello in hosting vede comunque il prompt a cui risponde.",
    },
    api: {
      q: "Quale alternativa ha un'API senza censura?",
      a: "NanoGPT, uncensored.ai, Gab AI, OpenRouter e {{appName}} offrono tutti API compatibili con OpenAI. Per pesi abliterated solo via API, OpenUncensored e NEAR AI Cloud li vendono a prezzo del provider. La copertura cambia molto: OpenRouter non ha modelli abliterated, NanoGPT ne ha decine. Su {{appName}} qualsiasi piano da {{apiSubPrice}} al mese sblocca l'API.",
    },
    same: {
      q: "Posso usare i modelli di Venice altrove?",
      a: "Alcuni sì. {{appName}} usa {{veniceModels}} modelli tramite Venice, tra cui {{veniceExamples}}, nella stessa chat di Claude, GPT e gli altri. Anche OpenRouter, NanoGPT e OpenUncensored elencano Venice Uncensored.",
    },
    account: {
      q: "Serve un account per provarlo?",
      a: "Non su {{appName}}: la chat in incognito funziona senza. Un account gratuito tiene le chat su tutti i dispositivi e alza la quota gratuita a {{freeCredits}} crediti al mese.",
    },
    noGpuLink: "Un LLM senza censura online, senza GPU",
    apiLink: "API LLM senza censura: ID, codice e limiti",
    openRouterLink: "Alternative a OpenRouter senza censura, a confronto",
  },
  cta: {
    title: "Privato quando vuoi. Senza censura quando serve.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, nessun account. Parti in incognito e scegli qualsiasi modello.",
    start: "Avvia una chat in incognito",
    models: "Confronta tutti i modelli",
  },
};
