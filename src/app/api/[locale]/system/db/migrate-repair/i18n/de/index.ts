export const translations = {
  category: "Datenbankoperationen",

  post: {
    title: "Datenbank-Migration Reparatur",
    description:
      "Migration-Tracking reparieren, um ordnungsgemäße Zustand für Produktions-Builds sicherzustellen",
    form: {
      title: "Migration-Reparatur Optionen",
      description:
        "Konfigurieren Sie die Einstellungen für die Migration-Reparatur-Operation",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Die bereitgestellten Migration-Reparatur-Parameter sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Verbindung zur Datenbank für Migration-Reparatur fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Migration-Reparatur-Operationen durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Migration-Reparatur-Operationen sind für Ihre Rolle nicht erlaubt",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Die angeforderte Migration-Reparatur-Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während der Migration-Reparatur aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist während der Migration-Reparatur aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist während der Migration-Reparatur-Operation aufgetreten",
      },
    },
    success: {
      title: "Migration-Reparatur erfolgreich",
      description: "Migration-Tracking wurde erfolgreich repariert",
    },
  },
  fields: {
    force: {
      title: "Operation erzwingen",
      description: "Reparatur ohne Bestätigungsaufforderungen erzwingen",
    },
    dryRun: {
      title: "Probelauf",
      description:
        "Zeigen was getan würde, ohne tatsächlich Änderungen auszuführen",
    },
    reset: {
      title: "Tracking zurücksetzen",
      description:
        "Migration-Tracking zurücksetzen (alle verfolgten Migrationen löschen)",
    },
    success: {
      title: "Erfolg",
    },
    output: {
      title: "Ausgabe",
    },
    hasTable: {
      title: "Hat Migration-Tabelle",
    },
    schema: {
      title: "Schema",
    },
    tableName: {
      title: "Tabellenname",
    },
    trackedMigrations: {
      title: "Verfolgte Migrationen",
    },
    migrationFiles: {
      title: "Migration-Dateien",
    },
    repaired: {
      title: "Repariert Anzahl",
    },
  },
  messages: {
    upToDate:
      "✅ Migration-Tracking ist auf dem neuesten Stand - keine Reparatur erforderlich",
    dryRunComplete: "✅ Probelauf abgeschlossen - keine Änderungen vorgenommen",
    repairComplete:
      "✅ Migration-Reparatur erfolgreich abgeschlossen! {{count}} Migrationen als angewendet markiert",
    success:
      "✅ Migration-Reparatur erfolgreich abgeschlossen! 🚀 Bereit für Produktions-Builds",
  },
  tag: "Datenbank",
};
