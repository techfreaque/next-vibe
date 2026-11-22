import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Miglior LLM senza censura 2026: scelto per compito | {{appName}}",
    description:
      "Il miglior LLM senza censura per ragionamento, uso quotidiano, coding, narrativa dark, opinioni controcorrente e immagini. GLM 5.3 Uncensored contro DeepSeek V4.1 Flash Uncensored, con contesto e prezzi in tempo reale.",
    category: "Guida ai modelli",
    imageAlt: "I migliori LLM senza censura, ordinati per compito",
    keywords:
      "miglior LLM senza censura, migliore IA senza censura, miglior modello IA senza censura, miglior modello abliterated, LLM senza censura 2026, GLM uncensored vs DeepSeek uncensored, GLM 5.3 uncensored, DeepSeek V4.1 Flash uncensored, miglior modello senza censura per roleplay, miglior modello senza censura per programmare, classifica LLM senza censura, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida ai modelli",
    readTime: "8 min di lettura",
    title: "Il miglior LLM senza censura. Scelto per compito, non per hype.",
    subtitle:
      "Un vincitore per ogni compito tra {{count}} modelli senza censura attivi, più il testa a testa GLM contro DeepSeek. Contesto e prezzo letti in tempo reale dal nostro registro modelli.",
  },
  intro: {
    lead: "Ogni lista dei «migliori LLM senza censura» incorona un solo modello. Poi lo provi sul tuo lavoro ed è quello sbagliato. Un modello che scrive bene narrativa dark non è quello che vuoi per il codice. Il più economico non è quello che vuoi per un ragionamento difficile.",
    p2: "Per questo la lista nomina un vincitore per ogni compito. Ogni scelta gira su {{appName}} in una scheda del browser, ogni numero viene dal nostro registro e puoi passare dall'uno all'altro nella stessa chat.",
  },
  method: {
    title: "Come abbiamo scelto",
    intro:
      "Quattro domande per modello. Nessun punteggio di benchmark inventato.",
    answers:
      "Risponde? Ogni modello qui appartiene al livello senza censura: accetta la domanda invece di farti la predica.",
    base: "Quanto è forte la base? I modelli di punta abliterated conservano l'intelligenza del loro laboratorio. I piccoli fine-tune ne cedono una parte in cambio dello stile.",
    context:
      "Quanto ricorda? Il contesto decide se regge un documento lungo o dimentica la prima pagina.",
    price:
      "Quanto costa? Prezzo per messaggio di riferimento, sulla rotta pubblica più economica, ricarico incluso.",
    callout:
      "Vuoi la prova che un modello risponde? Il nostro indice dei rifiuti fa le stesse domande a ogni modello e conta chi rifiuta.",
    refusalLink: "L'indice dei rifiuti: quale IA risponde davvero",
  },
  picks: {
    title: "I vincitori, compito per compito",
    intro:
      "Un modello per compito, nessuno due volte. Se una scelta va offline, il modello successivo con lo stesso punto forte prende il suo posto.",
    facts:
      "Contesto di {{context}}. {{price}} per messaggio. Punto forte: {{strengths}}.",
    reasoning: {
      title: "{{number}}. Il migliore per ragionamento e analisi: {{model}}",
      body: "Un modello base di punta a cui sono stati tolti i rifiuti. Usalo quando la risposta richiede di pensare davvero: una questione controversa argomentata fino in fondo, un documento lungo smontato pezzo per pezzo, un piano messo sotto stress.",
    },
    everyday: {
      title: "{{number}}. Il migliore per tutti i giorni: {{model}}",
      body: "Veloce, economico e con una memoria enorme. Il modello da lasciare selezionato per le domande normali, le bozze rapide e le chat lunghe che su un modello di punta costerebbero troppo.",
    },
    coding: {
      title: "{{number}}. Il migliore per programmare: {{model}}",
      body: "Indicato per coding e ragionamento, senza i rifiuti che bloccano ricerca sulla sicurezza, scraping o domande di reverse engineering che gli assistenti mainstream evitano.",
    },
    fiction: {
      title: "{{number}}. Il migliore per roleplay e narrativa dark: {{model}}",
      body: "Calibrato per il roleplay, anche dark. Resta nel personaggio, scrive la scena violenta o esplicita e non interrompe la storia per fare la morale.",
    },
    viewpoint: {
      title:
        "{{number}}. Il migliore per le opinioni controcorrente: {{model}}",
      body: "L'unica scelta qui che non è un modello mainstream sbloccato. Addestrato su libri e documenti banditi dall'internet mainstream. Il risultato è un modello con opinioni politiche controcorrente. Chiedigli quello che gli altri non dicono, e verifica i fatti.",
    },
    vision: {
      title: "{{number}}. Il migliore per le immagini: {{model}}",
      body: "Legge le immagini che carichi e risponde senza i soliti rifiuti. Abbastanza economico da usarlo su ogni screenshot.",
    },
  },
  versus: {
    title: "{{a}} vs {{b}}",
    intro:
      "I due modelli di punta abliterated più confrontati. Stessa idea, rifiuti rimossi, punti forti diversi.",
    glm: "{{model}}: la versione abliterated di GLM-5.3. Sceglila quando la risposta richiede profondità: ragionamento, analisi, codice.",
    deepseek:
      "{{model}}: la versione abliterated di DeepSeek V4.1 Flash. Un modello Flash: più economico per messaggio, veloce, indicato anche per il roleplay. Sceglilo per i grandi volumi.",
    verdict:
      "In breve: il lavoro di testa a GLM, volume e roleplay a DeepSeek. Rispondono entrambi. Cambia a metà chat e confrontali sulla tua domanda.",
    compareLink: "Confronto completo: {{a}} vs {{b}}",
  },
  all: {
    title: "Tutti i {{count}} modelli senza censura, dal più economico",
    intro:
      "L'intero livello senza censura di {{appName}} in questo momento. Clicca un modello per la sua pagina o avvia subito una chat.",
    footnote:
      "Per messaggio indica uno scambio di riferimento sulla rotta più economica. Chat lunghe e risposte lunghe costano di più. I punti forti sono tag del registro.",
  },
  table: {
    model: "Modello",
    context: "Contesto",
    strengths: "Punto forte",
    price: "Per messaggio",
    chat: "Provalo",
    chatLink: "Chatta con {{model}}",
  },
  kinds: {
    title: "Due tipi di senza censura. Sappi quale stai scegliendo.",
    intro: "Dietro l'etichetta c'è una differenza vera.",
    abliterated:
      "Versioni abliterated e fine-tuned: modelli mainstream o aperti, leggermente modificati per non schivare più le domande. Stesso addestramento, stessa visione del mondo. Rispondono e basta.",
    own: "{{ownModel}}: addestrato su libri e documenti banditi dall'internet mainstream. Il risultato è un modello con opinioni politiche controcorrente.",
    explainerLink:
      "Cos'è l'abliteration e in cosa si distingue dagli altri metodi",
    tourLink: "Ogni modello senza censura, uno per uno",
  },
  local: {
    title: "In locale o in hosting?",
    intro:
      "Quasi tutte le classifiche danno per scontato che il modello lo fai girare tu. È un'opzione.",
    local:
      "In locale: privacy totale e nessun prezzo per messaggio, ma i modelli grandi chiedono più memoria GPU di quanta ne abbia qualsiasi PC di casa.",
    hosted:
      "In hosting: ogni modello di questa pagina nel browser, compresi quelli di taglia frontier. Il fornitore vede il tuo prompt.",
    api: "API: gli stessi modelli tramite endpoint compatibili con OpenAI e Anthropic. Le chiavi API si sbloccano con qualsiasi acquisto.",
    noGpuLink: "Un LLM senza censura online, senza GPU",
    apiLink: "API per LLM senza censura: ID dei modelli, prezzi, codice",
  },
  pairs: {
    title: "Altri testa a testa",
    intro:
      "Visione del mondo propria contro abliterated, e modelli base contro le loro versioni senza censura.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è il miglior LLM senza censura in assoluto?",
      a: "Per la maggior parte delle domande difficili, {{topModel}}: un modello base di punta a cui sono stati tolti i rifiuti. Per le opinioni controcorrente, {{ownModel}}. Per grandi volumi a basso costo, una versione Flash. Su {{appName}} passi da uno all'altro dei {{count}} nella stessa chat.",
    },
    free: {
      q: "Qual è il miglior LLM senza censura gratuito?",
      a: "Online, {{appName}} ti dà {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account gratuito. Il modello senza censura più economico, {{cheapestModel}}, costa {{cheapestPrice}} per messaggio. I modelli senza censura chiedono una conferma 18+ una tantum.",
    },
    roleplay: {
      q: "Qual è il miglior modello senza censura per il roleplay?",
      a: "Un modello calibrato per il roleplay dark: resta nel personaggio e scrive le scene dure. Per personaggi politici o tabù, {{ownModel}} porta una visione del mondo che i modelli mainstream non hanno.",
    },
    coding: {
      q: "Qual è il miglior modello senza censura per programmare?",
      a: "Una versione abliterated di un buon modello per il codice. Mantiene le capacità del modello base e perde i rifiuti che bloccano la ricerca sulla sicurezza e altre domande che gli assistenti mainstream evitano.",
    },
    quality: {
      q: "I modelli abliterated perdono qualità?",
      a: "Un po', a seconda del metodo. L'abliteration rimuove dai pesi la direzione del rifiuto. Fatta bene, lascia al modello quasi tutte le sue capacità. I piccoli fine-tune possono perdere di più. Confronta un modello base e la sua versione senza censura fianco a fianco prima di decidere.",
    },
    api: {
      q: "Posso usare questi modelli senza censura tramite API?",
      a: "Sì. Ogni modello di testo qui funziona tramite endpoint compatibili con OpenAI e Anthropic. Le chiavi API si sbloccano con qualsiasi acquisto.",
    },
    writerLink: "La migliore IA senza censura per chi scrive narrativa",
    directoryLink: "Tutti i modelli abliterated, in hosting",
    platformsLink: "Piattaforme di IA senza censura a confronto",
  },
  cta: {
    title: "Basta classifiche. Fai la domanda vera.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, nessun account richiesto. Parti dal vincitore e cambia quando vuoi.",
    start: "Chatta con {{topModel}}",
    models: "Confronta tutti i modelli",
  },
};
