import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Esegui la configurazione del grafico",
    titleShort: "Correre confidenziale",
    description:
      "Eseguire un grafico da una configurazione in linea senza richiedere un grafico salvato",
    fields: {
      config: {
        label: "Configurazione del grafico",
        description:
          "Configurazione del grafico in linea (nodi, bordi, trigger)",
      },
      rangeFrom: {
        label: "Da",
        description: "Inizio gamma (data-ora ISO)",
      },
      rangeTo: {
        label: "A",
        description: "Intervallo finale (datetime ISO)",
      },
    },
    response: {
      nodeCount: "Nodi giustiziati",
      errorCount: "Errori",
      errors: "Dettagli dell’errore",
    },
    success: {
      title: "Configurazione eseguita",
      description: "Graph config è stato eseguito con successo",
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
        detail: "Esecuzione del grafico guasto: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: {
        title: "Convalida fallita",
        description: "Configurazione o parametri del grafico non valido",
        detail: "Configurazione del grafico non valido: {{error}}",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "conflitto di risorse",
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
