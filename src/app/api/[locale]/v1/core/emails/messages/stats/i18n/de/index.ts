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
    timePeriod: {
      label: "Zeitraum",
      description: "Zeitraumgranularität für historische Daten",
    },
    dateRangePreset: {
      label: "Datumsbereich-Voreinstellung",
      description: "Vordefinierter Datumsbereich für Filterung",
    },
    dateFrom: {
      label: "Startdatum",
      description: "E-Mails ab diesem Datum filtern",
    },
    dateTo: {
      label: "Enddatum",
      description: "E-Mails bis zu diesem Datum filtern",
    },
    chartType: {
      label: "Diagrammtyp",
      description: "Visualisierungstyp für Diagramme",
    },
    includeComparison: {
      label: "Vergleich Einschließen",
      description: "Vergleich mit vorherigem Zeitraum einbeziehen",
    },
    sortBy: {
      label: "Sortieren Nach",
      description: "Feld zum Sortieren der E-Mails",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Reihenfolge der Sortierung (aufsteigend oder absteigend)",
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
      draftEmails: "Entwurf E-Mails",
      openRate: "Öffnungsrate",
      clickRate: "Klickrate",
      deliveryRate: "Zustellungsrate",
      bounceRate: "Rückweisungsrate",
      failureRate: "Fehlerrate",
      emailsByProvider: "E-Mails nach Anbieter",
      emailsByTemplate: "E-Mails nach Vorlage",
      emailsByStatus: "E-Mails nach Status",
      emailsByType: "E-Mails nach Typ",
      emailsWithUserId: "E-Mails mit Benutzer-ID",
      emailsWithoutUserId: "E-Mails ohne Benutzer-ID",
      emailsWithLeadId: "E-Mails mit Lead-ID",
      emailsWithoutLeadId: "E-Mails ohne Lead-ID",
      emailsWithErrors: "E-Mails mit Fehlern",
      emailsWithoutErrors: "E-Mails ohne Fehler",
      averageRetryCount: "Durchschnittliche Wiederholungsanzahl",
      maxRetryCount: "Maximale Wiederholungsanzahl",
      averageProcessingTime: "Durchschnittliche Verarbeitungszeit",
      averageDeliveryTime: "Durchschnittliche Zustellungszeit",
      historicalData: "Historische Daten",
      groupedStats: "Gruppierte Statistiken",
      generatedAt: "Generiert Am",
      dataRange: "Datenbereich",
      recentActivity: "Aktuelle Aktivität",
      topPerformingTemplates: "Top-Vorlagen",
      topPerformingProviders: "Top-Anbieter",
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
