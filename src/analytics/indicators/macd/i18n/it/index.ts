import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "MACD",
    titleShort: "MACD",
    description:
      "Divergenza media commovente - Indicatore di slancio alla tendenza",
    fields: {
      source: { label: "Fonte", description: "Serie di tempo di input" },
      resolution: { label: "Risoluzione", description: "Tempo di calcolo" },
      range: {
        label: "Gamma di intervallo",
        description: "Periodo di tempo per calcolare",
      },
      lookback: {
        label: "Lookback",
        description:
          "Barre extra prima dell'inizio della gamma per il riscaldamento",
      },
      fastPeriod: {
        label: "Periodo veloce",
        description: "Periodo EMA veloce (1–100)",
      },
      slowPeriod: {
        label: "Periodo lento",
        description: "Periodo lento EMA (1–200)",
      },
      signalPeriod: {
        label: "Periodo di firma",
        description: "Segnale linea EMA periodo (1–50)",
      },
      macd: {
        label: "MACD",
        description: "Linea MACD (veloce EMA − lento EMA)",
      },
      signal: {
        label: "Signal",
        description: "Linea di segnale (linea EMA della linea MACD)",
      },
      histogram: {
        label: "Istogramma",
        description: "Istogramma (segnale MACD −)",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
    },
    success: {
      title: "MACD calcolato",
      description: "MACD, segnale e serie di istogramma sono tornati",
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
        description: "Il calcolo MACD non è riuscito",
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
