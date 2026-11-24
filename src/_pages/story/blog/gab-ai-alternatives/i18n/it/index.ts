import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a Gab AI: chat AI senza censura a confronto (2026)",
    description:
      "Confronta Gab AI e Arya con {{appName}}, Grok, Perplexity, Venice e i modelli locali. Scegli per ricerca politica, chat riservate o creatività.",
    category: "Confronto",
    imageAlt: "Alternative a Gab AI messe a confronto",
    keywords:
      "alternativa a Gab AI, alternative Gab AI, siti come Gab AI, Gab AI Arya, Gab AI vs Venice, chatbot AI conservatore, AI senza censura, IA senza censura per la politica, AI senza bias politico, AI libertà di parola, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Confronto",
    readTime: "9 min di lettura",
    title: "Alternative a Gab AI per ricerca, chat e contenuti multimediali",
    subtitle:
      "{{count}} alternative e {{appName}}, confrontate su ciò che dicono i loro termini, prezzi e privacy policy.",
  },
  intro: {
    lead: "Gab AI ha costruito un'AI che parla di politica, cultura e fede senza la predica stile Big Tech. Funziona. Le clausole: niente contenuti per adulti, le tue chat sui suoi server e l'API solo con un piano a pagamento.",
    p2: "Qui sotto: cosa promette davvero Gab AI, dove finisce la sua libertà e {{count}} alternative verificate sulle loro pagine. Gab AI al {{gabDate}}, le altre al {{date}}. Diciamo anche dove battono noi.",
    relation:
      "Per trasparenza: siamo clienti di Gab AI. {{gabAiExamples}} gira su {{appName}} tramite l'API di Gab stessa.",
  },
  gab: {
    title: "Cosa offre Gab AI",
    intro:
      "Dalla home, dalla pagina prezzi, dai termini di servizio, dalla privacy policy e dalla pagina API, letti il {{gabDate}}.",
    models:
      "Modelli: {{gabModels}} modelli in un solo account, da GPT, Claude, Gemini, DeepSeek, Qwen, Kimi, GLM e altri. Arya è il modello di Gab per parlare senza censura di politica, cultura e fede.",
    filter:
      "Filtro: i termini richiedono 18 anni e vietano contenuti osceni, sessualmente espliciti o pornografici, salvo la nudità a scopo educativo o medico. Sistemi automatici possono analizzare i tuoi contenuti per sicurezza e conformità.",
    price:
      "Prezzo: {{gabFree}} crediti di benvenuto dopo la verifica email. Plus costa {{plusMonth}} al mese o {{plusYear}} all'anno con {{plusCredits}} crediti al mese. Plus Premium costa {{premiumYear}} all'anno con {{premiumCredits}} al mese. Pacchetti di crediti da {{gabPackPrice}} per {{gabPackCredits}} crediti, che si riportano.",
    gated:
      "Solo con Plus: Work, la modalità agente, e la voce dal vivo. Nel piano gratuito video e musica richiedono crediti acquistati. L'API richiede un piano Plus o Plus Premium attivo.",
    privacy:
      "Privacy: Gab vede i tuoi prompt e le risposte e conserva la cronologia delle conversazioni. Migliorare i propri modelli è tra le finalità dichiarate. La policy dice di non dare per scontato che passare da Gab rimuova le informazioni identificative. I dati restano finché servono al servizio.",
    apps: "App: web, Mac, Windows, iPhone, iPad, Android e un'estensione del browser.",
    why: "Perché si cerca altrove: si scrive narrativa che i termini di Gab vietano, si vogliono chat fuori da un server, un'API senza abbonamento, o mettere alla prova la risposta di Arya con un'altra visione del mondo.",
    sourceHome: "Home di Gab AI",
    sourcePricing: "Prezzi di Gab AI",
    sourceTerms: "Termini di servizio di Gab AI",
    sourcePrivacy: "Privacy policy di Gab AI",
    sourceApi: "Pagina API di Gab AI",
  },
  split: {
    title: "Libero sulla politica, rigido sui contenuti per adulti",
    intro: "La libertà di Gab AI ha un confine netto. Eccolo.",
    politics:
      "Politica, cultura, fede: Arya risponde senza i giri di parole del mainstream. È il prodotto, e mantiene la promessa.",
    adult:
      "Narrativa per adulti: vietata dai termini. Dark romance, scene esplicite, roleplay per adulti non ricevono aiuto, e sistemi automatici possono analizzare i contenuti per conformità.",
    us: "Su {{appName}} funzionano entrambe: posizioni controcorrente da UncensoredLM o Arya, e narrativa per adulti con i modelli senza censura dopo una conferma unica dei 18 anni. La legge vale comunque.",
    unbiasedLink:
      "Un'AI che sostiene entrambe le parti: modelli a confronto sulla politica",
    writerLink: "Scrittore AI senza censura: narrativa cupa e scene per adulti",
    chanLink: "La skill 4chan: greentext e battute, senza filtri",
  },
  criteria: {
    title: "Cosa confrontare prima di cambiare",
    intro: "Decidono cinque domande.",
    worldview:
      "Visione del mondo: un modello di casa con una linea dichiarata, o più modelli da mettere uno contro l'altro?",
    filter:
      "Filtro: libero solo sulla politica, o anche su narrativa e contenuti per adulti? Chi analizza cosa?",
    privacy:
      "Privacy: dove stanno le tue chat e se servono a migliorare i modelli.",
    price:
      "Prezzo: crediti gratis, abbonamento o pagamento a consumo. E cosa blocca il piano gratuito.",
    api: "API: serve un abbonamento, e quali formati parla?",
  },
  table: {
    title: "Tutti a confronto",
  },
  us: {
    title: "{{appName}}: più visioni del mondo, una chat",
    intro:
      "{{modelCount}} modelli in una chat sola, con un solo saldo. Scegli il modello a ogni messaggio, quindi metti due punti di vista fianco a fianco.",
    models:
      "Modelli: {{uncensored}} senza censura accanto a {{mainstream}} mainstream e {{open}} aperti. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, e ne esce un modello con opinioni politiche controcorrente.",
    arya: "Anche Arya è qui ({{gabAiExamples}}). Chiedi ad Arya, poi fai la stessa domanda a UncensoredLM o a una versione abliterated di GLM nello stesso thread.",
    aryaOff:
      "Versioni abliterated di GLM, DeepSeek e Kimi accanto a Claude, GPT e Gemini. Fai la stessa domanda due volte e confronta.",
    privacy:
      "Privacy: le chat in incognito restano nella memoria locale del browser, senza account. Le chat private si salvano solo nel tuo account.",
    price:
      "Prezzo: {{guestCredits}} crediti gratis al mese senza account, {{freeCredits}} con un account. Piani da {{subPrice}} al mese. I modelli senza censura si sbloccano dopo una conferma unica dei 18 anni.",
    api: "API: gli stessi modelli tramite endpoint compatibili con OpenAI e Anthropic. Qualsiasi piano da {{apiSubPrice}} al mese la sblocca.",
    weak: "Dove siamo più deboli: niente piano forfettario, ogni messaggio costa crediti in base al modello, e Gab elenca {{gabModels}} modelli dove noi ne facciamo girare {{modelCount}}. I pacchetti di Gab funzionano senza piano; i nostri ricaricano un piano attivo e non scadono mai.",
    hubLink: "Chat AI senza censura: tutti i modelli con contesto e prezzo",
    abliteratedLink: "Modelli abliterated da usare nel browser",
    ownLink: "Vedi {{ownModel}}",
    aryaLink: "Vedi Gab AI Arya su {{appName}}",
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
    gab: "Gab AI: prompt, risposte e cronologia restano sui suoi server, e migliorare i modelli è una finalità dichiarata. Raccoglie indirizzo IP e posizione approssimativa.",
    us: "{{appName}} in incognito: le chat vivono nella memoria locale del browser, non sui nostri server. Cancelli i dati del browser e spariscono.",
    local:
      "LM Studio: il modello gira sul tuo computer e il prompt non lo lascia mai. Il prezzo è il tuo hardware.",
    callout:
      "Ogni modello ospitato vede il prompt a cui risponde. Una cronologia sul dispositivo tiene le chat lontane dal server di un'azienda, non dal modello.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore alternativa a Gab AI?",
      a: "Dipende da cosa ti manca. Un modello diretto e controcorrente: uncensored.ai. Cronologia sul dispositivo e un filtro per adulti che Pro può spegnere: Venice. Modelli senza censura più immagini e video in un piano: FreedomGPT. Pagamento a consumo: NanoGPT. Privacy totale: LM Studio. Arya, UncensoredLM e modelli abliterated fianco a fianco in una chat: {{appName}}.",
    },
    free: {
      q: "Esiste un'alternativa gratuita a Gab AI?",
      a: "Sì. FreedomGPT parte gratis senza account, LM Studio è gratis sul tuo hardware. {{appName}} dà {{guestCredits}} crediti gratis al mese senza account e {{freeCredits}} con un account, modelli senza censura inclusi dopo una conferma unica dei 18 anni.",
    },
    arya: {
      q: "Posso usare Arya fuori da Gab AI?",
      a: "Sì. {{appName}} offre {{gabAiExamples}} tramite l'API di Gab: chiedi ad Arya e confronti la risposta con {{ownModel}} o un modello mainstream nello stesso thread.",
      aOff: "Arya è il modello di casa Gab. Su {{appName}} hai {{ownModel}}, addestrato su libri e documenti banditi dall'internet mainstream, più modelli abliterated e mainstream in una chat sola.",
    },
    adult: {
      q: "Gab AI permette contenuti per adulti o NSFW?",
      a: "No. I termini vietano contenuti osceni, sessualmente espliciti o pornografici, e sistemi automatici possono analizzare i contenuti per conformità. NanoGPT non ha un divieto generale di NSFW per adulti, Venice permette agli abbonati Pro di spegnere il filtro per adulti, e {{appName}} apre i modelli senza censura dopo una conferma unica dei 18 anni.",
    },
    private: {
      q: "Quale alternativa è la più privata?",
      a: "Un programma locale come LM Studio: i prompt non lasciano mai il tuo dispositivo. Tra le opzioni ospitate, Venice e l'incognito di {{appName}} tengono la cronologia nel browser. Gab AI conserva la cronologia sui suoi server e indica il miglioramento dei modelli tra le finalità.",
    },
    api: {
      q: "Quale alternativa ha un'API senza censura e senza abbonamento?",
      a: "NanoGPT e OpenRouter fanno pagare a consumo, senza abbonamento. Venice e uncensored.ai vendono crediti API. L'API di Gab AI richiede un piano Plus attivo. Su {{appName}} qualsiasi piano da {{apiSubPrice}} al mese la sblocca.",
    },
    freedomLink: "Alternative a FreedomGPT a confronto",
    kindsLink: "Abliterated, affinato o con una sua visione: i tre tipi",
  },
  cta: {
    title: "Ascolta ogni parte. Poi decidi.",
    subtitle:
      "{{guestCredits}} crediti gratis al mese, senza account. Parti in incognito e fai la stessa domanda a due modelli.",
    start: "Avvia una chat in incognito",
    models: "Vedi i modelli senza censura",
  },
};
