import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Wartung",
  },
  post: {
    title: "Gastmedien-Bereinigung",
    titleShort: "Gastmedien bereinigen",
    description:
      "Löscht Medien, die Gäste in Inkognito-Chats und eigenständigen Tool-Läufen erzeugt haben, sobald die Aufbewahrungsfrist abgelaufen ist. Nur Gäste ohne Registrierung oder Anmeldung. Gespeicherte Threads und Kontodateien bleiben unangetastet.",
    container: {
      title: "Gastmedien-Bereinigung",
      description: "Bereinigung ausführen oder testen",
    },
    fields: {
      batchSize: {
        label: "Max. Löschungen",
        description:
          "Höchstzahl gelöschter Dateien pro Lauf. Der Rest folgt im nächsten Lauf.",
      },
      dryRun: {
        label: "Testlauf",
        description: "Nur zählen und protokollieren, nichts löschen",
      },
    },
    response: {
      cutoff: "Stichtag",
      namespacesScanned: "Namensräume geprüft",
      storedThreadNamespaces: "Gespeicherte Threads übersprungen",
      filesScanned: "Dateien geprüft",
      eligibleFiles: "Dateien zur Löschung",
      eligibleBytes: "Bytes zur Löschung",
      filesDeleted: "Dateien gelöscht",
      bytesDeleted: "Bytes gelöscht",
      skippedTooNew: "Behalten: innerhalb der Frist",
      skippedUserOwned: "Behalten: kontogebunden",
      skippedUnowned: "Behalten: ohne Besitzer",
      skippedAccountLead: "Behalten: Lead mit Konto verknüpft",
      deferred: "Auf nächsten Lauf verschoben",
      failed: "Fehlgeschlagen",
      rowsDeleted: "Gelöschte Studio-Einträge",
      scanComplete: "Prüfung abgeschlossen",
      executionTimeMs: "Laufzeit (ms)",
    },
    success: {
      title: "Bereinigung abgeschlossen",
      description: "Abgelaufene Gastmedien entfernt",
    },
  },
  errors: {
    scheduledOnly:
      "Nur der geplante Gastmedien-Job in der Produktionsumgebung darf Dateien löschen.",
    failed: "Gastmedien-Bereinigung fehlgeschlagen: {{error}}",
    server: {
      title: "Bereinigungsfehler",
      description: "Gastmedien-Bereinigung fehlgeschlagen",
    },
  },
  task: {
    name: "Gastmedien-Bereinigung",
    description:
      "Tägliches Entfernen abgelaufener Gastmedien aus Inkognito-Chats und eigenständigen Tool-Läufen",
  },
};
