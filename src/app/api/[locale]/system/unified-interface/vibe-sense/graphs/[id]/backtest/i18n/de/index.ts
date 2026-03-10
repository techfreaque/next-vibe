import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Backtest ausführen",
    description:
      "Backtest über einen historischen Zeitraum ausführen (Aktionen simuliert)",
    fields: {
      id: { label: "Graph-ID", description: "UUID des Graphen" },
      rangeFrom: { label: "Von", description: "Backtest-Bereichsanfang" },
      rangeTo: { label: "Bis", description: "Backtest-Bereichsende" },
      resolution: {
        label: "Auflösung",
        description: "Zeitrahmen für die Auswertung",
      },
    },
    response: {
      runId: "Lauf-ID",
      eligible: "Berechtigt",
      ineligibleNodes: "Nicht berechtigte Knoten",
    },
    widget: {
      eligible: "Berechtigt",
      notEligible: "Nicht berechtigt",
      runLabel: "Lauf:",
      ineligibleNodesLabel: "Nicht berechtigte Knoten:",
      ineligibleNodesHint:
        "These nodes cannot be backtested (missing persisted data, incompatible resolution, or script-only logic).",
    },
    success: {
      title: "Backtest abgeschlossen",
      description: "Backtest erfolgreich ausgeführt",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Backtest fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Graph nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Änderungen zuerst speichern",
      },
    },
  },
};
