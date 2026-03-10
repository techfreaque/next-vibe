import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Graph-Details",
    description: "Graph-Diagramm mit Indikatoren und Signalen anzeigen",
    fields: { id: { label: "Graph-ID", description: "UUID des Graphen" } },
    response: {
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Name",
        description: "Beschreibung",
        ownerType: "Besitzertyp",
        isActive: "Aktiv",
        createdAt: "Erstellt am",
        config: "Konfiguration",
      },
    },
    widget: {
      loading: "Graph wird geladen...",
      back: "Zurueck",
      active: "Aktiv",
      inactive: "Inaktiv",
      nodes: "Knoten",
      trigger: "Ausloesen",
      backtest: "Backtest",
      edit: "Bearbeiten",
      archive: "Archivieren",
      promote: "Promote",
      signal: "Signal",
    },
    success: {
      title: "Graph geladen",
      description: "Graph erfolgreich abgerufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      server: {
        title: "Serverfehler",
        description: "Graph konnte nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungueltige ID",
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
        title: "Ungespeicherte Aenderungen",
        description: "Aenderungen zuerst speichern",
      },
    },
  },
  post: {
    title: "Graph-Daten",
    description:
      "Zeitreihendaten eines Graphen abrufen (On-Demand-Ausfuehrung)",
    fields: {
      id: { label: "Graph-ID", description: "UUID des Graphen" },
      rangeFrom: { label: "Von", description: "Bereichsanfang (ISO-Datum)" },
      rangeTo: { label: "Bis", description: "Bereichsende (ISO-Datum)" },
    },
    response: {
      series: {
        nodeId: "Knoten-ID",
        points: {
          timestamp: "Zeitstempel",
          value: "Wert",
        },
      },
      signals: {
        nodeId: "Knoten-ID",
        events: {
          timestamp: "Zeitstempel",
          fired: "Ausgeloest",
        },
      },
    },
    widget: {
      loadButton: "Daten laden",
      loadingButton: "Laden...",
      noData: "Keine Daten in diesem Bereich",
    },
    success: {
      title: "Daten geladen",
      description: "Graph-Daten erfolgreich abgerufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      server: {
        title: "Serverfehler",
        description: "Daten konnten nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungueltige Parameter",
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
        title: "Ungespeicherte Aenderungen",
        description: "Aenderungen zuerst speichern",
      },
    },
  },
};
