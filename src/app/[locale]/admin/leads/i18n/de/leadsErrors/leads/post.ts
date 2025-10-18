import type { translations as EnglishPostTranslations } from "../../../en/leadsErrors/leads/post";

export const translations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Lead-Erstellung Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Lead-Informationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Lead-Erstellung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Leads zu erstellen",
    },
    server: {
      title: "Lead-Erstellung Serverfehler",
      description:
        "Lead konnte aufgrund eines Serverfehlers nicht erstellt werden",
    },
    unknown: {
      title: "Lead-Erstellung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler beim Erstellen des Leads ist aufgetreten",
    },
    forbidden: {
      title: "Lead-Erstellung verboten",
      description: "Sie haben keine Berechtigung, Leads zu erstellen",
    },
    duplicate: {
      title: "Lead bereits vorhanden",
      description:
        "Ein Lead mit dieser E-Mail-Adresse existiert bereits im System",
    },
    conflict: {
      title: "Lead bereits vorhanden",
      description:
        "Ein Lead mit dieser E-Mail-Adresse existiert bereits im System",
    },
  },
  success: {
    title: "Lead erstellt",
    description: "Lead erfolgreich erstellt",
  },
};
