import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Cerca",
    titleShort: "File di ricerca",
    description: "Trova i file per nome o per contenuto. Cerca tutto.",
    dynamicTitle: "Ricerca: {{query}}",
    status: {
      loading: "Cercando...",
      done: "Trovato",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      query: {
        label: "Cerca",
        description: "Cosa cercare",
      },
      path: {
        label: "Nella cartella",
        description: "Cerca solo qui (default: ovunque)",
      },
      maxResults: {
        label: "Limite",
        description: "Quanti risultati (default: 20)",
      },
    },
    submitButton: {
      label: "Cerca",
      loadingText: "Cercando...",
    },
    noResults: "Nessun risultato",
    response: {
      query: { content: "Ricercato" },
      results: {
        path: { content: "Sentiero" },
        name: { content: "Nome" },
        nodeType: { text: "Tipologia" },
        excerpt: { content: "Corrispondenza" },
        score: { text: "Punteggio" },
        updatedAt: { content: "Aggiornato" },
      },
      total: { text: "Trovato" },
      searchMode: { text: "Modalità" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Controlla il testo di ricerca",
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
        description: "Non riesco a cercare qui",
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
      title: "Fatto",
      description: "Ricerca completa",
    },
  },
};
