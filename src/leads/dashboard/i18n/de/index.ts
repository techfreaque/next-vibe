import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    leads: "leads",
    dashboard: "übersicht",
  },
  get: {
    title: "Lead-Übersicht",
    titleShort: "Lead-Übersicht",
    description:
      "Aktuelle Zahlen zu aktiven Leads, Neuzugängen, laufenden Kampagnen und Conversions",
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Übersichtsdaten konnten nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung fehlgeschlagen",
      },
      forbidden: {
        title: "Verboten",
        description: "Kein Zugriff auf diese Daten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Übersichtsdaten nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Datenkonflikt ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Übersichtsdaten geladen",
    },
    response: {
      activeLeadsCount: "Aktive Leads",
      newThisWeekCount: "Neu diese Woche",
      runningCampaignsCount: "Laufende Kampagnen",
      convertedCount: "Konvertiert",
      totalLeadsCount: "Leads gesamt",
      conversionRate: "Konversionsrate",
      statusBreakdown: "Status-Verteilung",
      recentLeads: "Neueste Leads",
      "recentLeads.id": "ID",
      "recentLeads.businessName": "Firmenname",
      "recentLeads.email": "E-Mail",
      "recentLeads.status": "Status",
      "recentLeads.source": "Quelle",
      "recentLeads.createdAt": "Erstellt am",
    },
  },
  widget: {
    loading: "Übersicht wird geladen...",
    activeLeads: "Aktive Leads",
    newThisWeek: "Neu diese Woche",
    runningCampaigns: "In Kampagne",
    converted: "Konvertiert",
    totalLeads: "Leads gesamt",
    conversionRate: "Konversionsrate",
    quickActions: "Schnellzugriff",
    newLead: "Neuer Lead",
    newLeadDesc: "Lead manuell anlegen",
    allLeads: "Alle Leads",
    allLeadsDesc: "Alle Leads durchsuchen und filtern",
    campaignStats: "Kampagnenstatistiken",
    campaignStatsDesc: "Kampagnen-Performance analysieren",
    searchLeads: "Leads suchen",
    searchLeadsDesc: "Nach Name oder E-Mail suchen",
    importLeads: "Import",
    importLeadsDesc: "Leads per CSV-Datei importieren",
    statusBreakdown: "Status-Verteilung",
    recentLeads: "Neueste Leads",
    viewAll: "Alle anzeigen",
    noLeadsYet: "Noch keine Leads",
    noLeadsHint: "Erstelle deinen ersten Lead oder importiere per CSV",
    createFirst: "Lead erstellen",
  },
};
