import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Claude senza filtri: perché rifiuta, cosa funziona | {{appName}}",
    description:
      "Claude senza censura non esiste. Perché rifiuta, perché jailbreak e siti falsi non reggono e cosa funziona: Claude più modelli senza censura nella stessa chat.",
    category: "Guida ai modelli",
    imageAlt: "Claude accanto a modelli senza censura nella stessa chat",
    keywords:
      "Claude senza filtri, Claude senza censura, Claude uncensored, jailbreak Claude, Claude senza restrizioni, Claude rifiuta, alternativa a Claude per la narrativa, alternativa a Claude senza filtri, alternativa a Claude NSFW, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida ai modelli",
    readTime: "7 min di lettura",
    title: "Claude senza filtri. Perché non esiste e cosa funziona davvero.",
    subtitle:
      "Tieni {{claudeName}} per quello che sa fare meglio. Passa il resto a {{count}} modelli senza livello di rifiuto, nella stessa conversazione.",
  },
  intro: {
    lead: "Claude scrive una delle prose migliori tra tutti i modelli. Sa anche fermarsi a metà scena, aggiungere un avviso che nessuno ha chiesto o trasformare il tuo cattivo in un terapeuta.",
    p2: "Non c'è un interruttore che spenga tutto questo. Ecco perché, cosa non funziona e cosa funziona: {{claudeName}} e modelli senza censura fianco a fianco, una conversazione, un saldo. {{appName}} li ha entrambi.",
  },
  why: {
    title: "Perché Claude rifiuta",
    intro: "Tre motivi, e nessuno è un'impostazione.",
    trained:
      "Appreso. Anthropic addestra i suoi valori dentro il modello stesso. I rifiuti nascono dall'addestramento, non da un filtro che si può spegnere.",
    policy:
      "Regole ovunque. La policy d'uso di Anthropic vale in ogni app e ogni API che offre Claude, compresa la nostra. Un'interfaccia diversa non cambia il modello.",
    closed:
      "Pesi chiusi. Nessuno fuori da Anthropic può modificare Claude. I modelli aperti si possono rendere abliterated, cioè leggermente modificati perché smettano di schivare. Claude no.",
  },
  tricks: {
    title: "Cosa non funziona",
    intro:
      "Ogni settimana gira un trucco nuovo. Hanno tutti gli stessi problemi.",
    jailbreak:
      "I prompt di jailbreak. Vengono corretti, peggiorano la scrittura e aggirare le protezioni viola i termini di Anthropic. Per questo gli account vengono bannati.",
    fiction:
      '"È solo narrativa." Aiuta con il materiale leggero. Fallisce proprio sulle scene che contano.',
    fake: 'I siti "Claude senza censura". O un prompt di jailbreak impacchettato, o un altro modello con il nome di Claude. Non puoi verificare quale dei due.',
    callout:
      "Se un sito promette Claude senza censura, chiedi quale modello risponde davvero. La risposta onesta non è mai Claude.",
    jailbreakLink: "Perché i prompt di jailbreak smettono sempre di funzionare",
  },
  switch: {
    title: "Cosa funziona: cambiare modello a ogni messaggio",
    intro:
      "{{claudeName}} e i modelli senza censura condividono una conversazione. Cambia il modello, la storia resta.",
    steps: {
      draft: {
        title: "Bozza con Claude",
        body: "Scaletta, struttura, dialoghi: le parti in cui {{claudeName}} è forte.",
      },
      switch: {
        title: "Cambia quando si impunta",
        body: "Scegli un modello senza censura per il messaggio successivo. Legge tutta la conversazione e scrive la scena che Claude ha rifiutato.",
      },
      back: {
        title: "Torna per la rifinitura",
        body: "Ripassa il testo a Claude per l'editing quando il contenuto lo permette. Oppure continua senza censura.",
      },
      compare: {
        title: "Confronta sullo stesso prompt",
        body: "Non sai quale voce funziona? Manda un prompt a due modelli e tieni la bozza migliore.",
      },
    },
  },
  models: {
    title: "Claude e i modelli senza censura a confronto",
    intro:
      "Sotto ogni nome: livello di contenuto o metodo di rimozione della censura. In tempo reale dal nostro catalogo.",
    colModel: "Modello",
    colContext: "Contesto",
    colStrengths: "Punti forti",
    colPrice: "A messaggio",
    colChat: "Provalo",
    chatLink: "Chatta con {{model}}",
    footnote:
      "Prezzo di un messaggio di riferimento, incluso il nostro ricarico del {{markup}}%.",
  },
  picks: {
    title: "Quale modello senza censura per quale lavoro",
    intro: "Stessa chat di Claude. Scegli in base al lavoro, non all'hype.",
    long: {
      title: "Lavori creativi lunghi: {{model}}",
      body: "Il Kimi di punta di Moonshot AI, abliterated. Tiene insieme una trama lunga e la ragiona fino in fondo. {{price}} a messaggio.",
    },
    fast: {
      title: "Tuttofare veloce: {{model}}",
      body: "Un modello mainstream leggermente modificato perché smetta di schivare. Rapido, preciso, bravo con prosa e codice. {{price}} a messaggio.",
    },
    contrary: {
      title: "Le opinioni che Claude non esprime: {{model}}",
      body: "{{model}} è addestrato su libri e documenti banditi dall'internet mainstream, e per questo ha opinioni politiche controcorrente. Per personaggi e saggi che vanno contro il consenso. {{price}} a messaggio.",
    },
    roleplay: {
      title: "Personaggi e scene cupe: {{model}}",
      body: "Affinato per il gioco di ruolo. Resta nel personaggio e non esce dalla storia per metterti in guardia. {{price}} a messaggio.",
    },
    cheap: {
      title: "Prime bozze economiche: {{model}}",
      body: "DeepSeek senza rifiuti. Veloce ed economico per scrivere tante bozze. {{price}} a messaggio.",
    },
    compareLink: "{{a}} contro {{b}}",
    writerLink: "Scrittore IA senza censura: la guida completa",
  },
  limits: {
    title: "I limiti, detti onestamente",
    intro: "Niente rifiuti non vuol dire niente compromessi.",
    style:
      "Voci diverse. Ogni modello scrive a modo suo. Provane due sulla stessa scena prima di decidere.",
    mistakes:
      "Stessi errori. I modelli senza censura sbagliano i fatti quanto gli originali. Controlla ciò che conta.",
    claude:
      "Claude resta Claude. Cambiare modello non cambia ciò che Claude scriverà. Semplicemente non sei più vincolato a lui.",
    callout:
      "I modelli senza censura si sbloccano dopo una conferma unica di maggiore età. Decidi tu cosa leggere.",
  },
  faq: {
    title: "FAQ",
    can: {
      q: "Claude può essere senza censura?",
      a: "No. I rifiuti di Claude sono appresi in un modello chiuso, quindi nessuno può rimuoverli. Tutto ciò che viene venduto come Claude senza censura è un trucco di prompt o un altro modello. La vera alternativa sono i modelli aperti con i rifiuti rimossi.",
    },
    jailbreak: {
      q: "È consentito fare il jailbreak di Claude?",
      a: "No. Aggirare le protezioni viola la policy d'uso di Anthropic e può costarti l'account. In più peggiora il testo. Passare a un modello senza livello di rifiuto dà lo stesso risultato senza rischi.",
    },
    best: {
      q: "Qual è la migliore alternativa a Claude per la narrativa?",
      a: "Per narrativa lunga, cupa o esplicita: un modello abliterated come {{firstName}}. Per personaggi che vanno contro il mainstream: {{ownModel}}. Per il gioco di ruolo: un modello affinato per il roleplay. Su {{appName}} sono tutti accanto a Claude.",
    },
    same: {
      q: "Posso usare Claude e un modello senza censura nella stessa chat?",
      a: "Sì. Scegli il modello a ogni messaggio. La cronologia della conversazione passa al modello successivo, quindi quello senza censura riprende esattamente da dove Claude si è fermato.",
    },
    api: {
      q: "Posso chiamare Claude e i modelli senza censura con un'unica API?",
      a: "Sì. Endpoint compatibili con OpenAI e Anthropic, una chiave per Claude e i modelli senza censura. Il primo acquisto sblocca le chiavi API, i piani partono da {{apiSubPrice}} al mese.",
    },
    free: {
      q: "Posso provarlo gratis?",
      a: "Sì. {{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account gratuito, {{maxCredits}} con la newsletter. Modelli senza censura inclusi dopo una conferma unica di maggiore età.",
    },
    chatLink: "Chat IA senza censura: scegli un modello e inizia",
    roleplayLink: "Gioco di ruolo con l'IA senza filtri",
    refusalLink: "Refusal Index: chi risponde, chi rifiuta",
  },
  cta: {
    title: "Tieni la penna di Claude. Togli il freno.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, senza account. Inizia con {{firstName}}.",
    start: "Avvia una chat senza censura",
    models: "Confronta tutti i modelli",
  },
};
