import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Pacchetti creati",
    title: "Pacchetti di credito creati",
    description: "Nuovi pacchetti di credito creati per benna di risoluzione",
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
        label: "Pacchetti di credito creati",
        description: "Serie di tempo di uscita",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
    },
    success: {
      title: "Credit Packs Creato calcolato",
      description: "Carte di credito Serie Creata restituita",
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
