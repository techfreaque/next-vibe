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
    build: "Compilazione",
  },
  post: {
    title: "Creare un'applicazione",
    titleShort: "Costruire l'app",
    description: "Costruire l'applicazione per la distribuzione di produzione",
    form: {
      title: "Costruire la configurazione",
      description: "Configurare le opzioni di configurazione e le impostazioni",
    },
    fields: {
      package: {
        title: "Pacchetto di costruzione",
        description: "Costruire il pacchetto prima di costruire l'applicazione",
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
        description: "Eseguire la generazione di codice durante la costruzione",
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
      vibeMode: {
        title: "Modalità di esecuzione",
        description:
          "Cuocere la modalità di istanza nel bundle Next.js. 'agent' = istanza locale personale. 'cloud' = distribuzione SaaS. 'dev' = istanza di codifica (default). Sovrascrive NEXT_PUBLIC_VIBE_MODE in.env.",
        options: {
          agent: "Agente (istanza locale personale)",
          cloud: "Cloud (Spiegazione SA)",
          dev: "Dev (codifica istanza, default)",
        },
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
        description: "La connessione di rete è fallita durante la costruzione",
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
        description: "Il processo di costruzione Next.js è fallito: {{error}}",
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
        packageBuildFailed: "Il pacchetto non è riuscito: {{error}}",
        buildPrerequisites: "Prerequisiti di costruzione in esecuzione...",
        skipGeneration:
          "Skipping generazione endpoint API (--skip-generazione)",
        generatingEndpoints: "Generando gli endpoint API...",
        generationSuccess: "✅ Generazione di codice completata con successo",
        generationFailed: "La generazione del codice è fallita",
        generationFailedDetail:
          "La generazione del codice è fallita: {{error}}",
        tanstackBuildStart: "Costruzione TanStack Start (SSR)...",
        tanstackBuildSuccess:
          "✅ TanStack Start (SSR) costruire completato con successo",
        tanstackBuildFailed: "TanStack Start costruzione fallito",
        tanstackBuildFailedDetail:
          "TanStack Start costruzione fallito: {{error}}",
        skipNextBuild:
          "Skipping Next.js costruire (sarà gestito da package.json)",
        buildingNextjs: "Costruzione Next.js applicazione...",
        nextjsBuildSuccess: "✅ Next.js costruire completato con successo",
        nextjsBuildFailed: "Next.js costruzione fallito: {{error}}",
        nextjsBuildOom:
          "Next.js costruire ucciso da OS (come fuori memoria) - segnale: {{signal}}",
        nextjsBuildExitCode: "Next.js costruire esce con il codice {{code}}",
        skipProdDb:
          "Operazioni di database di produzione (--run-prod-database=false)",
        buildFailed: "Costruzioni fallite: {{error}}",
        unknownError: "errore sconosciuto",
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
        prodDbFailed:
          "La costruzione di produzione è fallita durante le operazioni del database: {{error}}. Prova a eseguire 'docker comporre -f docker-compose-dev.yml up -d' per avviare il database.",
        prodDbConnectionFailed:
          "La costruzione di produzione è fallita durante le operazioni del database: il database è irraggiungibile ({{error}}). Assicurarsi che sia in esecuzione, quindi provare 'docker comporre -f docker-compose-dev.yml up -d' per avviarlo.",
        prodDbNotReady:
          " ⁇  Questa costruzione è NOT pronto per la distribuzione di produzione",
        deploymentReady:
          " ⁇  La vostra applicazione è pronta per la distribuzione di produzione!",
        nextBuildHandled:
          "✅ Next.js costruzione sarà gestito da filato costruire comando",
        failedProdMigrations:
          "Non è riuscito a eseguire migrazioni di produzione",
      },
    },
  },
};
