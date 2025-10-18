import type { translations as EnglishStatsTranslations } from "../../../en/leadsErrors/campaigns/stats";

export const translations: typeof EnglishStatsTranslations = {
  error: {
    validation: {
      title: "Kampagnen-Statistik-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Statistikparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Kampagnen-Statistik-Zugriff verweigert",
      description:
        "Sie haben keine Berechtigung, Kampagnen-Statistiken anzuzeigen",
    },
    server: {
      title: "Kampagnen-Statistik-Serverfehler",
      description:
        "Statistiken können aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Kampagnen-Statistik-Operation fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Statistiken aufgetreten",
    },
    forbidden: {
      title: "Kampagnen-Statistik-Zugriff verboten",
      description:
        "Sie haben keine Berechtigung, Kampagnen-Statistiken anzuzeigen",
    },
    notFound: {
      title: "Kampagnen-Statistiken nicht gefunden",
      description:
        "Die angeforderten Kampagnen-Statistiken konnten nicht gefunden werden",
    },
  },
  success: {
    title: "Kampagnen-Statistiken geladen",
    description: "Kampagnen-Statistiken erfolgreich abgerufen",
  },
};
