import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "AND",
    titleShort: "AND",
    description:
      "Fuoco solo quando tutti i segnali di ingresso fuoco allo stesso timestamp",
    fields: {
      signals: {
        label: "Segnale Flussi",
        description: "Array di flussi di segnale a AND insieme",
      },
      result: {
        label: "Risultato",
        description: "Eventi di segnale di uscita",
      },
    },
    success: {
      title: "AND valutato",
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
        description: "La valutazione di AND è fallita",
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
