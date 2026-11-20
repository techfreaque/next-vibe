import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Leggi il file",
    titleShort: "Leggi il file",
    description:
      "Apri qualsiasi file - le tue note, fili, ricordi, abilità o compiti.",
    dynamicTitle: "Leggi {{path}}",
    status: {
      loading: "Leggere...",
      done: "Caricato",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Sentiero",
        description:
          "Quale fascicolo. Usa la radice della tua localitÃ (ad esempio /erinnerungen/ per DE, /wspomnienia/ per PL). Esempio: /documents/notes/ideas.md",
      },
      maxLines: {
        label: "Max Lines",
        description: "Mostrare solo queste tante righe",
      },
    },
    submitButton: {
      label: "Leggi tutto",
      loadingText: "Leggere...",
    },
    emptyFile: "Questo file è vuoto.",
    response: {
      path: { content: "Sentiero" },
      content: { content: "Contenuti" },
      size: { text: "Dimensione" },
      truncated: { text: "Taglio corto" },
      readonly: { text: "Leggere solo" },
      nodeType: { text: "Tipologia" },
      updatedAt: { content: "Aggiornato" },
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
        description: "Non puoi leggere questo",
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
      conflict: { title: "Conflitto", description: "Versione maledetta" },
    },
    success: {
      title: "Preso",
      description: "File caricato",
    },
  },
};
