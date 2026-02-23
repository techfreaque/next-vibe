export const translations = {
  category: "Datenbankoperationen",

  post: {
    title: "Datenbank-Migration Synchronisation",
    description:
      "Synchronisieren Sie den Migration-Status, indem Sie Drizzle das Tracking ordnungsgemäß handhaben lassen und Konflikte vermeiden",
    form: {
      title: "Migration-Synchronisation Optionen",
      description:
        "Konfigurieren Sie die Einstellungen für Migration-Synchronisation-Operationen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Die bereitgestellten Migration-Synchronisation-Parameter sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Verbindung zur Datenbank für Migration-Synchronisation fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Migration-Synchronisation-Operationen durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Migration-Synchronisation-Operationen sind für Ihre Rolle nicht erlaubt",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Die angeforderte Migration-Synchronisation-Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während der Migration-Synchronisation aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist während der Migration-Synchronisation aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist während der Migration-Synchronisation-Operation aufgetreten",
      },
    },
    success: {
      title: "Migration-Synchronisation erfolgreich",
      description: "Migration-Status wurde erfolgreich synchronisiert",
    },
  },
  fields: {
    force: {
      title: "Operation erzwingen",
      description: "Synchronisation ohne Bestätigungsaufforderungen erzwingen",
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
    trackingCleared: {
      title: "Tracking gelöscht",
    },
    trackingFilesCreated: {
      title: "Tracking-Dateien erstellt",
    },
    drizzleMigrationRun: {
      title: "Drizzle-Migration ausgeführt",
    },
    originalFilesRestored: {
      title: "Originaldateien wiederhergestellt",
    },
    migrationsProcessed: {
      title: "Migrationen verarbeitet",
    },
  },
  messages: {
    dryRunComplete: "✅ Probelauf abgeschlossen - keine Änderungen vorgenommen",
    success:
      "✅ Migration-Synchronisation erfolgreich abgeschlossen! 🚀 Migrationen werden jetzt ordnungsgemäß von Drizzle verfolgt",
  },
  tag: "Datenbank",
};
