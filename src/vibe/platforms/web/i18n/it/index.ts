import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione server",
  enum: {
    processStatus: {
      running: "Esecuzione",
      stopped: "Non ci sono.",
      error: "Errore",
    },
    environment: {
      development: "Sviluppo",
      production: "Produzione",
      testing: "Testing",
      staging: "Stadi",
    },
    mode: {
      development: "Sviluppo",
      production: "Produzione",
    },
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  build: {
    category: "Gestione server",
    tags: {
      build: "Compilazione",
    },
    post: {
      title: "Creare un'applicazione",
      description:
        "Costruire l'applicazione per la distribuzione di produzione",
      form: {
        title: "Costruire la configurazione",
        description:
          "Configurare le opzioni di configurazione e le impostazioni",
      },
      fields: {
        package: {
          title: "Pacchetto di costruzione",
          description:
            "Costruire il pacchetto prima di costruire l'applicazione",
        },
        skipNextCommand: {
          title: "Skip Next.js Comando",
          description: "Salta in esecuzione Next.js comando di costruzione",
        },
        target: {
          title: "Costruire l'obiettivo",
          description:
            "Specificare l'obiettivo di costruzione (ad esempio, 'produzione', 'staging')",
        },
        skipGeneration: {
          title: "Skip Code Generazione",
          description:
            "Salta la generazione di endpoint API durante la costruzione",
        },
        generate: {
          title: "Codice di Generazione",
          description:
            "Eseguire la generazione di codice durante la costruzione",
        },
        generateEndpoints: {
          title: "Generare gli endpoint",
          description: "Generare i file di endpoint API durante la costruzione",
        },
        generateSeeds: {
          title: "Semi di Generazione",
          description: "Generare i file di seme durante la costruzione",
        },
        nextBuild: {
          title: "Next.js costruire",
          description: "Eseguire Next.js processo di costruzione",
        },
        migrate: {
          title: "Esegui le migrazioni",
          description:
            "Eseguire le migrazioni dei database durante la costruzione",
        },
        seed: {
          title: "Esegui la ricerca",
          description: "Eseguire la semina del database durante la costruzione",
        },
        force: {
          title: "Costruzioni di forza",
          description: "Continua a costruire anche se si verificano errori",
        },
        framework: {
          title: "Framework",
          description: "Struttura/bundler di Frontend per costruire",
        },
        webpack: {
          title: "Utilizzare Webpack",
          description:
            "Utilizzare webpack invece di Turbopack. Utilizzo della memoria inferiore (~7.5 GB vs ~12 GB). Abilitato per impostazione predefinita nella produzione Docker costruisce.",
        },
        skipEndpoints: {
          title: "Skip Endpoints Generazione",
          description: "Salta la generazione di file endpoint",
        },
        skipSeeds: {
          title: "Skip Seeds Generazione",
          description: "Saltare la generazione di file di seme",
        },
        skipProdMigrations: {
          title: "Migrazioni di produzione Skip",
          description:
            "Salta le migrazioni di database in esecuzione per la produzione",
        },
        skipProdSeeding: {
          title: "Salta la produzione Seeding",
          description: "Skip database semina per la produzione",
        },
        runProdDatabase: {
          title: "Esegui operazioni di database di produzione",
          description:
            "Eseguire operazioni di database di produzione dopo la costruzione",
        },
        success: {
          title: "Costruire il successo",
        },
        output: {
          title: "Costruisci l'uscita",
        },
        duration: {
          title: "Durata di costruzione (ms)",
        },
        errors: {
          title: "Costruire gli errori",
        },
        steps: {
          title: "Costruire i passi",
        },
        label: {
          title: "Passo",
        },
        ok: {
          title: "Operazione riuscita",
        },
        skipped: {
          title: "Asciugata",
        },
      },
      errors: {
        validation: {
          title: "Convalida non riuscita",
          description: "Parametri di costruzione non validi forniti",
        },
        network: {
          title: "Errore di rete",
          description:
            "La connessione di rete è fallita durante la costruzione",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per costruire l'applicazione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di costruire l'applicazione",
        },
        notFound: {
          title: "Non trovato",
          description: "Costruisci risorse non trovate",
        },
        server: {
          title: "Errore del server",
          description:
            "Un errore del server interno si è verificato durante la costruzione",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore sconosciuto si è verificato durante la costruzione",
        },
        conflict: {
          title: "Conflitto",
          description: "Ricostruisci il conflitto rilevato",
        },
        nextjs_build_failed: {
          title: "Successivo.js costruire non riuscito",
          description:
            "Il processo di costruzione Next.js è fallito: {{error}}",
        },
      },
      success: {
        title: "Costruzioni completate",
        description: "Creazione di applicazione completata con successo",
      },
      repository: {
        messages: {
          buildStart: " ⁇  Avviare la costruzione dell'applicazione...",
          packageBuildStart: "Pacchetto di costruzione...",
          packageBuildSuccess: "✅ pacchetto costruire completato con successo",
          packageBuildFailed: "La costruzione del pacchetto è fallita",
          buildPrerequisites: "Prerequisiti di costruzione in esecuzione...",
          skipGeneration:
            "Skipping generazione endpoint API (--skip-generazione)",
          generatingEndpoints: "Generando gli endpoint API...",
          generationSuccess: "✅ Generazione di codice completata con successo",
          generationFailed: "La generazione del codice è fallita",
          skipNextBuild:
            "Skipping Next.js costruire (sarà gestito da package.json)",
          buildingNextjs: "Costruzione Next.js applicazione...",
          nextjsBuildSuccess: "✅ Next.js costruire completato con successo",
          nextjsBuildFailed: "Next.js costruzione fallito",
          skipProdDb:
            "Operazioni di database di produzione (--run-prod-database=false)",
          buildFailed: "Individuazione dei risultati",
          schemaGenerationStart: "Generando lo schema del database...",
          schemaGenerationSuccess: "✅ Database schema generazione completata",
          schemaGenerationFailed:
            "La generazione degli schemi di database non è riuscita",
          skipSchemaGeneration:
            "Produzione di schemi di database (--run-prod-database=false)",
          reportsGenerationStart: "Generando tutti i rapporti...",
          reportsGenerationSuccess: "✅ Tutti i rapporti generati con successo",
          reportsGenerationFailed: "La generazione di report è fallita",
          prodDbStart: "Operazioni del database di produzione in esecuzione...",
          prodDbSuccess:
            "Le operazioni del database di produzione completate con successo",
          prodDbFailed: "Produzione fallita durante le operazioni di database",
          prodDbNotReady:
            " ⁇  Questa costruzione è NOT pronto per la distribuzione di produzione",
          deploymentReady:
            " ⁇  La vostra applicazione è pronta per la distribuzione di produzione!",
          dbConnectionError:
            "La connessione del database non è riuscita. Assicurarsi che il database sia in esecuzione e accessibile.",
          dbStartSuggestion:
            "Prova a eseguire 'docker comporre -f docker-compose-dev.yml up -d' per avviare il database",
          nextBuildHandled:
            "✅ Next.js costruzione sarà gestito da filato costruire comando",
          failedProdMigrations:
            "Non è riuscito a eseguire migrazioni di produzione",
        },
      },
    },
  },
  dev: {
    category: "Gestione server",

    post: {
      title: "Dev.",
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
          description:
            "Intervallo per il generatore di orologi in millisecondi",
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
  },
  health: {
    category: "Gestione server",

    tag: "Salute",
    get: {
      title: "Controllo della salute",
      description: "Ottieni lo stato di salute del server e la diagnostica",
      form: {
        title: "Opzioni di controllo della salute",
        description: "Configurare i parametri di controllo della salute",
      },
      fields: {
        detailed: {
          title: "Relazione dettagliata",
          description: "Includi informazioni dettagliate sul sistema",
        },
        includeDatabase: {
          title: "Includere il database",
          description: "Includi i controlli sulla salute del database",
        },
        includeTasks: {
          title: "Includere le attività",
          description: "Includi i controlli sanitari del task runner",
        },
        includeSystem: {
          title: "Includere il sistema",
          description: "Includere le informazioni sulle risorse del sistema",
        },
      },
      response: {
        status: {
          title: "Stato",
          description: "Stato della salute generale",
        },
        timestamp: {
          title: "Timestamp",
          description: "Tempo di controllo della salute",
        },
        uptime: {
          title: "Tempo di percorrenza",
          description: "Server uptime in pochi secondi",
        },
        environment: {
          title: "Ambiente",
          description: "Informazioni sull'ambiente server",
          name: {
            title: "Nome dell'ambiente",
          },
          nodeEnv: {
            title: "Node Ambiente",
          },
          platform: {
            title: "Piattaforma",
          },
          supportsTaskRunners: {
            title: "Supporti Task Runners",
          },
        },
        database: {
          title: "Stato della banca dati",
          description: "Stato di connessione del database",
          status: {
            title: "Stato di connessione",
          },
          responseTime: {
            title: "Tempo di risposta (ms)",
          },
          error: {
            title: "Messaggio di errore",
          },
        },
        tasks: {
          title: "Stato dell'attività",
          description: "Stato del corridore",
          runnerStatus: {
            title: "Stato di Runner",
          },
          activeTasks: {
            title: "Attività attive",
          },
          totalTasks: {
            title: "Compiti totali",
          },
          errors: {
            title: "Contatore di errore",
          },
          lastError: {
            title: "Ultimo errore",
          },
        },
        system: {
          title: "Informazioni sul sistema",
          description: "Informazioni sulle risorse di sistema",
          memory: {
            title: "Utilizzo della memoria",
            description: "Informazioni sulla memoria di sistema",
            used: {
              title: "Memoria usata",
            },
            total: {
              title: "Memoria totale",
            },
            percentage: {
              title: "Utilizzo della memoria %",
            },
          },
          cpu: {
            title: "Utilizzo di CPU",
            description: "Informazioni sul sistema CPU",
            usage: {
              title: "Utilizzo di CPU %",
            },
            loadAverage: {
              title: "Media del carico",
            },
          },
          disk: {
            title: "Utilizzo del disco",
            description: "Informazioni sul disco di sistema",
            available: {
              title: "Spazio disponibile",
            },
            total: {
              title: "Totale spazio",
            },
            percentage: {
              title: "Utilizzo del disco %",
            },
          },
        },
        checks: {
          title: "Controllo della salute",
          description: "Controllo sanitario dei componenti individuali",
          item: {
            title: "Controllo della salute",
            description: "Risultato del controllo sanitario individuale",
            name: {
              title: "Nome di controllo",
            },
            status: {
              title: "Controllare lo stato",
            },
            message: {
              title: "Controllare il messaggio",
            },
            duration: {
              title: "Durata (m)",
            },
          },
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
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Controllo della salute completato con successo",
      },
    },
  },
  start: {
    category: "Gestione server",
    tags: {
      start: "Inizio",
    },
    post: {
      title: "Avviare il server di produzione",
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
          serverWillStart:
            "Il server di produzione sarà avviato da package.json",
          serverAvailable:
            "Il server sarà disponibile presso http://localhost:",
          startupPrepared:
            "✅ Avvio del server di produzione preparato con successo",
          failedStart: "Non è possibile avviare il server di produzione: ",
          gracefulShutdown:
            "Grazioso arresto richiesto per il compito di produzione",
        },
      },
    },
  },
};
