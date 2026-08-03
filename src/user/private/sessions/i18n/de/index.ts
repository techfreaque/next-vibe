import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  category: "Benutzer",

  widget: {
    back: "Zurück",
    loading: "Sitzungen werden geladen…",
    empty: "Keine aktiven Sitzungen",
    emptyHint: "Eine Sitzung wird bei jedem Login erstellt",
    browserSession: "Browser-Sitzung",
    revoke: "Widerrufen",
    revoking: "Wird widerrufen…",
    currentSession: "Aktuell",
    created: "Erstellt",
    expires: "Läuft ab",
    never: "Nie",
  },

  list: {
    title: "Meine Sitzungen",
    titleShort: "Meine Sitzungen",
    description: "Alle aktiven Sitzungen für Ihr Konto auflisten",
    tag: "Sitzungen",
    response: {
      sessions: "Sitzungen",
    },
    success: {
      title: "Sitzungen abgerufen",
      description: "Ihre aktiven Sitzungen wurden abgerufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
        detail: "Sitzungen konnten nicht geladen werden: {{error}}",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: { title: "Verboten", description: "Zugriff verboten" },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
    },
  },
  create: {
    title: "Sitzungstoken erstellen",
    titleShort: "Token erstellen",
    description:
      "Einen benannten Sitzungstoken für den programmatischen Zugriff erstellen",
    tag: "Sitzungen",
    form: {
      name: "Token-Name",
      namePlaceholder: "z.B. Mein Agent-Bot",
    },
    response: {
      token: "Token",
      id: "Sitzungs-ID",
      name: "Name",
      message: "Kopieren Sie diesen Token - er wird nicht wieder angezeigt",
    },
    success: {
      title: "Sitzung erstellt",
      description: "Ihr Sitzungstoken wurde erstellt",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
        detail: "Sitzungstoken konnte nicht erstellt werden: {{error}}",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: { title: "Verboten", description: "Zugriff verboten" },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
    },
  },
  revoke: {
    title: "Sitzung widerrufen",
    titleShort: "Sitzung widerrufen",
    description: "Einen Sitzungstoken nach ID widerrufen",
    tag: "Sitzungen",
    response: {
      message: "Sitzung widerrufen",
    },
    success: {
      title: "Sitzung widerrufen",
      description: "Die Sitzung wurde widerrufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
        detail: "Sitzung konnte nicht widerrufen werden: {{error}}",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: { title: "Verboten", description: "Zugriff verboten" },
      notFound: {
        title: "Nicht gefunden",
        description: "Sitzung nicht gefunden",
        detail: "Keine Sitzung mit der ID {{sessionId}} gehört zu Ihrem Konto",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
    },
  },
};
