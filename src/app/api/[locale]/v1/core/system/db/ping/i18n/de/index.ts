import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Datenbankoperationen",
  tag: "datenbank",
  post: {
    title: "Datenbank-Ping",
    description: "Datenbankverbindung und -status prüfen",
    form: {
      title: "Ping-Konfiguration",
      description: "Datenbank-Ping-Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Ping-Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für Datenbankoperationen erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Ping-Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Datenbank-Ping",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Datenbank-Ping aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Verbinden mit der Datenbank",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten - unzureichende Berechtigungen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Datenbankressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt während der Operation aufgetreten",
      },
    },
    success: {
      title: "Datenbank-Ping erfolgreich",
      description: "Erfolgreich mit Datenbank verbunden",
    },
  },
  fields: {
    silent: {
      title: "Stiller Modus",
      description: "Ping ohne Ausgabemeldungen ausführen",
    },
    keepConnectionOpen: {
      title: "Verbindung offen halten",
      description: "Datenbankverbindung nach Ping offen halten",
    },
    success: {
      title: "Erfolgsstatus",
    },
    isAccessible: {
      title: "Datenbank erreichbar",
    },
    output: {
      title: "Ausgabemeldung",
    },
    connectionInfo: {
      title: "Verbindungsinformationen",
      totalConnections: "Gesamtverbindungen",
      idleConnections: "Inaktive Verbindungen",
      waitingClients: "Wartende Clients",
    },
  },
  status: {
    success: "Erfolg",
    failed: "Fehlgeschlagen",
    timeout: "Zeitüberschreitung",
    error: "Fehler",
  },
  connectionType: {
    primary: "Primär",
    replica: "Replik",
    cache: "Cache",
  },
};
