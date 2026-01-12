export const translations = {
  post: {
    title: "Produktions-Datenbank-Migration",
    description:
      "Führen Sie Produktions-Datenbank-Migrationen mit Sicherheitsprüfungen für CI/CD-Pipelines aus",
    form: {
      title: "Produktions-Migration Optionen",
      description:
        "Konfigurieren Sie die Einstellungen für Produktions-Migration-Operationen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Die bereitgestellten Produktions-Migration-Parameter sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Verbindung zur Datenbank für Produktions-Migration fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Produktions-Migration-Operationen durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Produktions-Migration-Operationen sind für Ihre Rolle nicht erlaubt",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Die angeforderte Produktions-Migration-Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während der Produktions-Migration aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist während der Produktions-Migration aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist während der Produktions-Migration-Operation aufgetreten",
      },
    },
    success: {
      title: "Produktions-Migration erfolgreich",
      description: "Produktions-Migration wurde erfolgreich abgeschlossen",
    },
  },
  fields: {
    skipSeeding: {
      title: "Seeding überspringen",
      description: "Produktions-Seeding nach Migrationen überspringen",
    },
    force: {
      title: "Operation erzwingen",
      description: "Operationen ohne Bestätigungsaufforderungen erzwingen",
    },
    dryRun: {
      title: "Probelauf",
      description:
        "Zeigen was getan würde, ohne tatsächlich Änderungen auszuführen",
    },
    success: {
      title: "Erfolg",
    },
    output: {
      title: "Ausgabe",
    },
    environment: {
      title: "Umgebung",
    },
    databaseUrl: {
      title: "Datenbank-URL",
    },
    migrationsGenerated: {
      title: "Migrationen generiert",
    },
    migrationsApplied: {
      title: "Migrationen angewendet",
    },
    seedingCompleted: {
      title: "Seeding abgeschlossen",
    },
  },
  messages: {
    dryRunComplete: "✅ Probelauf abgeschlossen - keine Änderungen vorgenommen",
    successWithSeeding:
      "✅ Produktions-Migration erfolgreich abgeschlossen! 🚀 Bereit für Deployment",
    successWithoutSeeding:
      "✅ Produktions-Migration erfolgreich abgeschlossen (Seeding übersprungen)! 🚀 Bereit für Deployment",
  },
  errors: {
    notProduction:
      "❌ NODE_ENV ist nicht auf 'production' gesetzt. Verwenden Sie --force zum Überschreiben.",
    noDatabaseUrl: "❌ DATABASE_URL Umgebungsvariable ist erforderlich",
    localhostDatabase:
      "❌ DATABASE_URL scheint localhost zu sein. Verwenden Sie --force zum Überschreiben.",
  },
  tag: "Datenbank",
};
