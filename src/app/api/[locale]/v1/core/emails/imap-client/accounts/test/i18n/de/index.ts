import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "IMAP-Konto testen",
  description: "IMAP-Kontoverbindung testen",
  container: {
    title: "IMAP-Verbindung testen",
    description: "Verbindung zu einem IMAP-Konto testen",
  },
  accountId: {
    label: "Konto-ID",
    description: "ID des zu testenden IMAP-Kontos",
    placeholder: "Konto-ID eingeben",
  },
  response: {
    success: "Verbindung erfolgreich",
    connectionStatus: "Verbindungsstatus",
    message: "Testnachricht",
    details: {
      title: "Verbindungsdetails",
      description: "Detaillierte Verbindungsinformationen",
      host: "Host",
      port: "Port",
      secure: "Sichere Verbindung",
      authMethod: "Authentifizierungsmethode",
      responseTime: "Antwortzeit",
      serverCapabilities: "Server-Funktionen",
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Parameter angegeben",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verweigert",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindung fehlgeschlagen",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: {
      title: "Konfliktfehler",
      description: "Datenkonflikt aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
  },
  success: {
    title: "Erfolg",
    description: "IMAP-Kontotest erfolgreich abgeschlossen",
  },
  post: {
    title: "Test",
    description: "Test-Endpunkt",
    form: {
      title: "Test-Konfiguration",
      description: "Test-Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Test-Antwortdaten",
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
        description: "Interner Serverfehler aufgetreten",
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
