import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Muovetevi!",
    titleShort: "Spostare il file",
    description: "Spostare o rinominare un file o una cartella.",
    dynamicTitle: "{{from}} → {{to}}",
    status: {
      loading: "Muoversi...",
      done: "Spostato",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      from: {
        label: "Da",
        description: "Percorso attuale",
      },
      to: {
        label: "A",
        description: "Nuovo percorso",
      },
    },
    submitButton: {
      label: "Muovetevi!",
      loadingText: "Muoversi...",
    },
    response: {
      from: { content: "Da" },
      to: { content: "A" },
      nodesAffected: { text: "Spostato" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Controllare entrambi i percorsi",
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
        description: "Non riesco a muoverlo.",
      },
      notFound: {
        title: "Non trovato",
        description: "Niente sul percorso sorgente",
      },
      server: { title: "Errore del server", description: "Qualcosa di rotto" },
      unknown: { title: "Errore", description: "Qualcosa è andato storto" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare o scartare prima",
      },
      conflict: {
        title: "Bloccato",
        description: "C'e' gia' qualcosa a destinazione.",
      },
    },
    success: {
      title: "Spostato",
      description: "Fatto",
    },
  },
};
