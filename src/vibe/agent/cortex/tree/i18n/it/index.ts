import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Mostra l'albero",
    titleShort: "Albero di file",
    description:
      "Vedi la struttura completa della cartella in un colpo d'occhio. Per /ssh/ percorsi, mostra macchine e monta riassunti. utilizzare cortex-list o cortex-exec per navigare più a fondo.",
    dynamicTitle: "Albero {{path}}",
    status: {
      loading: "Scansione...",
      done: "Scansione",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Sentiero",
        description: "Inizia da qui (default: root)",
      },
      depth: {
        label: "Profondità",
        description: "Quanti livelli profondi",
      },
    },
    submitButton: {
      label: "Mostra l'albero",
      loadingText: "Caricamento...",
    },
    response: {
      tree: { content: "Albero" },
      totalFiles: { text: "File" },
      totalDirs: { text: "Cartelle" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Controllare il percorso e la profondità",
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
        description: "Non riesco a vedere questo",
      },
      notFound: { title: "Non trovato", description: "La cartella non esiste" },
      server: { title: "Errore del server", description: "Qualcosa di rotto" },
      unknown: { title: "Errore", description: "Qualcosa è andato storto" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare o scartare prima",
      },
      conflict: { title: "Conflitto", description: "Riprova" },
    },
    success: {
      title: "Albero",
      description: "Ecco la struttura",
    },
  },
};
