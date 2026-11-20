import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Crossover",
    titleShort: "Crossover",
    description: "Fuoco quando la serie A attraversa la serie B",
    fields: {
      seriesA: {
        label: "Serie A",
        description: "Prima serie di tempo di input",
      },
      seriesB: {
        label: "Serie B",
        description: "Seconda serie di tempo di input",
      },
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
      title: "Crossover valutato",
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
        description: "La valutazione del crossover è fallita",
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
