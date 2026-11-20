import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Goccia affilata",
    titleShort: "Goccia",
    description:
      "Fuoco quando un valore cade nettamente sotto la sua media di trailing",
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
      window: {
        label: "Barre per sentieri",
        description: "Quante barre precedenti formano la media di base",
      },
      dropPct: {
        label: "Goccia",
        description:
          "Fuoco sotto la linea di base × (1 − goccia). 0.5 = una goccia del 50%",
      },
      minBaseline: {
        label: "Linea di base minima",
        description:
          "Ignora le barre la cui linea di base è sotto questo (alcuni dati)",
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
      title: "Goccia valutata",
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
        description: "Valutazione del getto",
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
