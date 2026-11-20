import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 minuto",
      "3m": "3 processo verbale",
      "5m": "5 minuti",
      "15m": "15 minuti",
      "30m": "30 minuti",
      "1h": "1 ora",
      "4h": "4 ore",
      "1d": "1 giorno",
      "1w": "1 settimana",
      "1M": "1 Mese",
    },
  },
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Esegui il backup",
    titleShort: "Backtest",
    description: "Eseguire un backtest su una gamma storica (azioni simulate)",
    fields: {
      id: { label: "Grafico ID", description: "UUID del grafico" },
      rangeFrom: { label: "Da", description: "Inizio della gamma di backup" },
      rangeTo: { label: "A", description: "Fine della gamma di backup" },
      resolution: {
        label: "Risoluzione",
        description: "Tempi di valutazione",
      },
    },
    response: {
      runId: "Correre ID",
      eligible: "Idonea",
      ineligibleNodes: "Nodi ineleggibili",
    },
    widget: {
      eligible: "Idonea",
      notEligible: "Non è idonea",
      runLabel: "Correre:",
      ineligibleNodesLabel: "Nodi ineleggibili:",
      ineligibleNodesHint:
        "Questi nodi non possono essere retrotestati (mancando i dati perseguiti, la risoluzione incompatibile o la logica solo dello script).",
    },
    success: {
      title: "Indietro completo",
      description: "Backtest corse con successo",
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
        description: "Il ritorno è fallito",
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
