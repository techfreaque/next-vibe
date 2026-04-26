/**
 * Support API translations (German)
 */

export const translations = {
  endpointCategories: {
    support: "Support",
  },

  sessions: {
    title: "Support-Warteschlange",
    description: "Offene und aktive Support-Sitzungen.",
    tags: { support: "Support", queue: "Warteschlange" },
    success: {
      title: "Sitzungen geladen",
      description: "Support-Sitzungen abgerufen.",
    },
    errors: {
      fetchFailed: "Sitzungen konnten nicht geladen werden.",
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war ungültig.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Bitte anmelden.",
      },
      forbidden: { title: "Kein Zugriff", description: "Nur für Admins." },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Sitzungen gefunden.",
      },
      server: { title: "Serverfehler", description: "Interner Fehler." },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler.",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen vorhanden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten.",
      },
    },
    widget: {
      noSessions: "Keine aktiven Support-Sitzungen",
      pending: "Ausstehend",
      active: "Aktiv",
      join: "Beitreten",
      close: "Schließen",
      ago: "vor",
      from: "von",
    },
  },

  join: {
    title: "Sitzung beitreten",
    description: "Einer ausstehenden Support-Sitzung beitreten.",
    tags: { support: "Support", join: "Beitreten" },
    fields: {
      sessionId: {
        label: "Sitzungs-ID",
        description: "Die Support-Sitzung, der beigetreten werden soll.",
      },
      threadId: { label: "Thread-ID", description: "Der Thread der Sitzung." },
      initiatorInstanceUrl: {
        label: "Initiator-URL",
        description: "URL der öffnenden Instanz.",
      },
    },
    systemMessage: "Ein Supporter ist der Sitzung beigetreten.",
    success: {
      title: "Beigetreten",
      description: "Du bist der Support-Sitzung beigetreten.",
    },
    errors: {
      sessionNotFound: "Support-Sitzung nicht gefunden.",
      alreadyJoined: "Diese Sitzung hat bereits einen aktiven Supporter.",
      callbackFailed:
        "Die initierende Instanz konnte nicht benachrichtigt werden.",
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war ungültig.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Bitte anmelden.",
      },
      forbidden: { title: "Kein Zugriff", description: "Nur für Admins." },
      notFound: {
        title: "Nicht gefunden",
        description: "Sitzung nicht gefunden.",
      },
      server: { title: "Serverfehler", description: "Interner Fehler." },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler.",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen vorhanden.",
      },
      conflict: { title: "Konflikt", description: "Sitzung bereits aktiv." },
    },
  },

  sessionJoined: {
    title: "Sitzung-Beigetreten-Callback",
    description: "Interner Callback — benachrichtigt die initierende Instanz.",
    tags: { support: "Support", callback: "Callback" },
    fields: {
      sessionId: {
        label: "Sitzungs-ID",
        description: "Die beigetretene Sitzung.",
      },
      threadId: {
        label: "Thread-ID",
        description: "Thread für die Systemnachricht.",
      },
      joinedMessage: {
        label: "Beitritts-Nachricht",
        description: "Systemnachricht für den Thread.",
      },
    },
    success: { title: "Bestätigt", description: "Beitritt bestätigt." },
    errors: {
      failed: "Callback konnte nicht verarbeitet werden.",
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war ungültig.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Bitte anmelden.",
      },
      forbidden: { title: "Kein Zugriff", description: "Nur für Admins." },
      notFound: {
        title: "Nicht gefunden",
        description: "Sitzung nicht gefunden.",
      },
      server: { title: "Serverfehler", description: "Interner Fehler." },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler.",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen vorhanden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten.",
      },
    },
  },

  close: {
    title: "Sitzung schließen",
    description: "Eine aktive Support-Sitzung beenden.",
    tags: { support: "Support", close: "Schließen" },
    fields: {
      sessionId: {
        label: "Sitzungs-ID",
        description: "Die zu schließende Sitzung.",
      },
      closed: {
        label: "Geschlossen",
        description: "Ob die Sitzung geschlossen wurde.",
      },
    },
    systemMessage: "Die Support-Sitzung wurde beendet.",
    success: {
      title: "Geschlossen",
      description: "Die Support-Sitzung wurde beendet.",
    },
    errors: {
      sessionNotFound: "Support-Sitzung nicht gefunden.",
      alreadyClosed: "Diese Sitzung ist bereits geschlossen.",
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war ungültig.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Bitte anmelden.",
      },
      forbidden: { title: "Kein Zugriff", description: "Nur für Admins." },
      notFound: {
        title: "Nicht gefunden",
        description: "Sitzung nicht gefunden.",
      },
      server: { title: "Serverfehler", description: "Interner Fehler." },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler.",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen vorhanden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Sitzung bereits geschlossen.",
      },
    },
  },
} as const;

export type SupportTranslations = typeof translations;
