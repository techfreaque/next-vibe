import type { translations as EnglishPostTranslations } from "../../../en/leadsErrors/leadsEngagement/post";

export const translations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Lead-Engagement-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Engagement-Daten und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Lead-Engagement nicht autorisiert",
      description: "Sie haben keine Berechtigung, Lead-Engagement zu erfassen",
    },
    server: {
      title: "Lead-Engagement Serverfehler",
      description:
        "Lead-Engagement konnte aufgrund eines Serverfehlers nicht erfasst werden",
    },
    unknown: {
      title: "Lead-Engagement fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler beim Erfassen des Lead-Engagements ist aufgetreten",
    },
    forbidden: {
      title: "Lead-Engagement verboten",
      description: "Sie haben keine Berechtigung, Lead-Engagement zu erfassen",
    },
  },
  success: {
    title: "Lead-Engagement erfasst",
    description: "Lead-Engagement erfolgreich erfasst",
  },
};
