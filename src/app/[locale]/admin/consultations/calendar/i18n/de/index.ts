import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  calendar: {
    title: "Kalenderansicht",
    navigation: {
      today: "Heute",
      previousMonth: "Vorheriger Monat",
      nextMonth: "Nächster Monat",
    },
    filters: {
      showFilters: "Filter anzeigen",
      hideFilters: "Filter ausblenden",
      status: "Statusfilter",
      dateRange: "Datumsbereich",
    },
    view: {
      loading: "Kalender wird geladen...",
      noConsultations: "Keine Beratungen für diesen Zeitraum geplant",
      dayView: "Tagesansicht",
      monthView: "Monatsansicht",
      consultationDetails: "Beratungsdetails",
    },
    consultation: {
      scheduled: "Geplant",
      pending: "Ausstehend",
      completed: "Abgeschlossen",
      cancelled: "Abgesagt",
      noShow: "Nicht erschienen",
      editConsultation: "Beratung bearbeiten",
      viewDetails: "Details anzeigen",
    },
  },
};
