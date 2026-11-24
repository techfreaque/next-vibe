import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "AI senza censura gratis: cosa ti danno davvero (2026)",
    description:
      "AI senza censura gratis, verificata: Venice, uncensored.ai, FreedomGPT, Gab AI, NanoGPT, OpenRouter, LM Studio, Ollama e {{appName}}. Limiti, filtri, privacy e trappole.",
    category: "Guida",
    imageAlt: "Le AI senza censura gratis a confronto",
    keywords:
      "AI senza censura gratis, IA senza censura gratis, chat AI senza censura gratis, intelligenza artificiale senza censura gratis, AI senza filtri gratis, AI senza limiti gratis, AI senza censura senza registrazione, AI senza censura in italiano, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida",
    readTime: "8 min di lettura",
    title: "AI senza censura gratis. Cosa vuol dire davvero gratis.",
    subtitle:
      "{{count}} offerte gratuite e {{appName}}, verificate sulle loro pagine di prezzi, filtri e privacy. Con tutti i limiti che la home page non dice.",
  },
  intro: {
    lead: "Gratis e senza censura: lo promettono in tanti. Poi arriva il limite giornaliero dopo tre risposte, il modello base al posto di quello buono, la conferma dell'email prima di qualsiasi credito o un download da 40 GB.",
    p2: "Ecco cosa ti dà davvero gratis ogni offerta, secondo le sue stesse pagine (ultimo controllo il {{date}}). Per trasparenza: compriamo modelli da alcuni di questi fornitori e li offriamo nella nostra chat. Quando gratis danno di più, lo diciamo.",
  },
  short: {
    title: "La risposta breve",
    intro: "Tre righe prima di andare avanti.",
    local:
      "Solo l'AI locale è davvero gratis e senza limiti: Ollama o LM Studio sul tuo computer. Paghi in hardware invece che in soldi.",
    hosted:
      "L'AI senza censura online è sempre gratis con un limite: risposte al giorno, crediti al mese o un solo modello base.",
    us: "Su {{appName}} ricevi {{guestCredits}} crediti gratuiti al mese senza account, per tutti i {{modelCount}} modelli, compresi i {{uncensored}} senza censura.",
  },
  catch: {
    title: "Dov'è la fregatura nell'AI gratis",
    intro: "Cinque punti in cui il gratis costa qualcosa.",
    limit:
      "Il limite: le quote giornaliere spesso finiscono dopo pochi messaggi. In una conversazione lunga ogni risposta conta.",
    models:
      "I modelli: molte offerte gratuite danno solo un modello base o della casa. Quelli forti stanno dietro l'abbonamento.",
    account:
      "L'account: alcuni servizi vogliono un'email confermata prima di qualsiasi credito gratuito. Altri partono subito.",
    data: "I dati: gratis non vuol dire privato. Leggi cosa viene registrato e se le tue chat servono ad addestrare un modello.",
    hardware:
      "L'hardware: in locale un messaggio non costa nulla, ma un buon modello vuole tanta memoria e una scheda grafica potente.",
    callout:
      "Ogni modello online vede il tuo prompt, gratis o a pagamento. Solo un'app locale lo tiene sul tuo dispositivo.",
  },
  table: {
    title: "Tutte le offerte gratuite fianco a fianco",
    intro:
      "Su smartphone scorri di lato. Dati dei fornitori verificati sulle loro pagine, la data è accanto a ogni voce. I dati di {{appName}} arrivano in diretta dalla nostra configurazione.",
  },
  us: {
    title: "Cosa ottieni gratis su {{appName}}",
    intro:
      "Una chat, {{modelCount}} modelli, un solo saldo. Qui gratis vuol dire una quota fissa valida per ogni modello, non solo per il più debole.",
    guest:
      "Senza account: {{guestCredits}} crediti gratuiti al mese. Apri la chat e scrivi. Niente email, niente numero di telefono.",
    account:
      "Con un account gratuito: {{freeCredits}} crediti al mese, {{maxCredits}} con la newsletter. Le chat si salvano su tutti i tuoi dispositivi.",
    models:
      "Tutti i modelli sono inclusi: {{uncensored}} senza censura accanto a Claude, GPT, Gemini e ai modelli aperti. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream. Il risultato è un modello con opinioni politiche controcorrente.",
    consent:
      "Per i modelli senza censura confermi una volta sola di avere almeno 18 anni. Poi nessuno te lo chiede più.",
    after:
      "Quando i crediti finiscono: aspetti il mese dopo o scegli un piano da {{subPrice}} al mese.",
    weak: "Dove gratis siamo più deboli: crediti, non una tariffa flat. Quanti messaggi ti dà la quota dipende dal modello. Ogni pagina modello fa il conto per te.",
    hubLink: "Tutti i modelli senza censura con contesto e prezzo",
    ownLink: "Scopri {{ownModel}}",
  },
  list: {
    title: "Le {{count}} offerte gratuite, una per una",
    intro:
      "Cos'è ognuna, cosa dà gratis, cosa permette il suo filtro e che fine fanno le tue chat.",
    heading: "{{number}}. {{name}}: {{kind}}",
    free: "Gratis:",
    filter: "Filtro:",
    privacy: "Privacy:",
    con: "Il limite:",
    forWho: "Sceglila se:",
    checked: "Verificato il {{date}}.",
    versusLink: "{{appName}} vs {{name}}: il confronto completo",
    visit: "Visita {{name}}",
  },
  local: {
    title: "In locale: l'unica AI senza limiti",
    intro: "Ollama e LM Studio girano sul tuo computer.",
    cost: "Costo: zero per messaggio, nessun limite giornaliero. Paghi una volta l'hardware, poi la corrente.",
    quality:
      "Qualità: il tetto lo decide il tuo computer. I modelli piccoli girano su quasi ogni portatile, quelli grandi vogliono tanta memoria grafica.",
    privacy:
      "Privacy: i prompt non lasciano mai il tuo dispositivo. Di più non si può.",
    link: "Niente computer potente? Modelli senza censura online, senza GPU",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore AI senza censura gratis?",
      a: "Dipende dal tuo dispositivo. Con un computer potente: Ollama o LM Studio, gratis e senza limiti. Nel browser: {{appName}} dà {{guestCredits}} crediti al mese per tutti i modelli, Venice 10 prompt di testo al giorno sui modelli base, uncensored.ai 3 risposte al giorno.",
    },
    noAccount: {
      q: "Esiste un'AI senza censura gratis e senza registrazione?",
      a: "Sì. Su {{appName}} apri la chat in incognito e scrivi, senza account e senza email. Anche FreedomGPT dice che si parte senza carta e senza account. Gab AI concede i crediti gratuiti solo dopo la conferma dell'email.",
    },
    unlimited: {
      q: "Esiste un'AI senza censura gratis e illimitata?",
      a: "Solo in locale. Ollama e LM Studio non costano nulla per messaggio sul tuo hardware. Ogni offerta gratuita online ha un limite, perché qualcuno paga le schede grafiche su cui gira il modello.",
    },
    language: {
      q: "L'AI senza censura risponde in italiano?",
      a: "I modelli grandi rispondono nella lingua in cui scrivi. Scrivi in italiano e ricevi l'italiano. Con i piccoli modelli locali conviene un test veloce, alcuni passano all'inglese nelle risposte lunghe.",
    },
    api: {
      q: "Esiste un'API senza censura gratis?",
      a: "In locale sì: Ollama e LM Studio offrono un server compatibile con OpenAI sul tuo computer. OpenRouter dà 50 richieste gratuite al giorno sui modelli gratuiti, ma quelli senza censura sono pochi. Su {{appName}} qualsiasi acquisto sblocca l'API, piani da {{apiSubPrice}} al mese. I crediti gratuiti valgono solo in chat.",
    },
    legal: {
      q: "L'AI senza censura è legale?",
      a: "Un modello che rifiuta meno non cambia la legge. Ciò che è vietato offline resta vietato in chat, e in più valgono i nostri termini di servizio. Non è una consulenza legale. Se tratti dati sensibili, leggi l'informativa sulla privacy del fornitore o lavora in locale.",
    },
    noSignUpLink: "Chat AI gratis senza registrazione: come funziona",
    kindsLink: "Abliterati, affinati o con una visione propria: i tre tipi",
  },
  cta: {
    title: "Provala gratis. Senza account.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese per ogni modello. Apri una chat in incognito e fai la prima domanda.",
    start: "Chatta gratis",
    models: "Scopri i modelli senza censura",
  },
};
