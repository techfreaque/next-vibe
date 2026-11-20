import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    op: {
      gt: ">",
      lt: "<",
      gte: ">=",
      lte: "<=",
      eq: "==",
    },
  },
  post: {
    title: "Soglia",
    titleShort: "Soglia",
    description:
      "Fuoco quando un valore della serie soddisfa un confronto contro una costante",
    fields: {
      source: { label: "Fonte", description: "Serie di tempo di input" },
      resolution: { label: "Risoluzione", description: "Tempo di calcolo" },
      range: {
        label: "Gamma di intervallo",
        description: "Intervallo di tempo per valutare",
      },
      lookback: {
        label: "Lookback",
        description:
          "Barre extra prima dell'inizio della gamma per il riscaldamento",
      },
      op: {
        label: "Operatore",
        description: "Operatore di confronto (>, <, >=, <=, ==)",
      },
      value: {
        label: "Soglia",
        description: "Valore costante da confrontare",
      },
      signals: { label: "Segnali", description: "Eventi di segnale di uscita" },
    },
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Valutazione",
      loadingText: "Valutare...",
    },
    success: {
      title: "Soglia valutata",
      description: "Gli eventi firmati sono tornati",
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
        description: "Valutazione della soglia fallita",
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
