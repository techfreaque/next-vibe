import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    find_failed:
      "Rollensuche für Benutzer {{userId}} fehlgeschlagen: {{error}}",
    batch_find_failed:
      "Batch-Rollensuche für {{count}} Benutzer fehlgeschlagen: {{error}}",
    not_found: "Rolle {{role}} für Benutzer {{userId}} nicht gefunden",
    lookup_failed:
      "Rollenabfrage {{role}} für Benutzer {{userId}} fehlgeschlagen: {{error}}",
    add_failed:
      "Rolle {{role}} konnte Benutzer {{userId}} nicht zugewiesen werden: {{error}}",
    no_data_returned: "Keine Daten von der Datenbank zurückgegeben",
    remove_failed:
      "Rolle {{role}} konnte Benutzer {{userId}} nicht entzogen werden: {{error}}",
    check_failed:
      "Rollenprüfung {{role}} für Benutzer {{userId}} fehlgeschlagen: {{error}}",
    delete_failed:
      "Rollenlöschung für Benutzer {{userId}} fehlgeschlagen: {{error}}",
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
      cliAuthBypass: "CLI Auth Bypass",
      aiToolOff: "KI-Tool Deaktiviert",
      webOff: "Web Deaktiviert",
      mcpOff: "MCP Deaktiviert",
      mcpVisible: "MCP Sichtbar",
      productionOff: "Produktion Deaktiviert",
      skillOff: "Skill Deaktiviert",
    },
  },
};
