import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operazioni del database",

  tag: "migration",
  post: {
    title: "Migrazione del database",
    titleShort: "Migrare DB",
    description: "Esegui le migrazioni dei database",
    form: {
      title: "Configurazione della migrazione",
      description: "Configurare le opzioni di migrazione del database",
    },
    response: {
      title: "Risposta alla migrazione",
      description: "Risultati dell'operazione di migrazione",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di migrazione non validi",
      },
      internal: {
        title: "Errore interno",
        description: "Operazione di migrazione fallita",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Autenticazione necessaria per le operazioni di migrazione",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Autorizzazioni insufficienti per operazioni di migrazione",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorse di migrazione non trovate",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno durante la migrazione",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la migrazione",
      },
      conflict: {
        title: "Conflitto",
        description: "Rilevato conflitto di migrazione",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di rete durante l'operazione di migrazione",
        detail: "Migrazione fallita: {{error}}",
        exitCode: "drizzle-kit migrate espulso con codice {{code}}",
      },
    },
    success: {
      title: "Migrazione Successo",
      description: "Migrazione del database completata con successo",
    },
  },
  fields: {
    generate: {
      title: "Generare le migrazioni",
      description:
        "Generare nuovi file di migrazione dai cambiamenti dello schema",
    },
    redo: {
      title: "Redo Ultima migrazione",
      description: "Ripiegare e riapplicare l'ultima migrazione",
    },
    schema: {
      title: "Schema del database",
      description: "Schema del database target (default: public)",
    },
    success: {
      title: "Stato di successo",
    },
    migrationsRun: {
      title: "Migrazioni Correre",
    },
    migrationsGenerated: {
      title: "Migrazioni generate",
    },
    output: {
      title: "Produzione",
    },
    duration: {
      title: "Durata (m)",
    },
  },
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Parametri di migrazione non validi",
    },
    internal: {
      title: "Errore interno",
      description: "Operazione di migrazione fallita",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Autenticazione necessaria per le operazioni di migrazione",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Autorizzazioni insufficienti per operazioni di migrazione",
    },
    notFound: {
      title: "Non trovato",
      description: "Risorse di migrazione non trovate",
    },
    server: {
      title: "Errore del server",
      description: "Errore del server interno durante la migrazione",
    },
    unknown: {
      title: "Errore sconosciuto",
      description:
        "Un errore sconosciuto si è verificato durante la migrazione",
    },
    conflict: {
      title: "Conflitto",
      description: "Rilevato conflitto di migrazione",
    },
    generationFailed: "Non generare migrazioni: {{message}}",
    generationFailedWithCode:
      "La generazione di migrazione non è riuscita con il codice {{code}}: {{output}}",
    migrationFailed: "Non è riuscito a eseguire migrazioni: {{message}}",
  },
  success: {
    title: "Migrazione Successo",
    description: "Migrazione del database completata con successo",
  },
  status: {
    pending: "Finanziamenti",
    running: "Esecuzione",
    success: "Operazione riuscita",
    failed: "Sfigato",
    rolledBack: "Schienale arrotondato",
  },
  direction: {
    up: "Su.",
    down: "Giù",
  },
  environment: {
    development: "Sviluppo",
    staging: "Stadi",
    production: "Produzione",
  },
  messages: {
    dryRun: "DRY RUN: Eseguire migrazioni",
    generatingMigrations: "Generazione di migrazione:\n{{output}}\n",
    noMigrationsFolder: "Nessuna cartella di migrazione trovata",
    noMigrationFiles: "Nessun file di migrazione trovato",
    executedMigrations: "Migrazioni {{count}} eseguite con successo",
    redoNotImplemented: "Redo funzionalità sarebbe implementato qui",
    repairCompleted: "Migrazione riparazione completata con successo",
    repairDryRun:
      "Corsa a secco: La riparazione della migrazione sarebbe eseguita",
    trackingReset: "Ripristino del monitoraggio delle migrazioni con successo",
    productionCompleted: "Migrazioni di produzione completate con successo",
    productionWithBackup: " (con backup)",
    syncCompleted:
      "Sincronia di migrazione completata con successo ({{direction}})",
    failedToGenerate: "Non generare migrazioni: {{error}}",
    failedToExecute: "Non riuscita a eseguire migrazioni: {{error}}",
    failedToRedo: "Non migrazioni ridicole: {{error}}",
  },
};
