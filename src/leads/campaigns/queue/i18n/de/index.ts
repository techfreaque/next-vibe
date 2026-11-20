import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kampagnen-Warteschlange",
  description: "Leads, die aktuell in E-Mail-Kampagnen aktiv sind",
  enums: {
    campaignType: {
      leadCampaign: "Lead-Kampagne",
      newsletter: "Newsletter",
      signupNurture: "Anmelde-Nurturing",
      retention: "Kundenbindung",
      winback: "Rückgewinnung",
      transactional: "Transaktional",
      notification: "Benachrichtigung",
      system: "System",
    },
    campaignTypeFilter: {
      all: "Alle",
    },
  },
  get: {
    title: "Kampagnen-Warteschlange",
    titleShort: "Kampagnenwarteschlange",
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
      nextSubject: "Geplanter Betreff",
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
    noData: "Keine Einträge in der Kampagnenwarteschlange",
    emptyDescription:
      "Hier stehen geplante E-Mails und Leads mit laufenden Kampagnen.",
    back: "Zurück",
    loading: "Kampagnenwarteschlange wird geladen",
    selectedLead: "Ausgewählter Lead",
    clearFilters: "Filter zurücksetzen",
    leadEmpty: "Keine Einträge für diesen Lead",
    firstPage: "Erste Seite öffnen",
    scheduledFor: "Geplant für {{date}}",
    noScheduledEmail: "Keine E-Mail geplant",
    deliveryStats:
      "{{sent}} gesendet · {{opened}} geöffnet · {{clicked}} geklickt",
    startedOn: "Gestartet am {{date}}",
    openLead: "Lead öffnen",
    openLeadNamed: "Lead {{recipient}} öffnen",
    previous: "Zurück",
    next: "Weiter",
    pagination: "Seite {{page}} von {{totalPages}} · {{total}} Leads",
  },
};
