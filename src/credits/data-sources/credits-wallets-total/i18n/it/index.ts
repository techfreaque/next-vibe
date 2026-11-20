import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Portafogli Totale",
    title: "Portafogli di credito totale",
    description:
      "Istantanee dei portafogli di credito totali per benna di risoluzione",
    fields: {
      resolution: { label: "Risoluzione", description: "Tempo di calcolo" },
      range: {
        label: "Gamma di intervallo",
        description: "Intervallo di tempo per query",
      },
      lookback: {
        label: "Lookback",
        description: "Barre extra prima dell'inizio della gamma",
      },
      result: {
        label: "Portafogli di credito totale",
        description: "Serie di tempo di uscita",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
    },
    success: {
      title: "Portafogli di credito Totale calcolato",
      description: "Portafogli di credito Totale serie restituita",
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
      server: { title: "Errore del server", description: "Query fallito" },
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
      conflict: { title: "Conflitto", description: "Conflitto" },
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
