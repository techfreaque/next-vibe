import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione delle attività",

  tags: {
    pulse: "Pulse",
    monitoring: "Monitoraggio",
  },

  errors: {
    fetchCronTaskHistory:
      "Non riuscito a recuperare la cronologia dell'esecuzione del polso",
  },

  get: {
    title: "Storia dell'esecuzione del polso",
    titleShort: "Storia del polso",
    description: "Visualizza i cicli storici di esecuzione del polso",
    fields: {
      startDate: {
        label: "Data di inizio",
        description: "Filtra i cicli di impulso dopo questa data",
      },
      endDate: {
        label: "Data di fine",
        description: "Filtra i cicli di impulso prima di questa data",
      },
      status: {
        label: "Stato",
        description: "Filtra per stato di esecuzione",
        placeholder: "Tutti gli stati",
      },
      limit: {
        label: "Limiti di risultato",
        description: "Numero massimo di risultati da restituire",
        placeholder: "50",
      },
      offset: {
        label: "Risultati Offset",
        description: "Numero di risultati per saltare per paginazione",
        placeholder: "0",
      },
    },
    response: {
      executions: { title: "Esecuzioni di impulso" },
      totalCount: { title: "Totale conteggio" },
      hasMore: { title: "Ha più risultati" },
      summary: { title: "Riepilogo delle procedure" },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di richiesta non valida forniti",
      },
      network: {
        title: "Errore di rete",
        description:
          "Errore di rete si è verificato durante l'acquisizione della cronologia del polso",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non hai il permesso di visualizzare la cronologia delle pulsazioni",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso alla cronologia delle pulsazioni è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "Registrazione dell'esecuzione del polso non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
    success: {
      title: "Storia recuperata",
      description: "Storia dell'esecuzione di impulso recuperato con successo",
    },
  },
  pulse: {
    execution: {
      success: "Operazione riuscita",
      failure: "Fallimento",
      timeout: "Timeout",
      cancelled: "Annullamento",
      pending: "Finanziamenti",
    },
  },
  widget: {
    title: "Storia del polso",
    empty: "Nessuna esecuzione del polso trovata",
    details: "Dettagli",
    discovered: "{{count}} scoperto",
    due: "{{count}} due",
    succeeded: "{{count}} ok",
    failed: "{{count}} ha fallito",
    tasksExecuted: "Esecuzione",
    tasksSucceeded: "Accadenze",
    tasksFailed: "Sfigato",
    tasksSkipped: "Asciugata",
    header: {
      cronHistory: "Cron Storia",
      stats: "Stat",
      refresh: "Aggiorna",
    },
    summary: {
      total: "Totale",
      successful: "Successo",
      failed: "Sfigato",
      successRate: "Tasso di successo",
      avgDuration: "Durata di Avg",
    },
    filter: {
      all: "Tutti",
      success: "Operazione riuscita",
      failure: "Sfigato",
      timeout: "Timeout",
    },
    pagination: {
      info: "Pagina {{page}} di {{totalPages}} (totale {{total}})",
      prev: "Precedente",
      next: "Avanti",
    },
  },
};
