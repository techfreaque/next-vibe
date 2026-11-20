import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stato di impulso",
  tags: {
    status: "Stato",
  },
  get: {
    title: "Stato di impulso",
    titleShort: "Stato di impulso",
    description: "Ottieni lo stato di monitoraggio della salute del polso",
    container: {
      title: "Stato di salute del polso",
      description:
        "Monitorare la salute e le statistiche dell'esecuzione del polso",
    },
    fields: {
      status: {
        title: "Stato",
        label: "Stato di impulso",
        description: "Situazione attuale della salute del polso",
      },
      lastPulseAt: {
        title: "L'ultimo impulso",
        label: "Ultimo impulso",
        description: "Timestamp dell'ultima esecuzione del polso",
      },
      successRate: {
        title: "Tasso di successo",
        label: "Tasso di successo",
        description: "Percentuale delle esecuzioni di polso di successo",
      },
      totalExecutions: {
        title: "Esecuzioni totali",
        label: "Esecuzioni totali",
        description: "Numero totale di esecuzioni del polso",
      },
    },
    examples: {
      basic: {
        title: "Richiesta di stato fondamentale",
      },
      success: {
        title: "Risposta dello stato di successo",
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
