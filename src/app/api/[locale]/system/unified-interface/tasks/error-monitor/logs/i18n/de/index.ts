import type { translations as en } from "../en";

export const translations: typeof en = {
  category: "System",

  errors: {
    repositoryInternalError: "Ein interner Fehler ist aufgetreten",
    fetchErrorLogs: "Fehlerprotokolle konnten nicht abgerufen werden",
    updateErrorLog:
      "Der Status des Fehlerprotokolls konnte nicht aktualisiert werden",
  },

  statusFilter: {
    all: "Alle",
    active: "Aktiv",
    resolved: "Gelöst",
  },

  get: {
    title: "Fehlerprotokolle",
    description:
      "Backend-Fehlerprotokolle mit Filterung und Paginierung durchsuchen",
    tags: {
      monitoring: "Überwachung",
    },
    fields: {
      status: {
        label: "Status",
        description: "Nach Lösungsstatus filtern",
      },
      search: {
        label: "Suche",
        description: "In Fehlermeldungen suchen",
        placeholder: "Meldungen durchsuchen...",
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
      unresolvedCount: {
        title: "Offene Fehler",
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

  patch: {
    title: "Fehlerprotokoll aktualisieren",
    description:
      "Ein Fehlerprotokoll nach Fingerprint lösen oder wieder öffnen",
    tags: {
      monitoring: "Überwachung",
    },
    fields: {
      fingerprint: {
        label: "Fingerprint",
        description: "Der Fingerprint des Fehlerprotokolls",
        placeholder: "Fingerprint eingeben",
      },
      resolved: {
        label: "Gelöst",
        description: "Auf wahr setzen zum Lösen, falsch zum Wieder-Öffnen",
      },
    },
    response: {
      fingerprint: {
        title: "Fingerprint",
      },
      resolved: {
        title: "Gelöst",
      },
      affectedRows: {
        title: "Betroffene Zeilen",
      },
    },
    success: {
      title: "Protokoll aktualisiert",
      description: "Status des Fehlerprotokolls erfolgreich aktualisiert",
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
        description: "Fehlerprotokoll nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehlerprotokoll konnte nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        titleChanges: "Ungespeicherte Änderungen",
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Datenkonflikt ist aufgetreten",
      },
    },
  },

  post: {
    title: "Fehlermonitor-Scan ausführen",
    description:
      "Chat-Nachrichten und Backend-Protokolle auf Fehlermuster scannen",
    tags: {
      monitoring: "Überwachung",
    },
    response: {
      errorsFound: "Fehler gefunden",
      threadsScanned: "Threads gescannt",
      scanWindowFrom: "Scan-Fenster von",
      scanWindowTo: "Scan-Fenster bis",
      patterns: "Fehlermuster",
    },
    success: {
      title: "Scan abgeschlossen",
      description: "Fehlermonitor-Scan erfolgreich abgeschlossen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
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
        description: "Ressource nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehlermonitor-Scan fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
  },

  errorMonitor: {
    name: "Fehlermonitor",
    description: "Scannt alle 3 Stunden nach Fehlermustern",
  },

  widget: {
    title: "Fehlerprotokolle",
    loading: "Protokolle werden geladen...",
    empty: "Keine Fehlerprotokolle gefunden",
    header: {
      refresh: "Aktualisieren",
      runScan: "Scan starten",
      back: "Zurück",
      activeCount: "aktiv",
    },
    col: {
      message: "Nachricht",
      errorType: "Fehlertyp",
      occurrences: "Vorkommen",
      firstSeen: "Erstmals aufgetreten",
      createdAt: "Zuletzt aufgetreten",
    },
    status: {
      active: "Aktiv",
      resolved: "Gelöst",
    },
    action: {
      resolve: "Lösen",
      reopen: "Wieder öffnen",
    },
    detail: {
      stackTrace: "Stack-Trace",
      metadata: "Metadaten",
      collapse: "Einklappen",
      resolved: "Gelöst",
    },
    pagination: {
      info: "Seite {{page}} von {{totalPages}} ({{total}} gesamt)",
      prev: "Zurück",
      next: "Weiter",
    },
  },
};
