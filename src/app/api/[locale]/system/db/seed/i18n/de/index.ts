import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Datenbankoperationen",

  tag: "seed",
  post: {
    title: "Datenbank-Seed",
    description: "Datenbank mit Daten befüllen",
    form: {
      title: "Seed-Konfiguration",
      description: "Seed-Parameter konfigurieren",
    },
    response: {
      title: "Seed-Antwort",
      description: "Ergebnisse der Datenbank-Seed-Operation",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für Datenbank-Seed erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Seed-Parameter angegeben",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Seeding",
      },
      internal: {
        title: "Interner Fehler",
        description: "Datenbank-Seed-Vorgang fehlgeschlagen",
      },
      database: {
        title: "Datenbankfehler",
        description: "Datenbankfehler beim Seeding aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist beim Seeding aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Seeding",
      },
      forbidden: {
        title: "Verboten",
        description: "Unzureichende Berechtigungen für Datenbank-Seed",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Seed-Ressourcen nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Seeding erkannt",
      },
    },
    success: {
      title: "Datenbank geseeded",
      description: "Datenbank-Seeding erfolgreich abgeschlossen",
    },
  },
  fields: {
    environment: {
      title: "Umgebung",
      description: "Ziel-Seed-Umgebung (dev, test, prod)",
    },
    success: {
      title: "Erfolgsstatus",
    },
    seedsExecuted: {
      title: "Ausgeführte Seeds",
    },
    collections: {
      title: "Seed-Sammlungen",
      item: {
        title: "Sammlung",
      },
      name: {
        title: "Sammlungsname",
      },
      status: {
        title: "Status",
      },
      recordsCreated: {
        title: "Erstellte Datensätze",
      },
    },
    totalRecords: {
      title: "Gesamte Datensätze",
    },
    duration: {
      title: "Dauer (ms)",
    },
  },
};
