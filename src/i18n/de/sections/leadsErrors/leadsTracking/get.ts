import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/leadsErrors/leadsTracking/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Lead-Tracking-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Tracking-Parameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Lead-Tracking nicht autorisiert",
      description:
        "Sie haben keine Berechtigung für den Zugriff auf Lead-Tracking",
    },
    server: {
      title: "Lead-Tracking-Serverfehler",
      description:
        "Tracking kann aufgrund eines Serverfehlers nicht verarbeitet werden",
    },
    unknown: {
      title: "Lead-Tracking fehlgeschlagen",
      description: "Ein unerwarteter Fehler ist beim Lead-Tracking aufgetreten",
    },
    forbidden: {
      title: "Lead-Tracking-Zugriff verboten",
      description:
        "Sie haben keine Berechtigung für den Zugriff auf Lead-Tracking",
    },
    not_found: {
      title: "Lead nicht gefunden",
      description:
        "Der angeforderte Lead konnte für das Tracking nicht gefunden werden",
    },
  },
  success: {
    title: "Lead-Tracking erfolgreich",
    description: "Lead-Tracking erfolgreich aufgezeichnet",
  },
};
