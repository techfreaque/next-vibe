import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/onboardingErrors/status/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Onboarding-Status-Validierung fehlgeschlagen",
      description: "Status-Anfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Onboarding-Status nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, den Onboarding-Status zu überprüfen",
    },
    server: {
      title: "Onboarding-Status-Serverfehler",
      description:
        "Onboarding-Status konnte aufgrund eines Serverfehlers nicht überprüft werden",
    },
    unknown: {
      title: "Onboarding-Status fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Überprüfen des Onboarding-Status aufgetreten",
    },
  },
};
