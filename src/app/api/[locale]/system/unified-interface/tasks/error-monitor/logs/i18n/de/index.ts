import type { translations as en } from "../en";

export const translations: typeof en = {
  category: "System",

  errors: {
    repositoryInternalError: "Ein interner Fehler ist aufgetreten",
    fetchErrorLogs: "Fehlerprotokolle konnten nicht abgerufen werden",
  },

  get: {
    title: "Fehlerprotokolle",
    description:
      "Backend-Fehlerprotokolle mit Filterung und Paginierung durchsuchen",
    tags: {
      monitoring: "Überwachung",
    },
    fields: {
      source: {
        label: "Quelle",
        description: "Nach Fehlerquelle filtern",
        placeholder: "backend, task, chat",
      },
      level: {
        label: "Stufe",
        description: "Nach Fehlerstufe filtern",
        placeholder: "error, warn",
      },
      endpoint: {
        label: "Endpunkt",
        description: "Nach Endpunkt filtern (Teilübereinstimmung)",
        placeholder: "Endpunkt eingeben",
      },
      errorType: {
        label: "Fehlertyp",
        description: "Nach Fehlertypklassifizierung filtern",
        placeholder: "z.B. INTERNAL_ERROR",
      },
      startDate: {
        label: "Von",
        description: "Fehler nach diesem Datum anzeigen",
      },
      endDate: {
        label: "Bis",
        description: "Fehler vor diesem Datum anzeigen",
      },
      limit: {
        label: "Limit",
        description: "Anzahl der zurückzugebenden Ergebnisse",
        placeholder: "50",
      },
      offset: {
        label: "Offset",
        description: "Anzahl der zu überspringenden Ergebnisse",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Fehlerprotokolleinträge",
      },
      totalCount: {
        title: "Gesamtanzahl",
      },
      hasMore: {
        title: "Mehr vorhanden",
      },
    },
    success: {
      title: "Protokolle abgerufen",
      description: "Fehlerprotokolle erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Protokolle gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehlerprotokolle konnten nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        titleChanges: "Nicht gespeicherte Änderungen",
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
  },

  widget: {
    title: "Fehlerprotokolle",
    loading: "Protokolle werden geladen...",
    empty: "Keine Fehlerprotokolle gefunden",
    header: {
      refresh: "Aktualisieren",
      runScan: "Scan starten",
    },
    col: {
      level: "Stufe",
      source: "Quelle",
      message: "Nachricht",
      endpoint: "Endpunkt",
      errorType: "Fehlertyp",
      createdAt: "Zeit",
    },
    detail: {
      stackTrace: "Stack-Trace",
      metadata: "Metadaten",
      collapse: "Einklappen",
    },
    pagination: {
      info: "Seite {{page}} von {{totalPages}} ({{total}} gesamt)",
      prev: "Zurück",
      next: "Weiter",
    },
  },
};
