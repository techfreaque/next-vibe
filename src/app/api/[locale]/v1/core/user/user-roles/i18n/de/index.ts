import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      cliOnly: "Nur CLI",
      cliWeb: "CLI Web",
      webOnly: "Nur Web",
    },
  },
};
