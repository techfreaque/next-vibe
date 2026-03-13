import type { translations as en } from "../en";

export const translations: typeof en = {
  category: "System",

  errors: {
    repositoryInternalError: "Ein interner Fehler ist aufgetreten",
    fetchErrorGroups: "Fehlergruppen konnten nicht abgerufen werden",
    updateErrorGroup:
      "Der Status der Fehlergruppe konnte nicht aktualisiert werden",
  },

  statusFilter: {
    all: "Alle",
    active: "Aktiv",
    resolved: "Gelöst",
  },

  get: {
    title: "Fehlergruppen",
    description:
      "Gruppierte Fehler nach Fingerprint durchsuchen mit Filtern und Paginierung",
    tags: {
      monitoring: "Überwachung",
    },
    fields: {
      status: {
        label: "Status",
        description: "Nach Gruppenstatus filtern",
        placeholder: "Alle Status",
      },
      errorType: {
        label: "Fehlertyp",
        description: "Nach Fehlertyp filtern (Teilübereinstimmung)",
        placeholder: "z.B. INTERNAL_ERROR",
      },
      search: {
        label: "Suche",
        description: "In Fehlermeldungen suchen",
        placeholder: "Meldungen durchsuchen...",
      },
      startDate: {
        label: "Von",
        description: "Gruppen mit Fehlern nach diesem Datum anzeigen",
      },
      endDate: {
        label: "Bis",
        description: "Gruppen mit Fehlern vor diesem Datum anzeigen",
      },
      limit: {
        label: "Limit",
        description: "Anzahl der zurückzugebenden Gruppen",
        placeholder: "50",
      },
      offset: {
        label: "Versatz",
        description: "Anzahl der zu überspringenden Gruppen",
        placeholder: "0",
      },
    },
    response: {
      groups: {
        title: "Fehlergruppen",
      },
      totalCount: {
        title: "Gesamtanzahl",
      },
      hasMore: {
        title: "Weitere vorhanden",
      },
    },
    success: {
      title: "Gruppen abgerufen",
      description: "Fehlergruppen erfolgreich abgerufen",
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
        description: "Keine Gruppen gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehlergruppen konnten nicht abgerufen werden",
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

  patch: {
    title: "Fehlergruppe aktualisieren",
    description: "Eine Fehlergruppe nach Fingerprint lösen oder wieder öffnen",
    tags: {
      monitoring: "Überwachung",
    },
    fields: {
      fingerprint: {
        label: "Fingerprint",
        description: "Der Fingerprint der Fehlergruppe",
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
      title: "Gruppe aktualisiert",
      description: "Status der Fehlergruppe erfolgreich aktualisiert",
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
        description: "Fehlergruppe nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehlergruppe konnte nicht aktualisiert werden",
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

  widget: {
    title: "Fehlergruppen",
    loading: "Gruppen werden geladen...",
    empty: "Keine Fehlergruppen gefunden",
    header: {
      refresh: "Aktualisieren",
      activeGroups: "aktiv",
    },
    col: {
      status: "Status",
      message: "Meldung",
      errorType: "Fehlertyp",
      occurrences: "Vorkommen",
      firstSeen: "Erstmals aufgetreten",
      lastSeen: "Zuletzt aufgetreten",
    },
    status: {
      active: "Aktiv",
      resolved: "Gelöst",
    },
    action: {
      resolve: "Lösen",
      reopen: "Wieder öffnen",
    },
    pagination: {
      info: "Seite {{page}} von {{totalPages}} ({{total}} gesamt)",
      prev: "Zurück",
      next: "Weiter",
    },
  },
};
