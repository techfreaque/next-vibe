import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    sessionErrorReason: {
      noTokenInCookies: "Kein Token in Cookies",
    },
  },
  errors: {
    session_not_found: "Sitzung für Token {{token}} nicht gefunden",
    session_token_missing: "Kein Sitzungstoken gefunden ({{reason}})",
    session_lookup_failed:
      "Sitzungsabfrage {{token}} fehlgeschlagen: {{error}}",
    current_session_failed:
      "Aktuelle Sitzung konnte nicht gelesen werden: {{error}}",
    expired_sessions_delete_failed:
      "Löschen abgelaufener Sitzungen fehlgeschlagen",
    session_creation_failed:
      "Sitzungserstellung für Benutzer {{userId}} fehlgeschlagen",
    session_creation_database_error:
      "Datenbankfehler bei Sitzungserstellung für Benutzer {{userId}}: {{error}}",
    user_sessions_delete_failed:
      "Sitzung {{sessionId}} konnte nicht gelöscht werden: {{error}}",
    expired: "Sitzung ist am {{expiresAt}} abgelaufen",
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
