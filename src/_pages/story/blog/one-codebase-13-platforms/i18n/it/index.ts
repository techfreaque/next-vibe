import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un solo codice per 13 piattaforme.",
    category: "Architettura",
    description:
      "Come il principio di superficie unificata trasforma tre file in un'app web, il comando CLI, lo strumento MCP, lo schermo nativo e il lavoro di cron automaticamente.",
    imageAlt: "Architettura di superficie unificata next-vibe",
    keywords:
      "next-vibe, superficie unificata, modello endpoint, MCP, CLI, TypeScript, SaaS framework, full-stack",
  },
  readingTime: "12 min lettura",
  category: "Architettura",
  backToBlog: "Torna al blog",

  hero: {
    eyebrow: "Il principio di superficie unificato",
    title: "Un solo codice per 13 piattaforme.",
    subtitle:
      "Come tre file diventano un modulo web, comando CLI, strumento MCP, schermo nativo e lavoro automatizzato contemporaneamente.",
    fileBarLabel: "definition.ts → web · cli · mcp · nativo · cron · 10 più",
    theaCardTitle: "Chi è Thea?",
    fileTreePath: "~/src/explain-to-my-boss/",
    codeBlockLabel: "allowedRoles: [",
    closingBracket: "]",
    vibeCliCommand:
      "vibe analytics/indicators/ema --source=leads_created --period=7",
  },

  intro: {
    hook: "5,802 file TypeScript. ~2,1 milioni di linee. Zero `any`. Errori di tipo runtime zero. Uno schema. Ripeto 374 volte.",
    para1:
      "Questa è la base di codice dietro {{appName}} e la struttura che la alimenta, next-vibe. La stessa architettura gestisce un'app web, un'app mobile, un CLI, un'interfaccia agente AI, un server MCP, un sistema di cron, un bus di eventi websocket e un motore live dataflow.",
    para2:
      "Il principio si chiama Unified Surface. Una volta visto come funziona, sarà difficile tornare indietro.",
  },

  fileTreeSection: {
    title: "Una caratteristica è una cartella",
    intro:
      "Ogni funzione in next-vibe vive in una cartella. Sono necessari tre file. Tutto il resto è facoltativo.",
    fileTree: {
      line1: "explain-to-my-boss/",
      line2: "  ← cosa fa",
      line3: "  repository.ts ← come si fa",
      line4: "  route.ts ← fa esistere ovunque",
      line5: "  widget.tsx ← React UI (opzionale)",
      line6: "  widget.cli.tsx ← terminale personalizzato UI (opzionale)",
    },
    explanation:
      "Ecco. Una cartella. Tre file richiesti. E da quei tre file, quella funzione esiste su fino a 13 piattaforme contemporaneamente.",
  },

  platformsSection: {
    title: "13 piattaforme da 3 file",
    subtitle:
      "Quando si aggiunge una funzione a next-vibe, non diventa solo un endpoint API. Diventa tutto subito.",
    platforms: {
      webApi: {
        label: "Web API",
        description: "endpoint REST, autovalidato, completamente digitato",
      },
      reactUi: {
        label: "Reagisci UI",
        description: "Auto-generato dalla definizione: no JSX scritto",
      },
      cli: {
        label: "CLI",
        description: "Ogni endpoint è un comando con bandiere autogenerate",
      },
      aiTool: {
        label: "AI Tool Schema",
        description:
          "Schema di chiamata della funzione generato automaticamente",
      },
      mcpServer: {
        label: "Server MCP",
        description: "Collegare Claude Desktop, Cursor o qualsiasi client MCP",
      },
      reactNative: {
        label: "React Native",
        description: "Schermi iOS e Android dalla stessa definizione",
      },
      cron: {
        label: "Cron lavoro",
        description: "Pianifica qualsiasi punto finale da eseguire su un timer",
      },
      websocket: {
        label: "WebSocket Eventi",
        description:
          "Spingere gli aggiornamenti ai client connessi al completamento",
      },
      electron: {
        label: "Electron Desktop",
        description:
          "App desktop nativo tramite gli stessi contratti di endpoint",
      },
      adminPanel: {
        label: "Pannello di amministrazione",
        description:
          "admin generato automaticamente UI, nessun codice su misura necessario",
      },
      vibeFrame: {
        label: "VibeFrame Widget",
        description: "widget iframe incorporabile per qualsiasi sito web",
      },
      remoteSkill: {
        label: "Agente Skill",
        description: "Chiamabile da agenti AI come un'abilità strutturata",
      },
      vibeBoard: {
        label: "Nodo Vibe Sense",
        description:
          "Nodo in un grafico del flusso di dati dal vivo: stesso endpoint",
      },
    },
  },

  deleteFolderQuote:
    "Elimina la cartella. La caratteristica cessa di esistere ovunque in una volta.",

  platformMarkersSection: {
    title: "L'accesso alla piattaforma è un array enum",
    para1:
      "Non si scrivono strati di autorizzazione separati per ogni piattaforma. L'accesso alla piattaforma è dichiarato nella definizione stessa: un array enum che ogni piattaforma legge in nativo a runtime.",
    codeComment: "// Questo singolo array controlla dove appare la funzione",
    cliOff: "  CLI_OFF, // blocca lo CLI",
    mcpVisible: "  MCP_VISIBLE, // opta per l'elenco degli strumenti MCP",
    remoteSkill: "  REMOTE_SKILL, // lo mette nel file di abilità dell'agente",
    productionOff: "  PRODUCTION_OFF, // lo disabilita in prod",
    para2:
      "Stessa definizione. Stesso posto. Nessun file di configurazione per sincronizzare. Nessun sistema di autorizzazione separato per piattaforma.",
  },

  noApiSplitQuote:
    "Non c'è API per gli esseri umani e API per AI. C'e' solo lo strumento.",

  demoSection: {
    title: "La demo live: Thea costruisce un endpoint",
    subtitle:
      "Invece di spiegare il modello in modo astratto, lasciate che vi mostri come sembra in pratica.",
    theaIntro:
      "Thea è l'amministratore AI per questa piattaforma. Esegue la produzione 24 ore su 24, 7 giorni su 7, operando attraverso gli stessi contratti di endpoint di ogni utente: stessa validazione, le stesse autorizzazioni, senza backdoor. E può delegare il lavoro a una macchina locale.",
    demoStory:
      "Ho chiesto a Thea di costruire un nuovo endpoint (spiega-to-my-boss) utilizzando Claude Code in esecuzione sul mio PC. Gli dia una decisione tecnica. Ti dà una giustificazione non tecnica che il tuo manager crederà davvero. Ogni sviluppatore ha bisogno di questo.",

    flow: {
      step1: {
        actor: "Tu sei",
        label: "Chiedi a Thea",
        description:
          "Digitare l'attività nella chat: due campi di input, una risposta AI -generata, tutte le piattaforme, MCP_VISIBLE, React personalizzato e widget CLI.",
      },
      step2: {
        actor: "Thea",
        label: "Crea attività",
        description:
          'Thea ragiona ad alta voce, crea un compito con targetInstance = "hermes" (la tua macchina locale), e va inattivo.',
      },
      step3: {
        actor: "Hermes locale",
        label: "Raccoglie il compito",
        description:
          "L'istanza locale si sincronizza ogni 60 secondi. Niente porte aperte. La tua macchina inizia la connessione.",
      },
      step4: {
        actor: "Claude Code",
        label: "Costruisce il punto finale",
        description:
          "Sessione interattiva. Legge i modelli esistenti prima, crea cinque file, esegue il controllo dell'atmosfera. Errori zero.",
      },
      step5: {
        actor: "Claude Code",
        label: "Completamento dei rapporti",
        description:
          "Chiamata completa-task con l'attività ID. Stato: completato. Riepilogo allegato.",
      },
      step6: {
        actor: "Thea",
        label: "Svegliati",
        description:
          "Gli incendi wakeUp. Thea riprende la media conversazione tramite websocket, trasmette la sua risposta, parla TTS.",
      },
      step7: {
        actor: "Risultato",
        label: "Esisti ovunque",
        description:
          "Modulo web. Comando CLI. Strumento MCP. Ripristina lo schermo nativo. Tutti vivi. Da cinque file.",
      },
    },

    proofTitle: "La prova",
    proofPara:
      "Una volta che Claude Code chiamato full-task, esistevano tre cose che non avevano cinque minuti prima:",
    proof1:
      "Un widget React personalizzato: intestazione drammatica, gradiente animato sull'output AI, un punteggio di allineamento aziendale falso.",
    proof2:
      "Un widget CLI: banner ASCII, spinner mentre lo AI pensa, la linea stampata di giustificazione per riga in verde.",
    proof3:
      "Uno strumento MCP (spiega-to-my- boss_POST) perché MCP_VISIBLE era nella definizione. Claude Desktop ora può spiegare le vostre decisioni al vostro capo per conto vostro.",
    proofClosing:
      "Una definizione. Cinque file totali. Tre UI completamente diversi. Il contratto di endpoint non e' cambiato. Solo lo strato di presentazione.",
  },

  underTheHoodSection: {
    title: "Sotto il cofano",
    definitionTitle: "definition.ts: il contratto di vita",
    definitionPara:
      "La definizione non è un generatore di codice. E' un contratto vivente che ogni piattaforma legge in nativo a runtime. Cambialo: tutti gli aggiornamenti. Eliminare la cartella: nulla si rompe a valle. Non c'e' nessun codice generato da pulire.",
    repositoryTitle: "repository.ts: nessun lancio, mai",
    repositoryPara:
      "Le funzioni del repository restituiscono gli errori come dati tipizzati ed espliciti. Chi le chiama può gestirli e l’IA può ragionare sui casi di errore. Niente eccezioni a sorpresa.",
    repositoryCodeComment: "// Restituisce ResponseType <T> - non getta mai",
    routeTitle: "route.ts: l'intero ponte",
    routePara:
      "route.ts cablaggi la definizione al gestore. endpointsHandler si occupa di validazione, auth, registrazione e esposizione a tutte le 13 piattaforme. La vera logica aziendale è una linea.",
    statsTitle: "I numeri",
    statEndpoints: "374 endpoints",
    statEndpointsDetail: "Un modello, applicato 374 volte",
    statAny: "Zero `any`",
    statAnyDetail: "Costretto a tempo di costruzione, non convenzione",
    statLanguages: "Tre lingue",
    statLanguagesDetail:
      "Compile-time check: t(\"typo.here\") è un errore compilatore",
    statsClosing:
      "Non e' una convention. E' fatto rispettare al momento della costruzione.",
  },

  onePatternQuote: "Uno schema. Ripeto 374 volte.",

  vibeSenseTeaser: {
    eyebrow: "Avanti.",
    title: "Vibe Sense: La pipeline è la piattaforma",
    description:
      "Ogni nodo in un grafico Vibe Sense è un endpoint next-vibe regolare. Lo stesso createEndpoint (). La stessa struttura a 3 file. Un indicatore EMA è un punto finale. Un evaluatore di soglia è un punto finale. E perché è un endpoint: puoi chiamarlo dallo CLI, dallo AI, da qualsiasi luogo.",
    calloutLine: "La pipeline è la piattaforma.",
    teaser:
      "Vibe Sense è solo... più endpoint. La stessa cosa, applicata ai dati delle serie temporali. Imbuti di contatto. Economia di credito. Crescita dell'utente. La tua piattaforma si guarda da sola.",
    cta: "Torna al blog",
  },

  closing: {
    title: "Definiscilo una volta. Esiste ovunque.",
    para: "WordPress ha dato a tutti la possibilità di pubblicare. Con next-vibe puoi costruire piattaforme per web, mobile, CLI, agenti IA e automazione. Si monitorano da sole, ragionano sui propri dati e agiscono in base a ciò che trovano.",
    cta: "Star next-vibe su GitHub",
    frameworkCta: "Esplorare next-vibe",
  },
};
