import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Ricambio di riempimento",
    titleShort: "Ricambio",
    description:
      "Genera embeddings per tutti i nodi della corteccia che li mancano.",
    status: {
      loading: "Embedding...",
      done: "Fatto",
    },
    tags: {
      cortex: "Cortex",
    },
    widget: {
      hint: "Generare embeddings per tutti i nodi della corteccia che li mancano. Potrebbe volerci un po'.",
    },
    fields: {
      force: {
        label: "Forza Reimbed",
        description:
          "Cancellare prima tutti gli elementi esistenti e rigenerarsi da zero (formato solo contenuto). Utilizzare quando il formato di incorporazione è cambiato.",
      },
    },
    submitButton: {
      label: "Avviare il backup",
      loadingText: "Elaborazione in corso…",
    },
    response: {
      materialized: { text: "Materiali" },
      processed: { text: "Embedded" },
      failed: { text: "Sfigato" },
      skipped: { text: "Asciugata" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Richiesta non valida",
      },
      network: {
        title: "Offline",
        description: "Non riesco a raggiungere il server",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Accedi per primo",
      },
      forbidden: {
        title: "Solo l'amministratore",
        description: "Richiede l'accesso di amministratore",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Il servizio di embedaggio non è riuscito",
      },
      unknown: {
        title: "Errore",
        description: "Qualcosa è andato storto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare o scartare prima",
      },
      conflict: {
        title: "Già in corso",
        description: "Una backfill è già in corso",
      },
    },
    success: {
      title: "Completo di riempimento",
      description: "Tutte le embeddings trasformate",
    },
  },
};
