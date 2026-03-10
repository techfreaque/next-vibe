import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Graph auslösen",
    description: "Graph-Ausführung manuell auslösen",
    fields: {
      id: { label: "Graph-ID", description: "UUID des Graphen" },
      rangeFrom: { label: "Von", description: "Bereichsanfang (ISO-Datum)" },
      rangeTo: { label: "Bis", description: "Bereichsende (ISO-Datum)" },
    },
    response: {
      nodeCount: "Ausgeführte Knoten",
      errorCount: "Fehler",
    },
    widget: {
      nodesExecuted: "Ausgeführte Knoten",
      errors: "Fehler",
      errorDetails: "Error details",
      nodeLabel: "Node",
    },
    success: {
      title: "Graph ausgeführt",
      description: "Graph erfolgreich ausgeführt",
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
        description: "Graph-Ausführung fehlgeschlagen",
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
