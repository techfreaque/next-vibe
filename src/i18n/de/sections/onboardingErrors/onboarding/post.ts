import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/onboardingErrors/onboarding/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Onboarding-Erstellung-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Onboarding-Informationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Onboarding-Erstellung nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, Onboarding-Daten zu erstellen",
    },
    server: {
      title: "Onboarding-Erstellung-Serverfehler",
      description:
        "Onboarding-Daten konnten aufgrund eines Serverfehlers nicht erstellt werden",
    },
    unknown: {
      title: "Onboarding-Erstellung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Erstellen der Onboarding-Daten aufgetreten",
    },
  },
  success: {
    title: "Onboarding-Daten erfolgreich erstellt",
    description: "Ihr Onboarding-Fortschritt wurde gespeichert",
  },
};
