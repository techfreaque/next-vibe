import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Framework next-vibe: una definizione per ogni interfaccia",
    description:
      "Framework TypeScript open source. Un file definition.ts genera un’interfaccia web, un comando CLI, uno strumento MCP, una schermata nativa, uno strumento IA e un cron job. Include un’API ospitata compatibile con OpenAI e Anthropic.",
    category: "Framework",
    imageAlt: "Framework next-vibe per sviluppatori",
    keywords:
      "next-vibe, TypeScript quadro, MCP server, CLI, AI strumenti, Zod, Drizzle, OpenAI compatibile API",
  },
  hero: {
    eyebrow: "Open source · MIT + GPL v3",
    title: "Un solo file definition.ts.",
    titleAccent: "Per ogni interfaccia.",
    subtitle:
      "In next-vibe, una definizione di endpoint genera un’interfaccia web, un comando CLI, uno strumento MCP, una schermata nativa, uno strumento IA, un cron job e altre sette interfacce. Stesse regole di convalida e stessi tipi, senza codice di raccordo.",
    ctaQuickstart: "Eseguilo in quattro comandi",
    ctaGithub: "Visualizza su GitHub",
    stat1Label: "endpoint digitati in questo repo",
    stat2Label: "interfacce per endpoint",
    stat3Label: "lingue per stringa",
    stat4Label: "definizione per caratteristica",
  },
  example: {
    eyebrow: "Un vero e proprio endpoint",
    title: "Segui il modulo di contatto.",
    intro:
      "Il punto finale di contatto dal repo, vivere in fondo a questa pagina. Due file da leggere. Sei delle sue tredici superfici sottostanti.",
    source: "Leggi la fonte completa su GitHub",
    live: "Prova la forma live",
    becomes: "Che cosa diventa",
    more: "Più di sette",
    moreSurfaces: {
      webApi: "REST API",
      websocket: "Eventi WebSocket",
      electron: "App Electron",
      adminPanel: "Pannello di amministrazione",
      vibeFrame: "widget incorporabile",
      remoteSkill: "Capacità dell'agente",
      vibeBoard: "Nodo di analisi",
    },
    surfaces: {
      web: {
        title: "Web UI",
        body: "Il modulo in fondo a questa pagina. I campi, la convalida e l'avviso di successo provengono dalla definizione.",
      },
      cli: {
        title: "comando CLI",
        body: "vibe contact-form. Un flag per campo e istruzioni con esempi già inclusi.",
      },
      mcp: {
        title: "Strumento MCP",
        body: "Qualsiasi client MCP può chiamare contact-form tramite vibe mcp. Lo schema di input arriva direttamente da Zod.",
      },
      ai: {
        title: "Strumento AI",
        body: "I modelli possono chiamarlo. requiresConfirmation fa approvare l'utente prima di inviare.",
      },
      native: {
        title: "Schermo nativo",
        body: "L'app Expo rende lo stesso widget con input nativi.",
      },
      cron: {
        title: "Lavoro Cron",
        body: "Ogni endpoint puo' funzionare con un programma. Stesso manubrio, nessun secondo percorso di codice.",
      },
    },
    callsTitle: "Quattro modi per",
    callsBody:
      "Invocazioni vere. Le chiamate CLI, MCP e AI hanno colpito il contatto del gestore sopra. La scheda Cron è un vero e proprio compito programmato dal repo.",
  },
  pattern: {
    eyebrow: "Il modello",
    title: "Una caratteristica è una cartella.",
    subtitle:
      "definition.ts e route.ts sono obbligatori. Widget, email, tabella e traduzioni stanno nella stessa cartella. Non devi aggiornare un registro centrale.",
    deleteLine:
      "Elimina la cartella ed esegui vibe gen. La funzionalità sparisce da tutte le interfacce in una volta.",
  },
  hood: {
    eyebrow: "Sotto il cofano",
    title: "Parti di bordatura, una volta.",
    intro:
      "Il framework possiede la validazione, auth, logging, i18n e in tempo reale. La tua cartella possiede la logica aziendale.",
    platform: {
      title: "Ruoli e piattaforme marcatori",
      body: "allowedRoles decide chi può chiamare un endpoint. I marcatori della piattaforma decidono dove si presenta: AI_TOOL_OFF lo nasconde dai modelli, PRODUCTION_OFF lo tiene fuori produzione. Controllato su ogni superficie.",
    },
    data: {
      title: "Zod, Drizzle, PostgreSQL",
      body: "Zod convalida input e output e genera lo schema di ogni strumento. I repository gestiscono la persistenza con Drizzle. Le migrazioni sono nel repository. L’impostazione predefinita usa PGlite integrato, senza Docker. Se ti serve un Postgres completo, impostalo in DATABASE_URL.",
    },
    realtime: {
      title: "Tempo reale digitato",
      body: "Gli endpoint dichiarano gli schemi degli eventi e gli ambiti dei canali. I client ricevono via WebSocket i token in streaming e l’avanzamento delle attività. Il sistema pub/sub gira nello stesso processo o su Redis.",
    },
    remote: {
      title: "Esempi collegati",
      body: "Le istanze si connettono l'un l'altro, eseguono strumenti su un pari e sincronizzano i dati che permettono. Ogni lato fa rispettare le proprie autorizzazioni. Questo è il modo in cui un'installazione self-hosted utilizza i modelli unbottled.ai.",
    },
  },
  typescript: {
    title: "Niente any, unknown o throw.",
    subtitle:
      "I tipi corrispondono dall’input all’output. vibe check lo verifica prima di ogni rilascio.",
    patterns: {
      any: {
        name: "Niente any",
        description:
          "Dichiara l’interfaccia che usi. Se ti serve any, c’è una lacuna nell’architettura.",
      },
      unknown: {
        name: "Niente unknown",
        description:
          "Vale la stessa regola. unknown rimanda il problema di any a un altro punto del codice.",
      },
      object: {
        name: "Niente object generico",
        description:
          "Definisci la struttura che ti aspetti. object non la specifica.",
      },
      asX: {
        name: "Niente as X",
        description:
          "I cast mentono al compilatore. Fissare i tipi alla fonte invece.",
      },
      throwStatements: {
        name: "no but",
        description:
          "Rispondere a ResponseType <T> tramite successo (dati) o fail({ messaggio, errorType }). Gli errori sono dati.",
      },
      hardcodedStrings: {
        name: "nessuna stringa grezza",
        description:
          "Ogni stringa di interfaccia utente è una chiave di traduzione. L'interiore cattura i letterali.",
      },
    },
    vibeCheck:
      "vibe check esegue Oxlint, ESLint e il controllo TypeScript in parallelo. Il rilascio richiede zero errori.",
  },
  quickstart: {
    eyebrow: "Quickstart",
    title: "Quattro comandi. Poi apri il browser.",
    intro:
      "Da solo, installa, inizia. Una procedura guidata di configurazione gestisce il login dell'amministratore e il tuo provider AI. Nessun file di configurazione da modificare.",
    selfHost: "Guida self-hosting",
    docs: "Docs modello su GitHub",
  },
  api: {
    eyebrow: "Hosting API",
    title: "Oppure chiama semplicemente {{appName}} API.",
    intro:
      "Non è necessario installare. OpenAI e Anthropic compatibili: mantieni il tuo SDK, cambia la base URL e la chiave.",
    endpoints: {
      chat: "OpenAI Chat Completions",
      responses: "OpenAI Responses",
      messages: "Anthropic Messages",
      models: "Elenco modelli con prezzi",
    },
    access:
      "Modelli {{modelCount}} dietro una chiave, fatturati in crediti {{appName}}. Le chiavi API si sbloccano con qualsiasi abbonamento o pacchetto di credito.",
    docs: "Leggi i documenti API",
    keys: "Creare una chiave API",
  },
  examples: {
    eyebrow: "In questo repo",
    title: "Non solo chat AI.",
    subtitle:
      "Interi domini aziendali spediscono in questo repo, ciascuno costruito sullo stesso modello.",
    items: {
      aiPlatform: {
        label: "Piattaforma AI",
        title: "{{appName}}",
        body: "Modelli {{modelCount}}, chat, memoria, agenti, fatturazione e MCP. Questa esatta base di codice, in produzione.",
      },
      commerce: {
        label: "Commercio",
        title: "Prodotti e punto vendita",
        body: "Prodotti, punto vendita, inventario e acquisto.",
      },
      finance: {
        label: "Finanza",
        title: "Contabilità e pagamenti",
        body: "Grafico di conti, tassi fiscali, fatture, pagamenti Stripe e cripto.",
      },
      crm: {
        label: "CRM",
        title: "Contatto e messaggistica",
        body: "Contatto, newsletter, casella di posta elettronica e SMS.",
      },
    },
  },
  maturity: {
    eyebrow: "Stato onesto",
    title: "Che navi oggi.",
    stable: {
      title: "In produzione",
      body: "{{appName}} funziona su questo codebase: web, CLI, MCP, strumenti AI, cron, in tempo reale, pagamenti. La produzione si basa su Next.js. Di default per lo sviluppo locale a TanStack Start e Vite.",
    },
    beta: {
      title: "Beta",
      body: "Ripristinare schermi nativi, sincronizzazione istanza-instance e competenze remote funzionano, con bordi grezzi.",
    },
    honest: {
      title: "Attesa di mandrino",
      body: "Una squadra, che si muove in fretta, giudicata. Ancora niente semver, e i documenti seguono il codice. Perdere un commit o fork esso.",
    },
  },
  contact: {
    eyebrow: "Il punto finale, dal vivo",
    title: "Domande, o costruire qualcosa di grosso?",
    description:
      "Setup, integrazioni personalizzate, recensione architettura. Questa forma è il punto finale di contatto dalla parte superiore della pagina, reso dal quadro.",
  },
  code: {
    copy: "Copia",
    copied: "Affrontato",
    wrap: "WORD",
    terminal: "Terminal",
    cli: "CLI",
    mcp: "MCP",
    ai: "Strumento AI",
    cron: "Cron",
    anthropic: "Anthropic (curl)",
  },
};
