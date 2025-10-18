import type { translations as EnglishCommonTranslations } from "../../../en/leadsErrors/campaigns/common";

export const translations: typeof EnglishCommonTranslations = {
  error: {
    validation: {
      title: "Kampagnen-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Kampagnendaten und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Kampagnen-Zugriff verweigert",
      description: "Sie haben keine Berechtigung zum Zugriff auf Kampagnen",
    },
    server: {
      title: "Kampagnen-Serverfehler",
      description:
        "Kampagne kann aufgrund eines Serverfehlers nicht verarbeitet werden",
    },
    unknown: {
      title: "Kampagnen-Operation fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist während der Kampagnen-Operation aufgetreten",
    },
    forbidden: {
      title: "Kampagnen-Zugriff verboten",
      description: "Sie haben keine Berechtigung für diese Kampagnen-Operation",
    },
    notFound: {
      title: "Kampagne nicht gefunden",
      description: "Die angeforderte Kampagne konnte nicht gefunden werden",
    },
  },
};
