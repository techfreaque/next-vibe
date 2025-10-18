import type { translations as EnglishAdminTranslations } from "../../en/subscriptions/admin";

export const translations: typeof EnglishAdminTranslations = {
  title: "Abonnement-Verwaltung",
  description: "Benutzerabonnements, Pläne und Abrechnung verwalten",
  overview: {
    title: "Abonnement-Übersicht",
    description:
      "Abonnement-Statistiken anzeigen und Benutzerabonnements verwalten",
  },
  navigation: {
    overview: "Übersicht",
    list: "Alle Abonnements",
    add: "Abonnement hinzufügen",
    plans: "Pläne",
    settings: "Einstellungen",
  },
  actions: {
    refresh: "Aktualisieren",
    export: "Exportieren",
    exportCsv: "Als CSV exportieren",
    exportExcel: "Als Excel exportieren",
    addSubscription: "Abonnement hinzufügen",
    editSubscription: "Abonnement bearbeiten",
    cancelSubscription: "Abonnement kündigen",
    viewSubscription: "Abonnement anzeigen",
    activateSubscription: "Abonnement aktivieren",
    pauseSubscription: "Abonnement pausieren",
    resumeSubscription: "Abonnement fortsetzen",
  },
};
