import type { translations as enTranslations } from "../en";

/**
*

* Template API Notifications subdomain translations for German
*/

export const translations: typeof enTranslations = {
  enums: {
    notificationType: {
      created: "Erstellt",
      updated: "Aktualisiert",
      published: "Veröffentlicht",
      deleted: "Gelöscht",
    },
    channel: {
      email: "E-Mail",
      sms: "SMS",
    },
  },
  notifications: {
    title: "Vorlagenbenachrichtigungen senden",
    description: "Vorlagenbenachrichtigungen per E-Mail und SMS senden",
    category: "Vorlagen-API",
    tags: {
      notifications: "Benachrichtigungen",
      email: "E-Mail",
      sms: "SMS",
    },
    form: {
      title: "Benachrichtigungskonfiguration",
      description: "Vorlagenbenachrichtigungseinstellungen konfigurieren",
    },

    // Field labels
    templateId: {
      label: "Vorlagen-ID",
      description:
        "Die ID der Vorlage, für die Benachrichtigungen gesendet werden sollen",
      placeholder: "Vorlagen-ID eingeben",
    },
    notificationType: {
      label: "Benachrichtigungstyp",
      description: "Wählen Sie die zu sendenden Benachrichtigungstypen aus",
      placeholder: "Benachrichtigungstypen auswählen",
    },
    channels: {
      label: "Benachrichtigungskanäle",
      description:
        "Wählen Sie die Kanäle aus, über die Benachrichtigungen gesendet werden sollen",
      placeholder: "Kanäle auswählen",
    },
    recipients: {
      label: "Empfänger",
      description: "Optionale Liste von Empfänger-IDs",
      placeholder: "Empfänger auswählen",
    },
    customMessage: {
      label: "Benutzerdefinierte Nachricht",
      description:
        "Optionale benutzerdefinierte Nachricht für die Benachrichtigung",
      placeholder:
        "Geben Sie Ihre benutzerdefinierte Nachricht ein (max. 500 Zeichen)",
    },

    // Response
    response: {
      title: "Benachrichtigungsergebnisse",
      description: "Ergebnisse des Benachrichtigungsversands",
    },

    // Debug messages
    debug: {
      sending: "Vorlagenbenachrichtigungen werden gesendet",
      emailSent: "E-Mail-Benachrichtigungen gesendet",
      smsSent: "SMS-Benachrichtigungen gesendet",
      sent: "Alle Benachrichtigungen erfolgreich gesendet",
    },

    // Errors
    errors: {
      validation: {
        title: "Ungültige Parameter",
        description: "Die Benachrichtigungsparameter sind ungültig",
        message: "Bitte überprüfen Sie Ihre Eingabeparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie haben keine Berechtigung zum Senden von Benachrichtigungen",
      },
      forbidden: {
        title: "Zugriff verboten",
        description:
          "Der Zugriff auf den Benachrichtigungsversand ist verboten",
      },
      notFound: {
        title: "Vorlage nicht gefunden",
        description: "Die angegebene Vorlage konnte nicht gefunden werden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Senden der Benachrichtigungen ist ein Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Benachrichtigungsdienst nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Bei der Verarbeitung Ihrer Anfrage ist ein Konflikt aufgetreten",
      },
    },

    // Success
    success: {
      title: "Benachrichtigungen gesendet",
      description: "Vorlagenbenachrichtigungen erfolgreich gesendet",
    },
  },
};
