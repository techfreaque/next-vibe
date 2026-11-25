import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    stage: {
      leads: "Tutti i lead",
      humans: "Lead umani",
      firstChats: "Hanno chattato",
      signups: "Registrati",
      emailConfirmed: "Email confermata",
      payers: "Hanno pagato",
    },
  },
  post: {
    title: "Fase del funnel lead",
    titleShort: "Fase del funnel",
    description:
      "Lead creati per periodo e quanti hanno raggiunto una fase del funnel. Bot esclusi dopo la prima fase.",
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
      stage: {
        label: "Fase",
        description: "Quale fase del funnel contare",
      },
      result: {
        label: "Conteggio fase",
        description: "Serie temporale in uscita",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
    },
    success: {
      title: "Dati fase del funnel",
      description: "Serie della fase restituita",
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
