import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "E-Mail-Statistiken Abrufen",
    description: "Umfassende E-Mail-Statistiken und Metriken abrufen",
    form: {
      title: "E-Mail-Statistiken Anfrage",
      description: "Parameter für die Abfrage von E-Mail-Statistiken",
    },
    startDate: {
      label: "Startdatum",
      description: "Startdatum für den Statistikzeitraum",
    },
    endDate: {
      label: "Enddatum",
      description: "Enddatum für den Statistikzeitraum",
    },
    accountId: {
      label: "Konto-ID",
      description: "Statistiken nach spezifischem Konto filtern",
    },
    type: {
      label: "E-Mail-Typ",
      description: "Nach E-Mail-Typ filtern",
      options: {
        all: "Alle",
        sent: "Gesendet",
        received: "Empfangen",
        draft: "Entwurf",
        trash: "Papierkorb",
      },
    },
    groupBy: {
      label: "Gruppieren Nach",
      description: "Wie die Statistiken gruppiert werden sollen",
      options: {
        day: "Nach Tag",
        week: "Nach Woche",
        month: "Nach Monat",
        account: "Nach Konto",
        type: "Nach Typ",
      },
    },
    includeDetails: {
      label: "Details Einschließen",
      description: "Detaillierte Aufschlüsselung in Ergebnisse einbeziehen",
    },
    status: {
      label: "E-Mail-Status",
      description: "Nach E-Mail-Status filtern",
    },
    search: {
      label: "Suchen",
      description: "E-Mails nach Betreff oder Empfänger suchen",
    },
    response: {
      title: "E-Mail-Statistiken Antwort",
      description: "Umfassende E-Mail-Statistiken und Metrikdaten",
      totalEmails: "E-Mails Gesamt",
      sentEmails: "Gesendete E-Mails",
      deliveredEmails: "Zugestellte E-Mails",
      openedEmails: "Geöffnete E-Mails",
      clickedEmails: "Geklickte E-Mails",
      bouncedEmails: "Zurückgewiesene E-Mails",
      failedEmails: "Fehlgeschlagene E-Mails",
      openRate: "Öffnungsrate",
      clickRate: "Klickrate",
      deliveryRate: "Zustellungsrate",
    },
    errors: {
      unauthorized: {
        title: "Nicht Autorisiert",
        description:
          "Authentifizierung erforderlich für Zugriff auf E-Mail-Statistiken",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter bereitgestellt",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Abrufen der Statistiken",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Abrufen der Statistiken",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf E-Mail-Statistiken ist verboten",
      },
      notFound: {
        title: "Nicht Gefunden",
        description: "E-Mail-Statistiken nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Abrufen der Statistiken aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "E-Mail-Statistiken erfolgreich abgerufen",
    },
  },
};
