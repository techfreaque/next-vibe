import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 Minute",
      "3m": "3 Minuten",
      "5m": "5 Minuten",
      "15m": "15 Minuten",
      "30m": "30 Minuten",
      "1h": "1 Stunde",
      "4h": "4 Stunden",
      "1d": "1 Tag",
      "1w": "1 Woche",
      "1M": "1 Monat",
    },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analytics",
    pipeline: "pipeline",
  },
  registry: {
    get: {
      title: "Indikator-Registry",
      description:
        "Alle registrierten Indikatoren für den Graph-Builder auflisten",
      container: {
        title: "Indikatoren",
        description: "Alle registrierten Indikatoren",
      },
      response: { indicators: "Indikatoren" },
      success: {
        title: "Registry geladen",
        description: "Indikator-Registry erfolgreich abgerufen",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Registry konnte nicht geladen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Anfrage",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Registry nicht gefunden",
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
  },
  graphs: {
    list: {
      title: "Pipeline-Graphen",
      description:
        "Alle für den aktuellen Benutzer sichtbaren Graphen auflisten",
      container: { title: "Graphen", description: "Alle Pipeline-Graphen" },
      response: { graphs: "Graphen" },
      success: {
        title: "Graphen geladen",
        description: "Pipeline-Graphen erfolgreich abgerufen",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Graphen konnten nicht geladen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Anfrage",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Keine Graphen gefunden",
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
    create: {
      title: "Graph erstellen",
      description: "Einen neuen Pipeline-Graphen erstellen",
      fields: {
        name: {
          label: "Name",
          description: "Anzeigename des Graphen",
          placeholder: "Mein Graph",
        },
        slug: {
          label: "Slug",
          description: "Eindeutiger Bezeichner",
          placeholder: "mein-graph",
        },
        description: {
          label: "Beschreibung",
          description: "Optionale Beschreibung",
          placeholder: "",
        },
        config: {
          label: "Konfiguration",
          description: "Graph DAG-Konfiguration",
        },
      },
      response: { id: "Graph-ID" },
      success: {
        title: "Graph erstellt",
        description: "Pipeline-Graph erfolgreich erstellt",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Graph konnte nicht erstellt werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Graph-Konfiguration",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Graph-Slug existiert bereits",
        },
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
    get: {
      title: "Graph abrufen",
      description: "Einen bestimmten Graphen nach ID abrufen",
      fields: {
        id: { label: "Graph-ID", description: "UUID der Graph-Version" },
      },
      response: { graph: "Graph" },
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
          description: "Ungültige ID",
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
    edit: {
      title: "Graph bearbeiten",
      description:
        "Graph verzweigen und bearbeiten (erstellt neue Version, mutiert nie)",
      fields: {
        id: {
          label: "Graph-ID",
          description: "UUID der Version zum Verzweigen",
        },
        config: {
          label: "Konfiguration",
          description: "Aktualisierte Graph-Konfiguration",
        },
        name: { label: "Name", description: "Aktualisierter Name" },
        description: {
          label: "Beschreibung",
          description: "Aktualisierte Beschreibung",
        },
      },
      response: { id: "Neue Versions-ID" },
      success: {
        title: "Graph verzweigt",
        description: "Neue Graph-Version erfolgreich erstellt",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        server: {
          title: "Serverfehler",
          description: "Graph konnte nicht bearbeitet werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Konfiguration",
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
    promote: {
      title: "Zu System befördern",
      description: "Einen Admin-Graphen zu system-eigentümer befördern",
      fields: {
        id: {
          label: "Graph-ID",
          description: "UUID des zu befördernden Graphen",
        },
      },
      response: { id: "Graph-ID" },
      success: {
        title: "Graph befördert",
        description: "Graph erfolgreich zum System befördert",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Beförderung fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige ID",
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
    trigger: {
      title: "Graph auslösen",
      description: "Graph-Ausführung manuell auslösen",
      fields: {
        id: {
          label: "Graph-ID",
          description: "UUID des auszulösenden Graphen",
        },
        rangeFrom: { label: "Von", description: "Bereichsstart (ISO-Datum)" },
        rangeTo: { label: "Bis", description: "Bereichsende (ISO-Datum)" },
      },
      response: {
        nodeCount: "Ausgeführte Knoten",
        errorCount: "Fehler",
        errors: "Fehler",
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
          description: "Admin-Zugriff erforderlich",
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
    backtest: {
      title: "Backtest durchführen",
      description:
        "Backtest über historischen Bereich durchführen (Aktionen simuliert)",
      fields: {
        id: { label: "Graph-ID", description: "UUID der Graph-Version" },
        rangeFrom: { label: "Von", description: "Backtest-Bereichsstart" },
        rangeTo: { label: "Bis", description: "Backtest-Bereichsende" },
        resolution: {
          label: "Auflösung",
          description: "Zeitrahmen für die Auswertung",
        },
      },
      response: {
        runId: "Lauf-ID",
        eligible: "Geeignet",
        ineligibleNodes: "Ungeeignete Knoten",
      },
      success: {
        title: "Backtest abgeschlossen",
        description: "Backtest erfolgreich durchgeführt",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
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
          title: "Validierung fehlgeschlagen",
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
    data: {
      title: "Graph-Daten",
      description: "Zeitreihendaten für einen Graphen abrufen",
      fields: {
        id: { label: "Graph-ID", description: "UUID des Graphen" },
        rangeFrom: { label: "Von", description: "Bereichsstart" },
        rangeTo: { label: "Bis", description: "Bereichsende" },
      },
      response: { series: "Serien", signals: "Signale" },
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
          title: "Validierung fehlgeschlagen",
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
  },
  cleanup: {
    post: {
      title: "Vibe Sense Bereinigung",
      description: "Aufbewahrungsbereinigung für Datenpunkte durchführen",
      success: {
        title: "Bereinigung abgeschlossen",
        description: "Aufbewahrungsbereinigung abgeschlossen",
      },
      response: {
        nodesProcessed: "Verarbeitete Knoten",
        totalDeleted: "Gelöschte Zeilen",
        snapshotsDeleted: "Gelöschte Snapshots",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Bereinigung fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Anfrage",
        },
        notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
        conflict: { title: "Konflikt", description: "Konflikt" },
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
    name: "Vibe Sense Bereinigung",
    description: "Alte Datenpunkte löschen und Snapshot-Cache ablaufen lassen",
  },
};
