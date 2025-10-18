import type { translations as EnglishManageTranslations } from "../../../en/leadsErrors/campaigns/manage";

export const translations: typeof EnglishManageTranslations = {
  error: {
    validation: {
      title: "Kampagnen-Verwaltung-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Kampagnendaten und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Kampagnen-Verwaltung-Zugriff verweigert",
      description: "Sie haben keine Berechtigung, Kampagnen zu verwalten",
    },
    server: {
      title: "Kampagnen-Verwaltung-Serverfehler",
      description:
        "Kampagne kann aufgrund eines Serverfehlers nicht verwaltet werden",
    },
    unknown: {
      title: "Kampagnen-Verwaltung-Operation fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist während der Kampagnen-Verwaltung aufgetreten",
    },
    forbidden: {
      title: "Kampagnen-Verwaltung-Zugriff verboten",
      description: "Sie haben keine Berechtigung, Kampagnen zu verwalten",
    },
    notFound: {
      title: "Kampagne nicht gefunden",
      description: "Die angeforderte Kampagne konnte nicht gefunden werden",
    },
    campaignActive:
      "Aktive Kampagne kann nicht gelöscht werden. Bitte deaktivieren Sie sie zuerst.",
  },
  post: {
    success: {
      title: "Kampagne erstellt",
      description: "Kampagne erfolgreich erstellt",
    },
  },
  put: {
    success: {
      title: "Kampagne aktualisiert",
      description: "Kampagnen-Status erfolgreich aktualisiert",
    },
  },
  delete: {
    success: {
      title: "Kampagne gelöscht",
      description: "Kampagne erfolgreich gelöscht",
    },
  },
};
