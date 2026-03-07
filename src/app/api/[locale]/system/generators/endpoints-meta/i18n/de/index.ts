import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatoren",

  post: {
    title: "Endpoints-Meta generieren",
    description:
      "Lokalisierte Endpoint-Metadaten für das Tools-Modal generieren",
    container: {
      title: "Endpoints-Meta-Konfiguration",
    },
    fields: {
      outputDir: {
        label: "Ausgabeverzeichnis",
        description: "Verzeichnis für lokale Metadaten-Dateien",
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
      filesWritten: {
        title: "Dateien geschrieben",
      },
    },
    success: {
      title: "Erfolg",
      description: "Endpoints-Meta erfolgreich generiert",
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
  success: {
    generated: "Endpoints-Meta erfolgreich generiert",
  },
};
