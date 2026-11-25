import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} in self-hosting: il tuo server, ogni modello",
    description:
      "Fai girare {{appName}} sulla tua macchina. git clone, bun i, vibe dev. Accedi con il tuo account {{appName}} e tutti i {{modelCount}} modelli funzionano. Nessuna chiave dei provider.",
    category: "Self-hosting",
    imageAlt: "{{appName}} in self-hosting sulla tua macchina",
    keywords:
      "self-host, self-hosting, chat IA self-hosted, next-vibe, {{appName}}, open source, IA privata, IA locale, IA senza censura",
  },
  hero: {
    badge: "Gratis e open source",
    title: "Il tuo server.",
    titleHighlight: "Ogni modello.",
    subtitle:
      "{{appName}} sulla tua macchina. Accedi con il tuo account {{appName}} e tutti i {{modelCount}} modelli funzionano. Zero chiavi dei provider. Le tue chat non escono mai dal tuo database.",
    ctaStart: "Avvialo ora",
    ctaGithub: "Vedi su GitHub",
  },
  diagram: {
    link: "Un solo accesso",
    instance: {
      label: "Gira da te",
      title: "La tua istanza",
      points: {
        chats: "Chat, memorie e documenti nel tuo Postgres",
        files: "File caricati e media generati sul tuo disco",
        tools: "Thea, i cron job e ogni strumento IA",
        admin: "Il tuo login admin. Le tue regole.",
      },
    },
    account: {
      label: "Gira su {{appName}}",
      title: "Il tuo account",
      points: {
        models: "{{modelCount}} modelli, dai mainstream ai senza censura",
        credits: "Consumo scalato dai tuoi crediti {{appName}}",
        keys: "Zero chiavi dei provider da gestire",
        unlock: "Si sblocca con qualsiasi piano o pacchetto di crediti",
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
          body: "Inserisci email e password di {{appName}}. Con qualsiasi piano o pacchetto di crediti si sbloccano tutti i modelli. Nessuna chiave.",
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
          title: "Le chat restano da te",
          body: "I thread vivono nel tuo database. Si sincronizzano solo se lo attivi tu.",
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
      bill: {
        title: "Il tuo conto, la tua scelta",
        body: "I modelli si pagano con i tuoi crediti {{appName}} o direttamente al tuo provider. Decidi tu.",
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
  includes: {
    title: "Tutto quello che ha il cloud.",
    intro: "Lo stesso codice di {{appName}}. Niente tenuto da parte.",
    items: {
      models:
        "{{modelCount}} modelli di chat, più immagini, video, musica e voce",
      memory: "Memoria persistente e chat in incognito",
      search: "Ricerca web e lettura delle pagine",
      thea: "Thea, la tua admin IA: esegue attività, crea strumenti su richiesta",
      admin: "Dashboard admin e cron job",
      tools: "SSH, automazione del browser e client email come strumenti IA",
    },
  },
  server: {
    eyebrow: "In produzione",
    title: "Portalo su un server.",
    intro:
      "Stesso repo, stessi tre comandi. Poi una build di produzione al posto del server di sviluppo.",
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
    },
  },
  developers: {
    title: "Vuoi costruirci sopra?",
    body: "Ogni funzione è un file di definizione che diventa pagina web, comando CLI, strumento MCP e strumento IA.",
    cta: "Scopri come funziona next-vibe",
  },
  help: {
    title: "Bloccato, o lo installi per un team?",
    description:
      "Aiuto con il setup, installazioni per team, integrazioni su misura. Ogni messaggio lo legge una persona.",
  },
};
