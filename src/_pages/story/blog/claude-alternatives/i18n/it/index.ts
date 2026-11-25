import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a Claude: con e senza filtri (2026)",
    description:
      "Claude finisce i limiti di utilizzo e rifiuta la narrativa. Confronta {{appName}}, ChatGPT, Gemini, Grok, DeepSeek, Kimi, Venice, NanoGPT, OpenRouter e app locali su prezzo e filtri.",
    category: "Confronto",
    imageAlt: "Le alternative a Claude, con e senza filtri, a confronto",
    keywords:
      "alternative a Claude, alternativa a Claude, alternativa a Claude AI, siti come Claude, alternativa a Claude senza limiti, alternativa a Claude senza filtri, alternativa a Claude senza censura, Claude alternatives, Claude vs ChatGPT, Claude vs Gemini, alternativa a Claude Pro, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Confronto",
    readTime: "10 min di lettura",
    title: "Alternative a Claude, con e senza filtri",
    subtitle:
      "{{count}} alternative e {{appName}}, dagli assistenti mainstream ai modelli senza censura. Verificate sulle loro pagine il {{date}}.",
  },
  intro: {
    lead: "Claude è tra i migliori in assoluto a scrivere e programmare. Finisce anche i messaggi nel momento peggiore, e la sua policy d'uso vieta la chat erotica su ogni piano.",
    p2: "Le alternative sono quindi di due tipi: altri assistenti mainstream per quando arrivi al limite, e modelli senza censura per quello che Claude rifiuta. Ecco entrambi, verificati il {{date}}. Anche noi facciamo girare Claude, quindi diciamo dove vince ancora.",
  },
  subject: {
    title: "Claude oggi",
    intro: "Dalle pagine di Anthropic su prezzi, policy d'uso e privacy.",
    plans:
      "Prezzo: gratuito con limiti che si azzerano ogni 5 ore e ogni settimana. A pagamento: {{plans}}. Anthropic non pubblica il numero esatto di messaggi, e ha confermato che stringe i limiti nelle ore di punta dei giorni feriali.",
    filter:
      "Filtro: la policy d'uso vieta i contenuti sessualmente espliciti e la chat erotica, e i contenuti che esaltano la violenza esplicita. Non esiste un piano per adulti.",
    privacy:
      "Privacy: scegli tu se le chat addestrano il modello. Con l'addestramento attivo, le chat anonimizzate restano conservate fino a cinque anni. Disattivato, 30 giorni.",
    extra:
      "Media: nessuna generazione di immagini o video. Claude disegna grafici e diagrammi dal codice e ha la modalità vocale.",
  },
  why: {
    title: "Perché si cerca altrove",
    intro: "Quattro motivi, ognuno da una fonte pubblica.",
    limits:
      "Limiti di utilizzo. A marzo 2026 Anthropic ha confermato che accorcia i limiti di 5 ore nelle ore di punta.",
    refusals:
      "Rifiuti. I modelli Claude più recenti si oppongono alle premesse narrative e fraintendono le intenzioni.",
    adult:
      "Nessun piano per adulti. La chat erotica è vietata su ogni piano, in ogni app.",
    price:
      "Prezzo. Più utilizzo significa Max a 100 USD o Ultra a 200 USD al mese.",
  },
  criteria: {
    title: "Cosa confrontare prima di cambiare",
    intro: "Decidono cinque domande.",
    one: "Qualità: scrittura, codice e ragionamento sui tuoi compiti, non sui benchmark.",
    two: "Limiti: tetti ai messaggi, finestre di reset, o pagamento a consumo senza tetto.",
    three: "Filtro: cosa rifiuta il modello, e se puoi sceglierne un altro.",
    four: "Privacy: impostazioni di addestramento, conservazione dei dati e cosa resta sul tuo dispositivo.",
    five: "Extra: immagini, video, ricerca web, un'API, e il prezzo di ciascuno.",
  },
  table: {
    title: "Tutte fianco a fianco",
  },
  us: {
    title: "{{appName}}: Claude più modelli senza le sue regole",
    intro:
      "{{modelCount}} modelli in una chat, Claude compreso. Cambi modello a ogni messaggio e tieni il thread.",
    models:
      "Modelli: {{uncensored}} senza censura accanto a {{mainstream}} mainstream e {{open}} aperti. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, con il risultato di un modello con opinioni politiche controcorrente.",
    fit: "Nessuna finestra di 5 ore: paghi a messaggio da un solo saldo, quindi vai avanti finché hai crediti. Immagini, video e musica usano lo stesso saldo.",
    privacy:
      "Privacy: le chat in incognito restano nella memoria locale del tuo browser, senza account.",
    price:
      "Prezzo: {{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account. Piani: {{planList}}.",
    api: "API: endpoint compatibili OpenAI e Anthropic, Claude compreso. Qualsiasi acquisto la sblocca.",
    weak: "Dove vince Claude: Claude Code, Projects e Cowork sono app di Anthropic, e un uso quotidiano intenso di Claude stesso costa meno con un piano Claude che a messaggio con il nostro ricarico del {{markup}}%. Anche su {{appName}} Claude segue la policy di Anthropic.",
    ownLink: "Guarda {{ownModel}}",
    directoryLink: "Tutti i modelli abliterated, con contesto e prezzo",
  },
  list: {
    title: "Le alternative documentate, una per una",
    intro:
      "Le piattaforme con un profilo completo nei nostri dati di confronto, verificate sulle loro pagine. ChatGPT, Gemini, Grok e gli altri assistenti sono nella tabella qui sopra.",
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
    title: "Quando Claude resta la scelta giusta",
    intro: "Per molto lavoro lo è.",
    one: "Programmi tutto il giorno in Claude Code e il piano lo copre.",
    two: "Vivi in Projects e vuoi le app di Anthropic su ogni dispositivo.",
    three:
      "Quello che scrivi non tocca mai contenuti vietati dalla sua policy.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore alternativa a Claude?",
      a: "Come assistente generale: ChatGPT o Gemini. Per ricerche con fonti: Perplexity. Per modelli aperti con meno rifiuti: Kimi, GLM o DeepSeek. Per modelli senza censura accanto a Claude nello stesso thread: {{appName}}.",
    },
    free: {
      q: "Esiste un'alternativa gratuita a Claude?",
      a: "ChatGPT, Gemini, Grok, DeepSeek e Mistral hanno tutti piani gratuiti con limiti. LM Studio e Ollama sono gratuiti sul tuo hardware. {{appName}} dà {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account, Claude compreso.",
    },
    filter: {
      q: "Esiste un Claude senza censura?",
      a: "No. I pesi di Claude sono chiusi e la sua policy vale ovunque. Quello che funziona è un altro modello per le scene che Claude rifiuta. Su {{appName}}, {{uncensored}} modelli senza censura si sbloccano dopo una conferma 18+ una tantum, nello stesso thread di Claude.",
    },
    privacy: {
      q: "Quale alternativa a Claude è la più privata?",
      a: "Un modello locale in LM Studio o Ollama non manda il tuo prompt da nessuna parte. Tra i servizi in hosting, cerca la possibilità di escludere l'addestramento e una conservazione breve. La modalità incognito di {{appName}} tiene la cronologia della chat nel tuo browser.",
    },
    move: {
      q: "Posso continuare a usare Claude dopo il cambio?",
      a: "Sì. {{appName}}, OpenRouter, NanoGPT e Poe offrono tutti i modelli Claude. Usa Claude per ciò che fa meglio e cambia modello per il resto.",
    },
  },
  cta: {
    title: "Tieni Claude. Abbatti i muri.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, nessun account. Claude e modelli senza censura in una chat.",
    start: "Avvia una chat in incognito",
    models: "Confronta tutti i modelli",
  },
};
