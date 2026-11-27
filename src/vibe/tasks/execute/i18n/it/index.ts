import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Esecuzione del compito",
  tags: {
    execute: "Esecuzione",
  },
  errors: {
    executeTask: "Non riuscita a eseguire l'attività",
    forbidden: "Non hai il permesso di eseguire questo compito",
    alreadyRunning: "Il compito è già in esecuzione",
    notFound: "Task {{taskId}} non trovato",
  },
  post: {
    title: "Esecuzione delle attività",
    titleShort: "Esecuzione delle attività",
    description:
      "Trigger un unico compito da ID e ricevere il risultato sincronizzato",
    container: {
      title: "Esecuzione del compito",
      description: "Eseguire un compito specifico e attendere il suo risultato",
    },
    fields: {
      taskId: {
        label: "Chiave dell’attività",
        description: "La ID dell'attività da eseguire",
      },
      success: {
        title: "Operazione riuscita",
      },
      message: {
        title: "Messaggio",
      },
    },
    response: {
      taskId: "Task ID",
      taskName: "Nome del compito",
      executedAt: "Esecuzione",
      duration: "Durata (m)",
      status: "Stato",
      output: "Produzione",
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
        description: "Non hai il permesso di eseguire questo compito",
      },
      notFound: {
        title: "Non trovato",
        description: "Compito non trovato",
      },
      conflict: {
        title: "Conflitto",
        description: "Il compito è già in esecuzione",
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
    submitButton: {
      label: "Esecuzione delle attività",
      loadingText: "Correre...",
    },
    success: {
      title: "Operazione riuscita",
      description: "Compito eseguito con successo",
    },
  },
};
