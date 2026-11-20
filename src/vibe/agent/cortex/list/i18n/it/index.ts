import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Elenco Cartella",
    titleShort: "Lista dei file",
    description: "Vedi cosa c'e' in una cartella.",
    dynamicTitle: "Elencato {{path}}",
    status: {
      loading: "Elencando...",
      done: "Elenco",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Sentiero",
        description:
          "Cartella da elencare. /ssh → tutte le macchine. /ssh/ <name> / → file o supporti. /ssh/ <name> / <mount> / → contenuti di montaggio.",
      },
    },
    submitButton: {
      label: "Sfoglia",
      loadingText: "Caricamento...",
    },
    emptyState: "Questa cartella è vuota",
    folderNames: {
      memories: "Memoria",
      documents: "Documenti",
      threads: "Conversazioni",
      skills: "Skill",
      tasks: "Compiti",
      uploads: "Caricamenti",
      searches: "Ricerche",
      gens: "Media generati",
      favorites: "Preferiti",
      inbox: "Posta in arrivo",
      projects: "Progetti",
      knowledge: "Conoscenza",
      journal: "Libro giornale",
      templates: "Modelli",
      identity: "Identità",
      expertise: "Competenza",
      context: "Contesto",
    },
    response: {
      path: { content: "Sentiero" },
      entries: {
        name: { content: "Nome" },
        path: { content: "Sentiero" },
        nodeType: { text: "Tipologia" },
        size: { text: "Dimensione" },
        updatedAt: { content: "Aggiornato" },
      },
      total: { text: "Totale" },
      writable: { text: "Facilissimo" },
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
        description: "Non vedo questa cartella",
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
      title: "Elenco",
      description: "Ecco cosa c'è dentro.",
    },
  },
};
