import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  delete: {
    title: "Elimina",
    titleShort: "Eliminare File",
    description: "Rimuovere un file o una cartella. E' andata per sempre.",
    dynamicTitle: "Cancellato {{path}}",
    status: {
      loading: "Deleting...",
      done: "Cancellato",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Sentiero",
        description: "Cosa eliminare",
      },
      recursive: {
        label: "Includi i contenuti",
        description: "Anche eliminare tutto all'interno",
      },
    },
    submitButton: {
      label: "Elimina",
      loadingText: "Deleting...",
    },
    response: {
      path: { content: "Sentiero" },
      nodesDeleted: { text: "Cancellato" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Controllare il percorso",
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
        title: "Nessun accesso",
        description: "Non riesco a cancellare questo",
      },
      notFound: {
        title: "Non trovato",
        description: "Niente su questo sentiero",
      },
      server: { title: "Errore del server", description: "Qualcosa di rotto" },
      unknown: { title: "Errore", description: "Qualcosa è andato storto" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare o scartare prima",
      },
      conflict: {
        title: "Non vuoto",
        description:
          "La cartella ha roba in esso - utilizzare Include i contenuti",
      },
    },
    success: {
      title: "Cancellato",
      description: "Andato",
    },
  },
};
