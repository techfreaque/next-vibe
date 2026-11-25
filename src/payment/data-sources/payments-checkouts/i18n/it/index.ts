import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    outcome: {
      started: "Avviati",
      paid: "Pagati",
      abandoned: "Abbandonati o rifiutati",
    },
  },
  post: {
    title: "Checkout",
    titleShort: "Checkout",
    description:
      "Checkout di pacchetti e nuovi abbonamenti aperti per periodo, per esito. Abbandonato: sessione scaduta dopo 24 h o pagamento rifiutato. Rinnovi e account admin esclusi.",
    fields: {
      resolution: {
        label: "Risoluzione",
        description: "Tempo di calcolo",
      },
      range: {
        label: "Gamma di intervallo",
        description: "Intervallo di tempo per query",
      },
      lookback: {
        label: "Lookback",
        description: "Barre extra prima dell'inizio della gamma",
      },
      result: {
        label: "Checkout",
        description: "Serie di tempo di uscita",
      },
      meta: {
        label: "Meta",
        description: "metadati di esecuzione del nodo",
      },
      outcome: {
        label: "Esito",
        description: "Avviati (tutti), pagati o abbandonati/rifiutati",
      },
    },
    success: {
      title: "Checkout calcolati",
      description: "Serie dei checkout restituita",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      server: {
        title: "Errore del server",
        description: "Query fallito",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: {
        title: "Convalida fallita",
        description: "Parametri della richiesta non validi",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Account o sessione non trovati",
      },
      conflict: {
        title: "Conflitto",
        description: "Conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "La richiesta di rete è fallita",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare le modifiche prima",
      },
    },
  },
};
