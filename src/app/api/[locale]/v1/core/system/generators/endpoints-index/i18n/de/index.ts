import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Endpoints-Index generieren",
    description: "Endpoints-Index-Datei generieren",
    container: {
      title: "Endpoints-Index-Konfiguration",
    },
    fields: {
      outputFile: {
        label: "Ausgabedatei",
        description: "Pfad zur Ausgabedatei",
      },
      dryRun: {
        label: "Probelauf",
        description: "Änderungen vorher ansehen ohne zu schreiben",
      },
      success: {
        title: "Erfolg",
      },
      message: {
        title: "Nachricht",
      },
      duration: {
        title: "Dauer",
      },
      endpointsFound: {
        title: "Endpoints gefunden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Endpoints-Index erfolgreich generiert",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
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
        description: "Netzwerkverbindung fehlgeschlagen",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcen-Konflikt",
      },
    },
  },
};
