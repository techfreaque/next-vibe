import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "Pagamenti incassati",
    titleShort: "Incassati",
    description:
      "Pagamenti incassati per periodo: pacchetti, nuovi abbonamenti e rinnovi. Riusciti o poi rimborsati, account admin esclusi.",
    fields: {
      resolution: {
        label: "Risoluzione",
        description: "Tempo di calcolo",
      },
      range: {
        label: "Gamma di intervallo",
        description: "Intervallo di tempo per query",
      },
      lookback: {
        label: "Lookback",
        description: "Barre extra prima dell'inizio della gamma",
      },
      result: {
        label: "Pagamenti incassati",
        description: "Serie di tempo di uscita",
      },
      meta: {
        label: "Meta",
        description: "metadati di esecuzione del nodo",
      },
    },
    success: {
      title: "Pagamenti incassati calcolati",
      description: "Serie dei pagamenti incassati restituita",
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
      server: {
        title: "Errore del server",
        description: "Query fallito",
      },
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
      conflict: {
        title: "Conflitto",
        description: "Conflitto",
      },
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
