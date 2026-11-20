import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Finestra Min",
    titleShort: "Vincere Min",
    description:
      "Finestra di rotolamento minimo - traccia il valore più basso in una finestra fissa",
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
      size: {
        label: "Dimensione della finestra",
        description: "Numero di periodi nella finestra di rotolamento (1–500)",
      },
      result: {
        label: "Finestra Min",
        description: "Serie di tempo di uscita",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
    },
    success: {
      title: "Finestra Min calcolato",
      description: "Finestra serie minima restituita",
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
        description: "Finestra Min calcolo fallito",
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
