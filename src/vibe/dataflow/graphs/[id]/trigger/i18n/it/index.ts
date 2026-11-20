import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Grafica del tritatore",
    titleShort: "Grafica del tritatore",
    description: "Attivare manualmente l'esecuzione del grafico richiesta",
    fields: {
      id: { label: "Grafico ID", description: "UUID del grafico" },
      rangeFrom: { label: "Da", description: "Inizio gamma (data ISO)" },
      rangeTo: { label: "A", description: "Intervallo finale (data ISO)" },
    },
    response: {
      nodeCount: "Nodi giustiziati",
      errorCount: "Errori",
    },
    widget: {
      nodesExecuted: "Nodi Eseguiti",
      errors: "Errori",
      errorDetails: "Dettagli dell’errore",
      nodeLabel: "Node",
    },
    success: {
      title: "Grafica eseguita",
      description: "Graphic correva con successo",
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
        description: "Esecuzione del grafico guasto",
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
