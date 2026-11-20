import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    viewType: {
      calendar: "Calendario",
      grid: "Griglia",
      kanban: "Kanban",
      list: "Elenco",
      wiki: "Wiki",
    },
  },
  post: {
    title: "Nuova cartella",
    titleShort: "Nuova cartella",
    description: "Crea una cartella.",
    dynamicTitle: "Creato {{path}}",
    status: {
      loading: "Creare...",
      done: "Creato",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Sentiero",
        description:
          "Percorso pieghevole. Utilizzare la radice del locale (ad esempio /dokumente/ per DE, /dokumenty/ per PL). Esempio: /documents/projects/my-app",
      },
      viewType: {
        label: "Vista",
        description: "Come visualizzarlo (elenco, kanban, calendario, griglia)",
      },
      createParents: {
        label: "Crea cartelle",
        description: "Rendere anche le cartelle dei genitori mancanti",
      },
    },
    submitButton: {
      label: "Creare",
      loadingText: "Creare...",
    },
    response: {
      path: { content: "Sentiero" },
      created: { text: "Creato" },
      alreadyExists: { text: "Esiste già" },
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
        description: "Non è possibile creare cartelle qui",
      },
      notFound: {
        title: "Parente scomparso",
        description: "La cartella principale non esiste",
      },
      server: { title: "Errore del server", description: "Qualcosa di rotto" },
      unknown: { title: "Errore", description: "Qualcosa è andato storto" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare o scartare prima",
      },
      conflict: {
        title: "Gia'.",
        description: "Cartella già lì",
      },
    },
    success: {
      title: "Creato",
      description: "Cartella pronta",
    },
  },
};
