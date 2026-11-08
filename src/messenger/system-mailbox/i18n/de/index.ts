import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Plattform-Postfach",
  tag: "Plattform-Postfach",

  task: {
    description:
      "Tagesbericht zum Plattform-Status erstellen und vom Plattform-Postfach versenden",
  },

  send: {
    title: "Plattform-Mail senden",
    titleShort: "Mail senden",
    description:
      "Eine Transaktionsmail vom Plattform-Postfach senden und im Ordner Gesendet ablegen",
    container: {
      title: "Plattform-Mail senden",
      description:
        "Ein Empfänger, eine Nachricht. Nach der Zustellung im Ordner Gesendet abgelegt.",
    },
    fields: {
      to: {
        label: "Empfänger",
        description: "Eine einzelne E-Mail-Adresse",
        placeholder: "name@beispiel.de",
      },
      subject: {
        label: "Betreff",
        description: "Betreffzeile",
        placeholder: "Worum geht es?",
      },
      body: {
        label: "Nachricht",
        description: "Text-Inhalt",
        placeholder: "Nachricht schreiben...",
      },
      html: {
        label: "HTML-Inhalt",
        description: "Optionale einfache HTML-Fassung",
        placeholder: "<p>Optionales HTML</p>",
      },
    },
    response: {
      messageId: "Nachrichten-ID",
      from: "Von",
      to: "An",
      storedInSent: "In Gesendet abgelegt",
      sentFolder: "Ordner Gesendet",
      sentLastHour: "Versendet in der letzten Stunde",
      rateLimitPerHour: "Stundenlimit",
    },
    widget: {
      submit: "Mail senden",
      submitting: "Wird gesendet...",
      sent: "Mail gesendet",
      filed: "In Gesendet abgelegt",
      notFiled: "Zugestellt, aber nicht in Gesendet abgelegt",
      yes: "Ja",
      no: "Nein",
    },
    success: {
      title: "Mail gesendet",
      description: "Die Nachricht wurde an den Mailserver übergeben",
    },
  },

  inbox: {
    title: "Plattform-Posteingang",
    titleShort: "Posteingang",
    description: "Neueste INBOX-Nachrichten des Plattform-Postfachs auflisten",
    container: {
      title: "Plattform-Posteingang",
      description:
        "Neueste zuerst. Lesen markiert keine Nachricht als gelesen.",
    },
    fields: {
      limit: {
        label: "Limit",
        description: "Anzahl der Nachrichten (1-50)",
        placeholder: "20",
      },
      unreadOnly: {
        label: "Nur ungelesene",
        description: "Nur ungelesene Nachrichten zurückgeben",
      },
    },
    response: {
      address: "Postfach",
      messages: {
        title: "Nachrichten",
        uid: "UID",
        from: "Von",
        subject: "Betreff",
        date: "Datum",
        snippet: "Vorschau",
        unread: "Ungelesen",
      },
    },
    widget: {
      submit: "Posteingang aktualisieren",
      submitting: "Wird geladen...",
      empty: "Keine Nachrichten",
      emptyDescription: "Zu diesen Filtern gibt es nichts.",
      unread: "Ungelesen",
      noSubject: "(kein Betreff)",
      open: "Öffnen",
    },
    success: {
      title: "Posteingang geladen",
      description: "Nachrichten aus dem Plattform-Postfach abgerufen",
    },
  },

  message: {
    title: "Plattform-Mail lesen",
    titleShort: "Mail lesen",
    description: "Eine INBOX-Nachricht des Plattform-Postfachs per UID abrufen",
    container: {
      title: "Plattform-Mail lesen",
      description:
        "Voller Inhalt einer Nachricht. Markiert sie nicht als gelesen.",
    },
    fields: {
      uid: {
        label: "UID",
        description: "Nachrichten-UID aus der Posteingangsliste",
        placeholder: "42",
      },
    },
    response: {
      uid: "UID",
      from: "Von",
      to: "An",
      subject: "Betreff",
      date: "Datum",
      messageId: "Nachrichten-ID",
      unread: "Ungelesen",
      bodyText: "Inhalt",
    },
    widget: {
      submit: "Nachricht lesen",
      submitting: "Wird geladen...",
      unread: "Ungelesen",
      noSubject: "(kein Betreff)",
    },
    success: {
      title: "Nachricht geladen",
      description: "Nachricht aus dem Plattform-Postfach abgerufen",
    },
  },

  report: {
    title: "Täglicher Statusbericht",
    titleShort: "Tagesbericht",
    description:
      "Plattformbericht der letzten 24 Stunden erstellen und vom Plattform-Postfach senden",
    container: {
      title: "Täglicher Statusbericht",
      description:
        "Anmeldungen, Abos, Credit-Verbrauch, Funnel, Task-Vorfälle und Fehler. Reiner Text.",
    },
    fields: {
      to: {
        label: "Empfänger",
        description: "Leer lassen für die konfigurierte Berichtsadresse",
        placeholder: "name@beispiel.de",
      },
      dryRun: {
        label: "Nur Vorschau",
        description: "Bericht erstellen, aber nicht senden",
      },
    },
    response: {
      subject: "Betreff",
      body: "Bericht",
      recipient: "Empfänger",
      sent: "Gesendet",
      sections: "Enthaltene Abschnitte",
      skippedSections: "Übersprungene Abschnitte",
    },
    widget: {
      submit: "Bericht senden",
      submitting: "Wird erstellt...",
      sent: "Bericht gesendet",
      preview: "Vorschau",
    },
    success: {
      title: "Bericht bereit",
      description: "Der tägliche Statusbericht wurde erstellt",
    },
  },

  errors: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Nur Admins dürfen das Plattform-Postfach nutzen",
    },
    server: {
      title: "Serverfehler",
      description: "Die Anfrage an das Plattform-Postfach ist fehlgeschlagen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrageparameter",
    },
    notConfigured:
      "Das Plattform-Postfach ist nicht konfiguriert. THEA_MAIL_ADDRESS, THEA_MAIL_HOST und THEA_MAIL_PASSWORD setzen.",
    invalidRecipient:
      "Der Empfänger muss genau eine gültige E-Mail-Adresse sein",
    noRecipient:
      "Kein Empfänger. Einen angeben oder THEA_MAIL_REPORT_TO setzen.",
    rateLimited:
      "Stundenlimit erreicht ({{sent}} von {{limit}}). Später erneut versuchen.",
    smtpFailed: "Der Mailserver hat die Nachricht abgelehnt: {{error}}",
    imapFailed: "Postfach nicht erreichbar: {{error}}",
    messageNotFound: "Keine Nachricht mit dieser UID im Posteingang",
    reportFailed: "Bericht konnte nicht erstellt werden: {{error}}",
  },
};
