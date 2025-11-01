import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    find_failed: "Benutzerrollen konnten nicht gefunden werden",
    not_found: "Benutzerrolle nicht gefunden",
    lookup_failed: "Benutzerrolle konnte nicht abgerufen werden",
    add_failed: "Rolle konnte nicht zum Benutzer hinzugefügt werden",
    no_data_returned: "Keine Daten von der Datenbank zurückgegeben",
    remove_failed: "Rolle konnte nicht vom Benutzer entfernt werden",
    check_failed: "Überprüfung ob Benutzer Rolle hat fehlgeschlagen",
    delete_failed: "Benutzerrollen konnten nicht gelöscht werden",
    endpoint_not_created: "Benutzerrollen-Endpoint wurde noch nicht erstellt",
  },
  post: {
    title: "Benutzerrollen",
    description: "Benutzerrollen-Endpunkt",
    form: {
      title: "Benutzerrollen-Konfiguration",
      description: "Benutzerrollen-Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Benutzerrollen-Antwortdaten",
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
      database_connection_failed: {
        title: "Datenbankverbindung fehlgeschlagen",
        description: "Verbindung zur Datenbank fehlgeschlagen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  enums: {
    userRole: {
      public: "Öffentlich",
      customer: "Kunde",
      partnerAdmin: "Partner-Administrator",
      partnerEmployee: "Partner-Mitarbeiter",
      admin: "Administrator",
      cliOff: "CLI Deaktiviert",
      aiToolOff: "KI-Tool Deaktiviert",
      webOff: "Web Deaktiviert",
      productionOff: "Produktion Deaktiviert",
    },
  },
};
