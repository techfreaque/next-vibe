import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  delete: {
    title: "Eliminare il grafico",
    titleShort: "Eliminare il grafico",
    description: "Eliminare permanentemente un grafico. Andato per sempre.",
    fields: {
      id: { label: "Grafico ID", description: "UUID del grafico da eliminare" },
    },
    response: {
      deletedId: "Grafica eliminata ID",
    },
    widget: {
      confirmDescription:
        "Permanente. Il grafico e la sua configurazione sono cancellati. nessun disfare. Funziona solo quando il grafico non contiene dati; altrimenti archiviarlo invece.",
      deletedIdLabel: "ID cancellato:",
      backToList: "Torna ai grafici",
    },
    success: {
      title: "Grafica eliminata",
      description: "Il grafico è stato rimosso definitivamente",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non è possibile eliminare questo grafico",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a eliminare il grafico",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: {
        title: "Convalida fallita",
        description: "Parametri non validi",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Grafico non trovato",
      },
      conflict: {
        title: "Ha dati",
        description:
          "Il grafico contiene punti di dati. archivialo invece di eliminarlo",
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
