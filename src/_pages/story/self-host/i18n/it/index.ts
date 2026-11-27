import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} self-hosted: AI, contabilità e CRM sul tuo server",
    description:
      "{{appName}} sulla tua macchina. git clone, bun i, vibe dev. Tutti i {{modelCount}} modelli AI con il tuo account {{appName}}, più contabilità, CRM e newsletter. I tuoi dati restano nel tuo database.",
    category: "Self-hosting",
    imageAlt: "{{appName}} in self-hosting sulla tua macchina",
    keywords:
      "self-host, self-hosting, chat IA self-hosted, next-vibe, {{appName}}, open source, IA privata, IA locale, IA senza censura, contabilità self-hosted, ERP open source, CRM self-hosted",
  },
  hero: {
    badge: "Gratis e open source",
    title: "Il tuo server.",
    titleHighlight: "La tua AI. I tuoi conti.",
    subtitle:
      "Avvia {{appName}} sulla tua macchina. Accedi con il tuo account {{appName}} e funzionano tutti i {{modelCount}} modelli. Nessuna chiave dei provider. Contabilità, CRM, newsletter e agenti sono nella stessa app.",
    ctaStart: "Avvialo ora",
    ctaGithub: "Vedi su GitHub",
  },
  diagram: {
    link: "Un solo accesso",
    instance: {
      label: "Gira da te",
      title: "La tua istanza",
      points: {
        chats: "Chat, contabilità e clienti nel tuo Postgres",
        files: "File caricati e media generati sul tuo disco",
        tools: "Thea, i cron job e ogni strumento IA",
        admin: "Il tuo admin, le tue regole.",
      },
    },
    account: {
      label: "Gira su {{appName}}",
      title: "Il tuo account",
      points: {
        models: "{{modelCount}} modelli, addebitati sui tuoi crediti",
        keys: "Zero chiavi dei provider",
      },
    },
  },
  suite: {
    eyebrow: "Cosa installi",
    title: "Molto più di un'app di chat.",
    intro:
      "Un codice. Un database. Un pannello. Ogni modulo è nella stessa installazione.",
    link: "Scopri tutto il gestionale",
    cards: {
      ai: {
        title: "Chat AI",
        body: "{{modelCount}} modelli, memoria, ricerca web e chat in incognito. Più immagini, video, musica e voce.",
      },
      agents: {
        title: "Un agente che lavora",
        body: "Thea, l'agente integrato, esegue attività programmate e usa SSH, un browser e la tua email come strumenti.",
      },
      books: {
        title: "Contabilità ed ERP",
        body: "Libro mastro in partita doppia, fatture attive e passive, acquisti, magazzino e cassa.",
      },
      customers: {
        title: "Clienti",
        body: "CRM con import CSV, newsletter con doppio opt-in, un'unica casella per email, SMS, Telegram e WhatsApp.",
      },
      payments: {
        title: "Pagamenti",
        body: "Checkout con Stripe e cripto per piani in abbonamento, con webhook e rimborsi.",
      },
      build: {
        title: "Funzioni tue",
        body: "Un file di definizione diventa pagina web, comando CLI, strumento MCP e strumento AI.",
      },
    },
  },
  start: {
    eyebrow: "Installazione",
    title: "Clona. Installa. Avvia.",
    intro:
      "Tre comandi nel terminale. Tutto il resto succede nel browser. Nessun file di configurazione da toccare.",
    terminal: {
      eyebrow: "Nel terminale",
      title: "Avvia la tua istanza",
      copyAll: "Copia tutto",
      copy: "Copia",
      copied: "Copiato",
      rows: {
        clone: "Scarica il codice",
        cd: "Entra nella cartella",
        install: "Installa. Mette anche vibe nel tuo PATH.",
        dev: "Avvia. Database e dati iniziali si configurano da soli.",
      },
      facts: {
        docker: "Niente Docker",
        postgres: "Niente installazione di Postgres",
        config: "Niente .env da sistemare",
      },
      troubleshoot: {
        notFound: {
          problem: "vibe: command not found?",
          fix: "Apri un nuovo terminale oppure lancia",
        },
        port: {
          problem: "Porta 3000 occupata?",
          fix: "Usa un'altra porta:",
        },
      },
    },
    prereqs: {
      summary: "Macchina nuova? Prima installa git e Bun",
      body: "Una volta per macchina. Ti servono git e Bun 1.3 o successivo. Scegli il tuo sistema.",
      newTerminal:
        "Poi apri un nuovo terminale, così git e bun sono nel tuo PATH.",
    },
    browser: {
      eyebrow: "Nel browser",
      title: "Il resto lo fa la procedura guidata",
      recommended: "Consigliato",
      steps: {
        open: {
          title: "Apri {{url}}",
          body: "Un'istanza nuova apre da sola la configurazione guidata. Clicca su «Avvia la configurazione».",
        },
        admin: {
          title: "Crea il tuo login admin",
          body: "La tua email, la tua password. Sostituisce l'accesso predefinito. Le chiavi di sicurezza sono già generate.",
        },
        ai: {
          title: "Collega il tuo account {{appName}}",
          body: "Inserisci email e password di {{appName}}. Fatto.",
        },
        extras: {
          title: "Extra, quando servono",
          body: "Email, pagamenti Stripe, storage S3. Tutto opzionale. Salta e torna dopo.",
        },
      },
      done: "Chiudi la configurazione. Inizia a chattare.",
    },
  },
  ai: {
    eyebrow: "Collega l'IA",
    title: "Un accesso. Ogni modello.",
    intro: "La tua istanza fa girare l'app. {{appName}} fa girare i modelli.",
    account: {
      badge: "Consigliato",
      title: "Il tuo account {{appName}}",
      body: "Accedi una volta nella procedura guidata. Ogni chat gira sulla tua istanza, ogni chiamata ai modelli gira su {{appName}} e scala i tuoi crediti.",
      points: {
        models: {
          title: "{{modelCount}} modelli",
          body: "Mainstream, open e senza censura. Lo stesso catalogo di {{appName}}.",
        },
        local: {
          title: "La cronologia resta da te",
          body: "I thread stanno nel tuo database. Solo le chiamate ai modelli passano da {{appName}}. La sincronizzazione resta spenta finché non la attivi.",
        },
        sync: {
          title: "Il tuo setup ti segue",
          body: "Memorie, documenti, skill e preferiti si sincronizzano di default. Un interruttore ciascuno.",
        },
        paid: {
          title: "Basta un acquisto qualsiasi",
          body: "Un abbonamento o un pacchetto di crediti. Fino a tre istanze per account.",
        },
      },
      cta: "Crea il tuo account {{appName}}",
      pricing: "Vedi i piani",
    },
    claude: {
      title: "Claude Code su questa macchina",
      body: "Hai fatto login con la CLI claude? La procedura lo rileva. I modelli Claude girano sul tuo abbonamento Claude. Niente da inserire.",
    },
    keys: {
      title: "Le tue chiavi dei provider",
      body: "Senza account {{appName}}. Incolla una chiave nello stesso passaggio e paghi direttamente il provider.",
      providers: {
        openrouter: "OpenRouter",
        venice: "Venice AI",
        nanogpt: "NanoGPT",
      },
      cta: "Ottieni una chiave OpenRouter",
    },
  },
  own: {
    eyebrow: "Il tuo server, le tue regole",
    title: "Il tuo stack. Il tuo filtro.",
    subtitle:
      "Il tuo Postgres, i tuoi file, i tuoi log. Scegli tu i modelli e quanto filtro c'è tra te e loro.",
    cards: {
      api: {
        title: "Anche la tua API",
        body: "Ogni modulo è un comando CLI e uno strumento MCP sulla tua istanza. Automatizzalo o collegaci il tuo agente.",
      },
      filter: {
        title: "Il tuo livello di filtro",
        body: "Modelli mainstream, open o senza censura. Decidi per skill e per thread. Nessun ufficio policy di mezzo.",
      },
      code: {
        title: "Codice aperto, nessun vincolo",
        body: "Lo stesso codice di {{appName}}, pubblico su GitHub. Leggilo, modificalo, fanne un fork.",
      },
    },
  },
  server: {
    eyebrow: "In produzione",
    title: "Portalo su un server.",
    intro:
      "Stesso clone, stessa installazione. Poi una build di produzione al posto del server di sviluppo.",
    terminalTitle: "Sul tuo server",
    rows: {
      start: "Primo avvio: build di produzione",
      update: "Dopo aver scaricato modifiche: aggiornamento senza downtime",
    },
    points: {
      proxy: "Punta Caddy o nginx sulla porta 3000 per l'HTTPS.",
      env: "Alla prima visita la stessa procedura guidata. Preferisci le variabili d'ambiente? Impostale nel deploy e riavvia.",
      connect:
        "Colleghi il tuo account {{appName}} dal server esattamente come dal portatile.",
      db: "Postgres integrato (PGlite) di default. In produzione punta DATABASE_URL sul tuo Postgres.",
    },
  },
  developers: {
    title: "Vuoi costruirci sopra?",
    body: "Ogni modulo è normale TypeScript nel repository. Fanne un fork, estendilo o scrivine uno tuo.",
    cta: "Scopri come funziona next-vibe",
  },
  help: {
    title: "Bloccato, o lo installi per un team?",
    description:
      "Aiuto con il setup, installazioni per team, integrazioni su misura. Ogni messaggio lo legge una persona.",
  },
};
