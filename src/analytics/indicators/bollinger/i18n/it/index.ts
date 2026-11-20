import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Bande di Bollinger",
    titleShort: "Bollinger",
    description:
      "Bollinger Bands - tomaia, media (SMA), e banda inferiore utilizzando deviazione standard",
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
      period: {
        label: "Periodo",
        description: "Numero di periodi (2–200)",
      },
      stdDev: {
        label: "Std Dev Multiplier",
        description: "moltiplicatore di deviazione standard (0.1–5)",
      },
      upper: {
        label: "Banda superiore",
        description: "Serie di tempo della banda del Bollinger superiore",
      },
      middle: {
        label: "Banda mediana",
        description: "Serie di tempo di banda media (SMA)",
      },
      lower: {
        label: "Banda inferiore",
        description: "Bassa serie di tempo di Bollinger Band",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
    },
    success: {
      title: "Bande di Bollinger calcolate",
      description: "Tornò la serie Upper, middle e Lower Band.",
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
        description: "Il calcolo delle bande di Bollinger non è riuscito",
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
