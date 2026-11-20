import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione server",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  tags: {
    start: "Inizio",
  },
  post: {
    title: "Avviare il server di produzione",
    titleShort: "Avviare Server",
    description: "Avviare il server di produzione con pre-task e Next.js",
    form: {
      title: "Avviare la configurazione",
      description: "Configurare i parametri di avvio del server",
    },
    response: {
      title: "Risposta",
      description: "Avviare i dati di risposta",
    },
    fields: {
      skipPre: {
        title: "Skip Pre-tasks",
        description:
          "Saltare l'esecuzione dei pre-task prima di avviare il server",
      },
      skipNextCommand: {
        title: "Skip Next.js Comando",
        description: "Saltare in esecuzione Next.js comando di avvio",
      },
      mode: {
        title: "Modalità server",
        description:
          "Quali sottosistemi da eseguire: tutti (default), web (solo Next.js + WS), attività (solo corridore di rischio)",
        options: {
          all: "Tutti (default)",
          web: "Solo Web (Next.js + WebSocket)",
          tasks: "Compiti solo (cron runner)",
        },
      },
      seed: {
        title: "Esegui la ricerca",
        description: "Esegui il monitoraggio del database sull'avvio",
      },
      dbSetup: {
        title: "Impostazione database",
        description:
          "Eseguire la configurazione del database e le migrazioni all'avvio",
      },
      taskRunner: {
        title: "Funzionalità Runner",
        description: "Avviare il sistema task runner",
      },
      nextServer: {
        title: "Next.js Server",
        description: "Avviare il server Next.js",
      },
      port: {
        title: "Port",
        description: "Numero di porta per il server",
      },
      profile: {
        title: "Profilo",
        description:
          "Abilitare la profilazione: imposta NEXT_CPU_PROF =1 (scrittura.cpuprofile in uscita) per la produzione",
      },
      framework: {
        title: "Framework",
        description: "Struttura/bundler di Frontend per iniziare",
      },
      vibeMode: {
        title: "Modalità di esecuzione",
        description:
          'Override modalità istanza a runtime. "agent" = istanza locale personale. "cloud" = SaaS. \'dev\' = istanza di codifica.',
        options: {
          agent: "Agente (istanza locale personale)",
          cloud: "Cloud (Spiegazione SA)",
          dev: "Dev (istanza di codifica)",
        },
      },
      skipTaskRunner: {
        title: "Skip Task Runner",
        description: "Salta l'avvio del task runner",
      },
      success: {
        title: "Operazione riuscita",
      },
      serverStarted: {
        title: "Avvio del server",
      },
      output: {
        title: "Produzione",
      },
      serverInfo: {
        title: "Informazioni sul server",
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
      tanstackBuildNotFound:
        "Nessun TanStack Start costruito trovato - 'vibe costruire --tanstack' eseguito?",
      tanstackServerExited: "TanStack Start server è uscito immediatamente",
      nextBuildNotFound: "No.next-prod build found - 'vibe build' run?",
      startFailed: "Non è possibile avviare il server",
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
    repository: {
      messages: {
        startingServer: " ⁇  Avvio di server di produzione...",
        environment: "✅ Ambiente: ",
        runningPreTasks: "Esecuzione delle attività pre-start...",
        runningMigrations: "Esecuzione delle migrazioni di database...",
        migrationsCompleted: "✅ Migrazioni di database completate",
        failedMigrations: "Non è riuscito a eseguire migrazioni",
        seedingDatabase: "Vedi il database...",
        seedingCompleted: "✅ Database seeding completato",
        failedSeeding: "Non è riuscito a seminare database",
        startingTaskRunner:
          "Avvio di attività di produzione sistema corridore...",
        failedTaskRunner:
          "Non è riuscito a avviare il task runner di produzione",
        taskRunnerStarted: "✅ Compito di produzione corridore iniziato con ",
        taskRunnerStartedSuffix: " compiti",
        taskRunnerSkipped:
          "Compito di produzione saltato (--bandiera per skip-task-runner utilizzata)",
        skipNextStart:
          "Avvio di skipping Next.js (sarà gestito da package.json)",
        serverWillStart: "Il server di produzione sarà avviato da package.json",
        serverAvailable: "Il server sarà disponibile presso http://localhost:",
        startupPrepared:
          "✅ Avvio del server di produzione preparato con successo",
        failedStart: "Non è possibile avviare il server di produzione: ",
        gracefulShutdown:
          "Grazioso arresto richiesto per il compito di produzione",
      },
    },
  },
};
