import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "DeepSeek senza censura: DeepSeek abliterated online | {{appName}}",
    description:
      "Dove sta davvero la censura di DeepSeek, perché cambiare host risolve solo metà del problema e quali build senza censura di DeepSeek puoi usare nel browser. Prezzi in tempo reale, niente GPU, niente account.",
    category: "Guida ai modelli",
    imageAlt:
      "DeepSeek senza censura: il DeepSeek originale accanto alle build abliterated",
    keywords:
      "DeepSeek senza censura, DeepSeek uncensored, DeepSeek abliterated, DeepSeek senza filtri, DeepSeek V4.1 Flash Uncensored, censura DeepSeek, DeepSeek Tiananmen, DeepSeek senza censura online, alternativa al jailbreak di DeepSeek, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida ai modelli",
    readTime: "7 min di lettura",
    title: "DeepSeek senza censura. Cosa toglie davvero il filtro.",
    subtitle:
      "{{count}} build senza censura di DeepSeek accanto al DeepSeek originale. Da {{buildPrice}} a messaggio, nel browser.",
  },
  intro: {
    lead: "DeepSeek è veloce, economico e forte sul codice. Fagli la domanda sbagliata e tace, cambia argomento o cancella la sua stessa risposta.",
    p2: "Questo comportamento ha due origini, e quasi tutte le soluzioni ne toccano una sola. Qui sotto: dove sta la censura, i tre modi per aggirarla e le build senza censura di DeepSeek che girano adesso su {{appName}}, con prezzi in tempo reale.",
  },
  where: {
    title: "Dove sta la censura di DeepSeek",
    intro: "Due livelli. Si tolgono in modi diversi.",
    app: "Il livello app. L'app e il sito di DeepSeek aggiungono una moderazione sopra il modello. Le risposte sui temi delicati in Cina si interrompono a metà frase o vengono sostituite da una frase di rito.",
    weights:
      "I pesi. Il modello stesso è stato addestrato a schivare alcuni temi e a rifiutarne altri, come ogni modello mainstream. Questo lo segue ovunque giri.",
    hosts:
      "Altri host. Dato che DeepSeek pubblica i pesi, altre aziende fanno girare lo stesso modello senza il livello app. Le cancellazioni in diretta spariscono. I rifiuti appresi restano.",
    callout:
      "Far girare DeepSeek altrove toglie il filtro dell'app. Solo una build modificata toglie i rifiuti appresi dal modello.",
  },
  ways: {
    title: "Tre modi per avere DeepSeek senza filtro",
    intro: "Dal più faticoso al più semplice.",
    localTitle: "1. Far girare i pesi aperti da te",
    local:
      "I modelli DeepSeek completi sono troppo grandi per una GPU di casa. Quasi tutti i piccoli download con DeepSeek nel nome sono distillati: una base Qwen o Llama addestrata sulle risposte di DeepSeek. Utili, ma sono un altro modello, con altri rifiuti.",
    hostedTitle: "2. Il DeepSeek originale da un altro host",
    hosted:
      "Niente più cancellazioni in diretta, le schivate apprese restano. Ottimo per codice e lavoro quotidiano. Non è la soluzione se il problema sono i rifiuti.",
    buildTitle: "3. Usare una build senza censura",
    build:
      "Qualcuno ha preso i pesi di DeepSeek e ha rimosso il comportamento di rifiuto, di solito con l'abliteration. Stesso modello, stessa velocità, stessa finestra di contesto. Smette di schivare. Ospitato, quindi niente da installare.",
    noGpuLink: "Un LLM senza censura online, senza GPU",
  },
  models: {
    title: "I modelli DeepSeek su questa piattaforma",
    intro:
      "Prima le build senza censura, poi i modelli originali da cui derivano. In tempo reale dal nostro catalogo.",
    colModel: "Modello",
    colContext: "Contesto",
    colStrengths: "Punti forti",
    colPrice: "A messaggio",
    colChat: "Provalo",
    chatLink: "Chatta con {{model}}",
    footnote:
      "Prezzo di un messaggio di riferimento, incluso il nostro ricarico del {{markup}}%. L'etichetta sotto ogni nome dice come è nata la build.",
  },
  builds: {
    title: "Le {{count}} build senza censura di DeepSeek",
    intro: "Stessa famiglia, mani diverse.",
    venice:
      "Servita da Venice.ai, rifiuti rimossi, chiamate agli strumenti intatte. Punti forti: {{strengths}}. Un messaggio di riferimento costa {{price}}.",
    csf: "Una build abliterated dello sviluppatore indipendente jcartu, con ragionamento e chiamate agli strumenti. Punti forti: {{strengths}}. Un messaggio di riferimento costa {{price}}.",
    chatLink: "Chatta con {{model}}",
    abliteration:
      "L'abliteration individua nelle attivazioni del modello la direzione che fa scattare un rifiuto e la rimuove dai pesi. Il resto di ciò che il modello ha imparato resta dov'era. Per questo un DeepSeek abliterated programma ancora come DeepSeek.",
    explainerLink: "Modelli abliterated e senza censura, spiegati",
  },
  compare: {
    title: "Originale contro senza censura, fianco a fianco",
    intro:
      "Contesto, prezzo, punti forti e rifiuti in una pagina. Poi manda a entrambi lo stesso prompt.",
    link: "{{a}} contro {{b}}",
  },
  limits: {
    title: "Cosa una build senza censura non cambia",
    intro: "Togliere i rifiuti risolve un problema. Non tutti.",
    knowledge:
      "Le conoscenze. Il modello sa ciò che c'era nei dati di addestramento. Togliere un rifiuto non aggiunge fatti che non ha mai visto.",
    slant:
      "L'orientamento. L'abliteration toglie i rifiuti, non le inclinazioni dei dati di addestramento. Se vuoi un modello che contraddice il mainstream di proposito: {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, e per questo ha opinioni politiche controcorrente.",
    mistakes:
      "Gli errori. Un modello senza censura sbaglia quanto l'originale. Controlla i fatti che contano.",
    callout:
      "I modelli senza censura si sbloccano dopo una conferma unica di maggiore età. Cosa fai con le risposte lo decidi tu.",
  },
  faq: {
    title: "FAQ",
    censored: {
      q: "DeepSeek è censurato?",
      a: "Sì, su due livelli. L'app di DeepSeek modera le risposte sui temi delicati in Cina, e il modello stesso è stato addestrato a schivare o rifiutare alcune richieste. Gli altri host tolgono il primo livello. Solo una build senza censura toglie il secondo.",
    },
    exists: {
      q: "Esiste un DeepSeek senza censura?",
      a: "Sì. {{appName}} fa girare {{count}} build senza censura di DeepSeek, a partire da {{buildName}}. Mantengono le capacità e la finestra di contesto di DeepSeek e smettono di schivare.",
    },
    local: {
      q: "Posso far girare DeepSeek senza censura in locale?",
      a: "Solo con hardware serio. I modelli completi richiedono molta più memoria di un PC da gaming. I piccoli download di DeepSeek sono per lo più distillati su altre basi. Le build ospitate ti risparmiano la questione hardware.",
    },
    china: {
      q: "DeepSeek senza censura risponde alle domande sulla Cina?",
      a: "Le schivate apprese su questi temi sono proprio il tipo di rifiuto che l'abliteration rimuove. La qualità della risposta dipende comunque da ciò che il modello ha imparato. Fai la stessa domanda a {{stockName}} e a una build senza censura e confronta.",
    },
    api: {
      q: "Posso usare DeepSeek senza censura via API?",
      a: "Sì. Le stesse build girano su endpoint compatibili con OpenAI e Anthropic. Il primo acquisto sblocca le chiavi API, i piani partono da {{apiSubPrice}} al mese.",
    },
    free: {
      q: "Posso provarlo gratis?",
      a: "Sì. {{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account gratuito. Bastano per molti messaggi con le build più economiche.",
    },
    directoryLink: "Tutti i modelli abliterated, con contesto e prezzo",
    bestLink: "Il miglior LLM senza censura, scelto per compito",
    refusalLink: "Refusal Index: chi risponde, chi rifiuta",
  },
  cta: {
    title: "Il cervello di DeepSeek. Senza schivate.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, senza account. Inizia con {{buildName}}.",
    start: "Chatta con DeepSeek senza censura",
    models: "Confronta tutti i modelli",
  },
};
