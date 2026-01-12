import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "E-Mails auflisten",
  description:
    "Eine paginierte Liste von E-Mails mit Filterung und Paginierung abrufen",
  container: {
    title: "E-Mail-Liste",
    description:
      "E-Mail-Listen-Parameter konfigurieren und Ergebnisse anzeigen",
  },
  filters: {
    title: "Filter",
    description: "E-Mails filtern und suchen",
  },
  displayOptions: {
    title: "Anzeigeoptionen",
  },
  fields: {
    dateRange: {
      title: "Datumsbereich",
    },
    page: {
      label: "Seite",
      description: "Seitenzahl für Paginierung",
      placeholder: "Seitenzahl eingeben",
    },
    limit: {
      label: "Grenzwert",
      description: "Anzahl der Elemente pro Seite",
      placeholder: "Grenzwert eingeben",
    },
    search: {
      label: "Suchen",
      description: "E-Mails nach Betreff, Empfänger oder Absender suchen",
      placeholder: "E-Mails suchen...",
    },
    status: {
      label: "Status",
      description: "Nach E-Mail-Status filtern",
      placeholder: "Status auswählen",
    },
    type: {
      label: "Typ",
      description: "Nach E-Mail-Typ filtern",
      placeholder: "Typ auswählen",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Feld zum Sortieren",
      placeholder: "Sortierfeld auswählen",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Richtung der Sortierreihenfolge",
      placeholder: "Sortierreihenfolge auswählen",
    },
    dateFrom: {
      label: "Datum von",
      description: "E-Mails ab diesem Datum filtern",
      placeholder: "Startdatum auswählen",
    },
    dateTo: {
      label: "Datum bis",
      description: "E-Mails bis zu diesem Datum filtern",
      placeholder: "Enddatum auswählen",
    },
  },
  response: {
    emails: {
      title: "E-Mails",
      emptyState: {
        title: "Keine E-Mails gefunden",
        description: "Keine E-Mails entsprechen Ihren aktuellen Filtern",
      },
      item: {
        title: "E-Mail",
        description: "E-Mail-Details",
        id: "ID",
        subject: "Betreff",
        recipientEmail: "Empfänger-E-Mail",
        recipientName: "Empfängername",
        senderEmail: "Absender-E-Mail",
        senderName: "Absendername",
        type: "Typ",
        status: "Status",
        templateName: "Vorlagenname",
        emailProvider: "E-Mail-Anbieter",
        externalId: "Externe ID",
        sentAt: "Gesendet am",
        deliveredAt: "Zugestellt am",
        openedAt: "Geöffnet am",
        clickedAt: "Geklickt am",
        retryCount: "Wiederholungsanzahl",
        error: "Fehler",
        userId: "Benutzer-ID",
        leadId: "Lead-ID",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        emailCore: {
          title: "Kerninformationen",
        },
        emailParties: {
          title: "Absender & Empfänger",
        },
        emailMetadata: {
          title: "Metadaten",
        },
        emailEngagement: {
          title: "Engagement-Tracking",
        },
        technicalDetails: {
          title: "Technische Details",
        },
        associatedIds: {
          title: "Zugehörige IDs",
        },
        timestamps: {
          title: "Zeitstempel",
        },
      },
    },
    pagination: {
      title: "Paginierung",
      description: "Paginierungsinformationen",
      page: "Aktuelle Seite",
      limit: "Elemente pro Seite",
      total: "Gesamtelemente",
      totalPages: "Gesamtseiten",
    },
    filters: {
      title: "Angewendete Filter",
      description: "Aktuell angewendete Filter",
      status: "Statusfilter",
      type: "Typfilter",
      search: "Suchanfrage",
      dateFrom: "Startdatum",
      dateTo: "Enddatum",
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Die bereitgestellten Parameter sind ungültig",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie müssen authentifiziert sein, um auf diese Ressource zuzugreifen",
    },
    forbidden: {
      title: "Verboten",
      description:
        "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsaved: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Die Anfrage steht im Konflikt mit dem aktuellen Zustand",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist aufgetreten",
    },
  },
  success: {
    title: "Erfolg",
    description: "E-Mails erfolgreich abgerufen",
  },
};
