import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione server",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  post: {
    title: "Dev.",
    titleShort: "Server Dev",
    description: "Finale di Dev",
    form: {
      title: "Configurazione Dev",
      description: "Configurare i parametri di sviluppo",
    },
    response: {
      title: "Risposta",
      description: "Dati di risposta Dev",
    },
    fields: {
      debug: {
        title: "Modalità di debito",
        description: "Attivare la modalità debug per l'output verbose",
      },
      skipDbSetup: {
        title: "Skip DB Setup",
        description: "Salta i passaggi di configurazione del database",
      },
      skipNextCommand: {
        title: "Salta il comando successivo",
        description: "Saltare in esecuzione Next.js server di sviluppo",
      },
      skipDbReset: {
        title: "Skip DB Reset",
        description: "Salta l'operazione di ripristino del database",
      },

      port: {
        title: "Port",
        description: "Numero di porta per il server di sviluppo",
      },
      skipGeneratorWatcher: {
        title: "Skip Generator Watcher",
        description: "Skip automatico codice generazione orologi",
      },
      generatorWatcherInterval: {
        title: "Intervallo del generatore",
        description: "Intervallo per il generatore di orologi in millisecondi",
      },
      skipTaskRunner: {
        title: "Skip Task Runner",
        description: "Salta l'avvio del sistema task runner",
      },
      skipMigrations: {
        title: "Salta le migrazioni",
        description: "Salta le migrazioni dei database",
      },
      skipMigrationGeneration: {
        title: "Skip Migration Generazione",
        description: "Salta la generazione automatica di migrazione",
      },
      skipSeeding: {
        title: "Skip Seeding",
        description:
          "Salta la visualizzazione del database con i dati iniziali",
      },
      framework: {
        title: "Framework",
        description: "Quadro frontale/bundler da usare",
      },
      profile: {
        title: "Profilo",
        description:
          "Abilitare la profilazione: imposta NEXT_TURBOPACK_TRACING =1 (file di traccia a.next/dev/trace-turbopack) e NEXT_CPU_PROF =1 (scrive.cpuprofile in uscita)",
      },
      success: {
        title: "Operazione riuscita",
      },
      output: {
        title: "Produzione",
      },
      duration: {
        title: "Durata",
      },
      serverUrl: {
        title: "Server URL",
      },
      databaseStatus: {
        title: "Stato della banca dati",
      },
      processes: {
        title: "Processi",
      },
      errors: {
        title: "Errori",
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
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
