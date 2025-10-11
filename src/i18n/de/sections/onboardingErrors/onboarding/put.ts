import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/onboardingErrors/onboarding/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Onboarding-Update-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Onboarding-Updates und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Onboarding-Update nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, Onboarding-Daten zu aktualisieren",
    },
    server: {
      title: "Onboarding-Update-Serverfehler",
      description:
        "Onboarding-Daten konnten aufgrund eines Serverfehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Onboarding-Update fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Aktualisieren der Onboarding-Daten aufgetreten",
    },
  },
  success: {
    title: "Onboarding erfolgreich abgeschlossen",
    description: "Ihr Onboarding-Prozess wurde abgeschlossen",
  },
};
