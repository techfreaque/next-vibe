import type { translations as EnglishPostTranslations } from "../../../en/leadsErrors/leadsUnsubscribe/post";

export const translations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Lead-Abmeldung-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Abmeldeanfrage und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Lead-Abmeldung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Leads abzumelden",
    },
    server: {
      title: "Lead-Abmeldung Serverfehler",
      description:
        "Lead konnte aufgrund eines Serverfehlers nicht abgemeldet werden",
    },
    unknown: {
      title: "Lead-Abmeldung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler bei der Lead-Abmeldung ist aufgetreten",
    },
    forbidden: {
      title: "Lead-Abmeldung verboten",
      description: "Sie haben keine Berechtigung, Leads abzumelden",
    },
  },
  success: {
    title: "Lead abgemeldet",
    description: "Lead erfolgreich abgemeldet",
  },
};
