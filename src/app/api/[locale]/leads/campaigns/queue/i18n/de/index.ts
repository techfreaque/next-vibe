import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kampagnen-Warteschlange",
  description: "Leads, die aktuell in E-Mail-Kampagnen aktiv sind",
  get: {
    title: "Kampagnen-Warteschlange",
    description:
      "Paginierte Liste der Leads anzeigen, die aktuell in E-Mail-Kampagnen sind",
    fields: {
      page: {
        label: "Seite",
        description: "Seitenzahl",
      },
      pageSize: {
        label: "Seitengröße",
        description: "Anzahl der Datensätze pro Seite",
      },
      campaignType: {
        label: "Kampagnentyp",
        description: "Nach Kampagnentyp filtern",
      },
    },
    response: {
      leadId: "Lead-ID",
      leadEmail: "E-Mail",
      businessName: "Unternehmen",
      campaignType: "Kampagnentyp",
      journeyVariant: "Journey-Variante",
      currentStage: "Aktuelle Stufe",
      nextScheduledAt: "Nächste E-Mail",
      emailsSent: "Gesendet",
      emailsOpened: "Geöffnet",
      emailsClicked: "Geklickt",
      startedAt: "Gestartet am",
      total: "Gesamt",
      page: "Seite",
      pageSize: "Seitengröße",
      items: "Warteschlangen-Einträge",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um die Kampagnen-Warteschlange anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, die Kampagnen-Warteschlange anzuzeigen",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Abrufen der Kampagnen-Warteschlange ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Eingabeparameter",
      },
    },
    success: {
      title: "Warteschlange abgerufen",
      description: "Kampagnen-Warteschlange erfolgreich abgerufen",
    },
  },
  widget: {
    title: "Kampagnen-Warteschlange",
    refresh: "Aktualisieren",
    noData: "Keine Leads aktuell in Kampagnen",
    emptyDescription:
      "Wenn Leads in E-Mail-Kampagnen aufgenommen werden, erscheinen sie hier. Verwenden Sie den Kampagnen-Starter im Dashboard oder konfigurieren Sie den Zeitplaner in den Einstellungen.",
    empty: "Keine Leads gefunden",
    columnEmail: "E-Mail",
    columnBusiness: "Unternehmen",
    columnType: "Typ",
    columnStage: "Stufe",
    columnVariant: "Variante",
    columnNext: "Nächste E-Mail",
    columnSent: "Gesendet",
    columnOpen: "Geöffnet",
    columnClick: "Geklickt",
    columnStarted: "Gestartet",
    never: "—",
    pagination: "Seite {{page}} von {{totalPages}} · {{total}} Leads",
  },
};
