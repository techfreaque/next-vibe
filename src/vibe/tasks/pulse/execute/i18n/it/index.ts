import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Esecuzione del polso",
  tags: {
    execute: "Esecuzione",
  },
  errors: {
    executePulse: "Non ha eseguito il polso",
  },
  post: {
    title: "Esegui il polso",
    titleShort: "Esegui il polso",
    description:
      "Eseguire il monitoraggio della salute del polso e l'esecuzione delle attività",
    container: {
      title: "Esecuzione del polso",
      description:
        "Eseguire il monitoraggio delle pulsazioni e eseguire le attività programmate",
    },
    fields: {
      dryRun: {
        label: "Correre a secco",
        description:
          "Eseguire una corsa asciutta senza fare cambiamenti effettivi",
      },
      taskNames: {
        label: "Alias delle attività",
        description:
          "Inserisci l’alias dell’endpoint e premi Invio. Lascia vuoto per includere tutte le attività idonee.",
      },
      force: {
        label: "Esecuzione della Forza",
        description: "Esecuzione forza anche se i compiti non sono dovuti",
      },
      success: {
        title: "Operazione riuscita",
      },
      message: {
        title: "Messaggio",
      },
    },
    response: {
      pulseId: "Pulsante ID",
      executedAt: "Esecuzione",
      totalTasksDiscovered: "Totale Compiti Scoperti",
      tasksDue: "Compiti Due",
      tasksExecuted: "Compiti esecuti",
      tasksSucceeded: "Compiti",
      tasksFailed: "Compiti falliti",
      tasksSkipped: "Compiti saltati",
      totalExecutionTimeMs: "Tempo di esecuzione totale (ms)",
      errors: "Errori",
      summary: "Riepilogo delle procedure",
      results: "Risultati",
      resultsDescription: "Risultati dell'esecuzione",
      taskName: "Nome del compito",
      success: "Operazione riuscita",
      duration: "Durata",
      message: "Messaggio",
      executionFailed: "Esecuzione fallita",
      dryRunSuccess: "Corsa a secco completata con successo",
      executionSuccess: "Esecuzione completata con successo",
    },
    examples: {
      basic: {
        title: "Esecuzione di base del polso",
      },
      dryRun: {
        title: "Esecuzione a secco",
      },
      success: {
        title: "Esecuzione riuscita",
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      internal: {
        title: "Errore interno",
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
      unsaved: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
