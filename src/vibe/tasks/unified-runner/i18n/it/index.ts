import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione delle attività",

  description: "Esegui i compiti di sfondo e gestisce le attività laterali",
  common: {
    taskName: "Nome del compito",
    taskNamesDescription: "Nomi delle attività da filtrare",
    detailed: "Dettagli dettagli",
    detailedDescription: "Includi informazioni dettagliate",
    active: "Attivo",
    total: "Totale",
    uptime: "Tempo di percorrenza",
    id: "ID",
    status: "Stato",
    lastRun: "Ultima corsa",
    nextRun: "Prossima corsa",
    schedule: "Pianificazione",
  },
  post: {
    title: "Eseguitore di attività unificato",
    titleShort: "Funzionalità Runner",
    description:
      "Gestire il task runner unificato per le attività di sfondo e le attività laterali",
    container: {
      title: "Gestione del runner di attività unificata",
      description:
        "Controllare il task runner unificato che gestisce sia le attività di sfondo che le attività laterali",
    },
    fields: {
      action: {
        label: "Azione",
        description: "Azione da eseguire sul task runner",
        options: {
          start: "Avviare Runner",
          stop: "Stop Runner",
          status: "Ottieni lo stato",
          restart: "Riavviare Runner",
        },
      },
      taskFilter: {
        label: "Filtro di attività",
        description: "Filtra le attività per tipo",
        options: {
          all: "Tutte le attività",
          cron: "Solo le attività Cron",
          side: "Solo le attività laterali",
        },
      },
      dryRun: {
        label: "Correre a secco",
        description:
          "Eseguire una corsa asciutta senza fare cambiamenti effettivi",
      },
    },
    response: {
      success: "Successo dell'operazione",
      actionResult: "Risultato d'azione",
      message: "Messaggio di risposta",
      timestamp: "Timestamp",
    },
    reasons: {
      previousInstanceRunning: "L'istanza precedente è ancora in esecuzione",
    },
    messages: {
      taskSkipped: "Il compito era saltato",
      taskCompleted: "Compito completato con successo",
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
      execution: {
        title: "Errore di esecuzione delle attività",
        description: "Non riuscita a eseguire l'attività",
      },
      taskAlreadyRunning: {
        title: "Compito già in esecuzione",
        description: "L'attività specificata è già in esecuzione",
      },
      sideTaskExecution: {
        title: "Errore di esecuzione delle attività laterali",
        description: "Non riuscita a eseguire un'attività laterale",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
