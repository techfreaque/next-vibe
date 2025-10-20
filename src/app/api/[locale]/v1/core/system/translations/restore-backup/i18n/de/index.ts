import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Übersetzungssicherung wiederherstellen",
    description: "Übersetzungsdateien aus einer Sicherung wiederherstellen",
    container: {
      title: "Sicherung wiederherstellen",
      description:
        "Übersetzungsdateien aus einer angegebenen Sicherung wiederherstellen",
    },
    fields: {
      backupPath: {
        title: "Sicherungspfad",
        description:
          "Pfad zum Sicherungsverzeichnis, aus dem wiederhergestellt werden soll",
      },
      validateOnly: {
        title: "Nur validieren",
        description: "Nur die Sicherung validieren ohne wiederherzustellen",
      },
      createBackupBeforeRestore: {
        title: "Sicherung vor Wiederherstellung erstellen",
        description:
          "Sicherung des aktuellen Zustands vor der Wiederherstellung erstellen",
      },
    },
    messages: {
      validationSuccessful:
        "Sicherungsvalidierung erfolgreich - Sicherung ist gültig und kann wiederhergestellt werden",
      restoreSuccessful: "Sicherung erfolgreich wiederhergestellt",
      backupNotFound: "Sicherung am angegebenen Pfad nicht gefunden",
    },
    response: {
      title: "Wiederherstellungsergebnis",
      description: "Ergebnisse der Sicherungswiederherstellung",
      message: "Wiederherstellungsnachricht",
      backupInfo: {
        title: "Sicherungsinformationen",
        description: "Informationen über die wiederhergestellte Sicherung",
        backupPath: "Sicherungspfad",
        backupDate: "Sicherungsdatum",
        filesRestored: "Wiederhergestellte Dateien",
        newBackupCreated: "Neue Sicherung erstellt",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültiger Sicherungspfad oder Parameter",
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
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Sicherung nicht gefunden",
        description: "Die angegebene Sicherung existiert nicht",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt bei der Sicherungswiederherstellung aufgetreten",
      },
    },
    success: {
      title: "Sicherung wiederhergestellt",
      description: "Übersetzungssicherung erfolgreich wiederhergestellt",
    },
  },
};
