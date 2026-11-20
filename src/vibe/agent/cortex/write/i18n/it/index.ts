import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Scrivere File",
    titleShort: "Scrivere File",
    description: "Salvare un file. Dagli un percorso e un contenuto - fatto.",
    dynamicTitle: "Salvataggio: {{path}}",
    status: {
      loading: "Scrivere...",
      done: "Salvataggio",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Sentiero",
        description:
          "Dove salvare. Utilizzare la radice del locale (ad esempio /dokumente/ per DE, /dokumenty/ per PL). Esempio: /documents/notes/ideas.md",
      },
      content: {
        label: "Contenuti",
        description: "Cosa scrivere (markdown)",
      },
      createParents: {
        label: "Crea cartelle",
        description: "Rendere le cartelle mancanti lungo il percorso",
      },
    },
    submitButton: {
      label: "Salva",
      loadingText: "Salvare...",
    },
    response: {
      path: { content: "Sentiero" },
      size: { text: "Dimensione" },
      created: { text: "Nuovo file" },
      updated: { text: "Aggiornato" },
      updatedAt: { content: "Aggiornato" },
      content: { content: "Contenuti" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Controllare il percorso e il contenuto",
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
        title: "Leggere solo",
        description: "Questo percorso è solo in lettura",
      },
      notFound: {
        title: "Cartella mancante",
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
        description: "C'e' gia' qualcosa.",
      },
    },
    success: {
      title: "Salvataggio",
      description: "File salvato",
    },
  },
};
