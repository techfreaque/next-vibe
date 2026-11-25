import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nuovi modelli e nuovi fornitori senza censura | {{appName}}",
    description:
      "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 e nuovi modelli aperti. In più NanoGPT, più modelli Venice e i primi modelli di immagini senza censura.",
    category: "Aggiornamento del modello",
    imageAlt: "Aggiornamento dei modelli di {{appName}} a novembre 2026",
    keywords:
      "{{appName}}, Claude Opus 5.5, GPT-6, Gemini 4 Argon, Grok 4.7, AI non censurato, Venice, NanoGPT, Lustify, Chroma",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Aggiornamento del modello",
    readTime: "5 minuti di lettura",
    title: "I nuovi modelli sono qui. La gamma senza censura si amplia.",
    subtitle:
      "Tutte le principali famiglie passano alla generazione successiva. Si aggiunge un secondo fornitore senza censura. E per la prima volta puoi generare immagini senza filtri.",
  },
  intro: {
    lead: "Il catalogo è di nuovo aggiornato. Sono disponibili {{modelCount}} modelli, di cui {{uncensoredCount}} senza censura.",
    p2: "Non devi fare niente. Aveva un modello piu' vecchio? Le vostre chat si spostano al suo successore da soli.",
  },
  filter: {
    title: "Cosa significa «senza censura» qui",
    intro: "Tre livelli. Scegli tu.",
    p1: "Ogni modello ha un livello di contenuto. I modelli di Mainstream mantengono i filtri del loro fornitore. I modelli aperti sono più sciolti. Modelli non censurati rispondono senza la lezione. Due tipi. La maggior parte dei modelli esistenti con i loro rifiuti rimossi: stessa formazione, stessa visione del mondo, basta smettere di schivare. UncensoredLM è l'altro tipo: addestrato su libri e documenti vietati da internet mainstream, con la sua visione del mondo.",
    p2: "Nessuno sceglie il livello per te. Scegli un modello mainstream per il lavoro, uno non censurato per la domanda che nessun altro risponderà: stessa chat, stesso account.",
    mainstream: "Convenzionale",
    open: "Aperto",
    uncensored: "Senza censura",
    mainstreamBody:
      "I filtri del fornitore rimangono accesi. Predefinizione sicura per il lavoro.",
    openBody: "Pochi rifiuti, ancora qualche guardrails.",
    uncensoredBody:
      "Niente lezioni, niente teatro di rifiuto. La tua chiamata.",
    countLabel: "{{count}} live",
  },
  lineup: {
    title: "La nuova linea",
    intro:
      "Gruppo di famiglia. Le scelte più vecchie in queste famiglie ora si risolvono alle nuove versioni.",
    claude: "Claude",
    claudeNote:
      "La nuova generazione di Anthropic, dal ragionamento profondo alle risposte veloci.",
    gpt: "GPT",
    gptNote: "La famiglia OpenAI GPT-6. Ogni livello ha una variante Pro.",
    gemini: "Gemini",
    geminiNote:
      "La nave ammiraglia di Google più un cavallo da lavoro veloce ed economico.",
    grok: "Grok",
    grokNote: "xAI's più recente: valutato aperto, non mainstream.",
    openModels: "Modelli aperti",
    openModelsNote: "Kimi, DeepSeek, GLM e MiniMax: forte e meno filtrato.",
  },
  uncensored: {
    title: "Uncensored ha ottenuto un vero e proprio aggiornamento",
    intro: "Altri modelli, due fornitori e immagini.",
    veniceTitle: "Venice: la spina dorsale, ampliata",
    veniceBody:
      "Venice gestisce la maggior parte del nostro catalogo non censurato. La sua ammiraglia si trasferì a {{veniceModel}} e un'intera formazione si unì:",
    nanoTitle: "NanoGPT: un secondo percorso",
    nanoBody:
      "Nuovo fornitore. Porta {{glm}} e {{glmFlash}} con un contesto di 1M-token, e serve {{deepseek}} accanto a Venice: più {{mimoAbliterated}}, proprio. Un fornitore inciampa: l'altro raccoglie.",
    imagesTitle: "I primi modelli di immagine non censurati",
    imagesBody:
      "{{lustify}} e {{chroma}}, via Venice. Un credito per immagine. Ogni modello di immagine prima di loro era mainstream o aperto.",
    warning:
      "{{model}} è il modello meno limitato che abbiamo mai elencato. Si siede dietro il livello di contenuto non censurato, si ottiene solo se lo si sceglie.",
  },
  underTheHood: {
    title: "Sotto il cofano",
    intro: "Per le persone che vogliono sapere come funziona lo swap.",
    successorsTitle: "Le vecchie scelte seguono il loro successore",
    successorsBody:
      "Gli ids più vecchi sono ora contrassegnati come eredità: nascosti dal raccoglitore, ancora risolvibile. Scelte e abilità salvate Pinned seguono una mappa del successore al modello attuale, ma solo se quel successore può effettivamente essere servito per voi. Se non puo', la tua scelta originale rimane. Nessun swap silenzioso a un modello non correlato.",
    pricesTitle: "Prezzi che rimangono correnti",
    pricesBody:
      "Ora aggiorniamo prezzi, finestre di contesto e modalità di Venice e NanoGPT senza usare chiavi API. Il vecchio modello Venice si era disattivato perché mancavano i prezzi. Se succede di nuovo, non passerà inosservato.",
    toolsTitle: "Chiamata degli strumenti, onestamente",
    toolsBody:
      "I modelli NanoGPT ottengono chiamate native degli strumenti. Venice Uncensored ha ignorato gli strumenti nativi nei nostri test, quindi mantiene un percorso di strumento ingegnerizzato rapido che funziona.",
  },
  cta: {
    title: "Scegli un modello. Impostare il filtro.",
    subtitle:
      "Ogni modello sopra è live nella chat. Confrontali fianco a fianco, o inizia a parlare.",
    chat: "Avviare una chat",
    models: "Sfoglia tutti i modelli",
  },
};
