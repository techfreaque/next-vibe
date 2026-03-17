import type { translations as en } from "../en";

export const translations: typeof en = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Graph-Konfiguration ausführen",
    description:
      "Einen Graphen aus einer Inline-Konfiguration ausführen, ohne einen gespeicherten Graphen zu benötigen",
    fields: {
      config: {
        label: "Graph-Konfiguration",
        description: "Inline-Graph-Konfiguration (Knoten, Kanten, Trigger)",
      },
      rangeFrom: {
        label: "Von",
        description: "Bereichsstart (ISO Datum)",
      },
      rangeTo: {
        label: "Bis",
        description: "Bereichsende (ISO Datum)",
      },
    },
    response: {
      nodeCount: "Ausgeführte Knoten",
      errorCount: "Fehler",
      errors: "Fehlerdetails",
    },
    success: {
      title: "Konfiguration ausgeführt",
      description: "Graph-Konfiguration erfolgreich ausgeführt",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugriff erforderlich",
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
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Graph-Konfiguration oder Parameter",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Änderungen zuerst speichern",
      },
    },
  },
};
