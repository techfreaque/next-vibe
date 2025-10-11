import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "seed",
  post: {
    title: "Datenbank-Seed",
    description: "Datenbank mit Testdaten befüllen",
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
    verbose: {
      title: "Ausführliche Ausgabe",
      description: "Detaillierte Ausgabe während des Seedings anzeigen",
    },
    dryRun: {
      title: "Testlauf",
      description: "Seeding simulieren ohne Änderungen vorzunehmen",
    },
    success: {
      title: "Erfolgsstatus",
    },
    isDryRun: {
      title: "Testlauf-Modus",
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
