import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  summary:
    "{{appName}} è una piattaforma di chat AI con modelli di chat {{modelCount}} da laboratori {{providerCount}}: mainstream, aperto e non censurato. Scegli il livello di filtro per chat. Paga per uso con crediti. Open source e self-hostable.",
  intro:
    "Chat, immagine, video, musica, voce e modelli di trascrizione su un unico saldo di credito. Usali nel browser, dalla riga di comando, come server MCP o tramite OpenAI e Anthropic compatibili API. Costruito su next-vibe, un framework open source TypeScript dove una definizione endpoint diventa il web UI, il comando CLI, lo strumento AI e lo strumento MCP.",
  facts: {
    heading: "Fatti chiave",
    models:
      "Modelli: modelli di chat {{modelCount}} (Green {{mainstream}}, {{open}} open, {{uncensored}} uncensored) da laboratori {{providerCount}}, oltre a immagini {{mediaCount}}, video, musica, linguaggio e modelli di trascrizione.",
    free: "Crediti gratuiti ogni mese: {{guest}} senza un account, {{signedIn}} con un account gratuito, {{max}} con un account gratuito e un abbonamento alla newsletter confermato. Non c'e' bisogno di una carta.",
    paid: "Piani a pagamento: {{plans}}. Ogni piano è disponibile anche con fatturazione annuale al prezzo di 11 mesi (Starter: {{subYearPrice}} all’anno). Gli abbonati possono ricaricare con un pacchetto da {{packCredits}} crediti per {{packPrice}}, pagato una sola volta. I crediti del pacchetto non scadono mai.",
    planItem: "{{name}} {{price}} al mese per i crediti {{credits}}",
    credit:
      "1 credito = {{creditValue}}. Ogni pagina del modello elenca il suo prezzo per messaggio.",
    api: "API: Completamenti di chat OpenAI, Risposte OpenAI e formati di messaggi Anthropic su una base URL ({{apiBaseUrl}}). La stessa chiave chiama i modelli di media {{mediaCount}} attraverso gli endpoint OpenAI -format: /v1/images/generations, /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions, /v1/audio/translations, /v1/videos, /v1/music (video e musica funzionano come lavori asincroni). Ha bisogno di un conto a pagamento: qualsiasi piano, da {{subPrice}} al mese. Conti gratuiti ottengono HTTP 402.",
    uncensored:
      "Tier non censurato: due tipi di modelli. Modelli abliterati sono modelli mainstream modificati in modo da smettere di fare domande. Modelli veramente non censurati come UncensoredLM sono formati su libri e documenti vietati da internet mainstream, che dà loro opinioni politiche contrarie. Il livello non censurato ha bisogno di una conferma di una volta 18+.",
    openSource:
      "Open source: il codice dell'app è autorizzato da MIT, il core framework next-vibe è GPL-3.0. Codice sorgente: {{repoUrl}}",
    referral:
      "Programma di riferimento: {{direct}} % commissione ricorrente sui pagamenti rifatti, più un pool {{upline}}% condiviso attraverso i livelli di upline {{levels}}. Pagato come crediti o BTC / USDC, pagamento minimo {{minPayout}}.",
    languages:
      "Lingue del sito: inglese ({{en}}), tedesco ({{de}}), polacco ({{pl}}), francese ({{fr}}), italiano ({{it}}) e spagnolo ({{es}}).",
  },
  pages: {
    heading: "Pagine principali",
    models: "Modelli",
    modelsDesc:
      "ogni modello con prezzo per messaggio, finestra di contesto, confronto di livello e testa a testa",
    pricing: "Prezzo",
    pricingDesc: "crediti gratuiti, i quattro piani e i pacchetti di ricarica",
    api: "Documenti API",
    apiDesc:
      "base URL, autenticazione, chat e endpoint multimediali, campioni di codice",
    blog: "Blog",
    blogDesc: "guide, comparazioni di modelli e note di costruzione",
    partners: "Partner",
    partnersDesc: "programma per creatori, newsletter e directory",
    earn: "Programma di riferimento",
    earnDesc: "come funzionano le commissioni e i pagamenti",
    selfHost: "Self-host",
    selfHostDesc: "eseguire la propria istanza sul proprio hardware",
    framework: "Quadro next-vibe",
    frameworkDesc: "lo stack open source dietro {{appName}}",
    refusalIndex: "Indice di rifrazione",
    refusalIndexDesc:
      "le stesse domande a ogni modello, ogni settimana: chi risponde, chi siepi, chi rifiuta",
    skills: "Skill",
    skillsDesc:
      "specialisti e personaggi pronti, ognuno con il proprio prompt, modello e strumenti",
    help: "Aiuto",
    helpDesc: "FAQ e contatto",
  },
  compare: {
    heading: "Confronti",
  },
  blog: {
    heading: "Blog post",
  },
  optional: {
    heading: "Facoltativo",
    full: "Versione completa",
    fullDesc: "questo file più l'elenco completo dei modelli",
    sitemap: "Mappa del sito",
    sitemapDesc: "ogni pagina pubblica in ogni lingua",
    about: "Informazioni su di noi",
    privacy: "Informativa sulla privacy",
    terms: "Termini di servizio",
    imprint: "Imprint",
  },
  full: {
    chatHeading: "Modelli di chat",
    chatIntro:
      "Modelli di chat attuali. Il prezzo per messaggio è per un normale giro di chat (token di ingresso {{inputTokens}}, token di uscita {{outputTokens}}) sul fornitore più economico.",
    chatLine:
      "{{lab}}, {{tier}}, contesto di token {{context}}, circa crediti {{credits}} per messaggio",
    legacyHeading: "Modelli di chat più vecchi, ancora disponibili",
    legacySuccessor: "sostituito da {{successor}}",
    mediaHeading: "Modelli multimediali",
    mediaLine: "{{lab}}, {{type}}",
    mediaTypes: {
      image: "generazione immagine",
      video: "generazione video",
      audio: "generazione musicale",
      tts: "testo a discorso",
      stt: "discorso al testo",
    },
  },
};
