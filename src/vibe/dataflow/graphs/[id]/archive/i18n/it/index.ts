import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Archivio Graph",
    titleShort: "Archivio Graph",
    description:
      "Morbido-eliminare un grafico (deattivare e contrassegnare come archiviato)",
    fields: {
      id: {
        label: "Grafico ID",
        description: "UUID del grafico da archiviare",
      },
    },
    response: {
      archivedId: "Grafico archiviato ID",
    },
    widget: {
      confirmDescription:
        "Questo disattiva il grafico e contrassegnalo come archiviato. Non sarà più eseguito in programma. Questo può essere annullato.",
      archivedIdLabel: "Archivio ID:",
      backToList: "Torna ai grafici",
    },
    success: {
      title: "Grafica archiviata",
      description: "Il grafico è stato archiviato con successo",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "I grafici del sistema di archivio non possono",
      },
      server: {
        title: "Errore del server",
        description: "Non archiviato il grafico",
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
      conflict: { title: "Conflitto", description: "conflitto di risorse" },
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
